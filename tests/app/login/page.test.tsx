import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import LoginPage from '@/app/login/page'
import { createClient } from '@/lib/supabase'

import { mockSignInWithOAuth } from '../../mocks'

jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    })
  })

  it('should render sign in button', () => {
    render(<LoginPage />)
    expect(
      screen.getByRole('button', { name: /sign in with google/i })
    ).toBeInTheDocument()
  })

  it('should call signInWithOAuth when button is clicked', async () => {
    render(<LoginPage />)
    const button = screen.getByRole('button', { name: /sign in with google/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })
    expect(button).not.toBeDisabled()
  })

  it('should handle error during sign in', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSignInWithOAuth.mockRejectedValueOnce(new Error('Sign in failed'))

    render(<LoginPage />)
    const button = screen.getByRole('button', { name: /sign in with google/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalled()
    })

    expect(button).not.toBeDisabled()
    consoleSpy.mockRestore()
  })
})
