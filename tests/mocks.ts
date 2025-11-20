export const mockSignInWithOAuth = jest.fn()
export const mockSignOut = jest.fn()
export const mockOnAuthStateChange = jest.fn()
export const mockUnsubscribe = jest.fn()

export const mockSupabaseClient = {
  auth: {
    signInWithOAuth: mockSignInWithOAuth,
    signOut: mockSignOut,
    onAuthStateChange: mockOnAuthStateChange,
  },
}

export const mockUser = {
  id: '123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
  },
}

export const mockSession = {
  user: mockUser,
  access_token: 'token',
  refresh_token: 'refresh_token',
  expires_in: 3600,
  token_type: 'bearer',
}
