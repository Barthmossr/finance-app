import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuth } from '@/components/auth-provider'
import { UserNav } from '@/components/user-nav'
import { createClient } from '@/lib/supabase'

import { mockSignOut, mockUser } from '../mocks'

jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/components/auth-provider', () => ({
  ...jest.requireActual('@/components/auth-provider'),
  useAuth: jest.fn(),
}))

describe('UserNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    })
  })

  it('should render sign in button when not logged in', () => {
    ;(useAuth as jest.Mock).mockReturnValue({ user: null })
    render(<UserNav />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('should render user avatar and handle sign out', async () => {
    const user = userEvent.setup()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    })

    render(<UserNav />)
    const avatarButton = screen.getByRole('button')
    expect(avatarButton).toBeInTheDocument()

    await user.click(avatarButton)
    const logoutItem = await screen.findByText('Log out')
    await user.click(logoutItem)

    expect(mockSignOut).toHaveBeenCalled()
  })
})
