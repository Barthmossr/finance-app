import { act } from 'react'

import { render, screen, waitFor } from '@testing-library/react'

import { AuthProvider, useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase'

import { mockOnAuthStateChange, mockUnsubscribe } from '../mocks'

jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(),
}))

function TestComponent() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return <div>{user ? 'Logged In' : 'Logged Out'}</div>
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children and handle auth state', async () => {
    let authCallback: (event: string, session: unknown) => void = () => {}
    mockOnAuthStateChange.mockImplementation((callback) => {
      authCallback = callback
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
    })
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        onAuthStateChange: mockOnAuthStateChange,
      },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled()
    })

    act(() => {
      authCallback('SIGNED_IN', { user: { id: '123' } })
    })

    await waitFor(() => {
      expect(screen.getByText('Logged In')).toBeInTheDocument()
    })

    act(() => {
      authCallback('SIGNED_OUT', null)
    })

    await waitFor(() => {
      expect(screen.getByText('Logged Out')).toBeInTheDocument()
    })
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    const originalError = console.error
    console.error = jest.fn()

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    )

    console.error = originalError
  })
})
