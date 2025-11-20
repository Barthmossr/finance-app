import { NextRequest, NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'

import { updateSession } from '@/lib/middleware'

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn(),
  },
}))

describe('updateSession', () => {
  let mockSupabase: { auth: { getUser: jest.Mock } }
  let mockRequest: NextRequest
  let mockResponse: { cookies: { set: jest.Mock } }

  beforeEach(() => {
    jest.clearAllMocks()

    mockResponse = {
      cookies: {
        set: jest.fn(),
      },
    }
    ;(NextResponse.next as jest.Mock).mockReturnValue(mockResponse)
    ;(NextResponse.redirect as jest.Mock).mockImplementation((url) => ({
      redirected: true,
      url,
    }))

    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
    }
    ;(createServerClient as jest.Mock).mockReturnValue(mockSupabase)

    mockRequest = {
      headers: new Headers(),
      cookies: {
        getAll: jest.fn(),
        set: jest.fn(),
      },
      nextUrl: {
        pathname: '/',
        clone: jest.fn().mockReturnThis(),
      },
    } as unknown as NextRequest
  })

  it('should update session and return response when user is authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: '123' } },
    })

    const response = await updateSession(mockRequest)

    expect(createServerClient).toHaveBeenCalled()
    expect(mockSupabase.auth.getUser).toHaveBeenCalled()
    expect(response).toBe(mockResponse)
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('should redirect to login when user is not authenticated and on protected route', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    })
    ;(mockRequest.nextUrl as unknown as { pathname: string }).pathname =
      '/dashboard'

    await updateSession(mockRequest)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login' })
    )
  })

  it('should not redirect when user is not authenticated but on public route', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    })
    ;(mockRequest.nextUrl as unknown as { pathname: string }).pathname =
      '/login'

    const response = await updateSession(mockRequest)

    expect(NextResponse.redirect).not.toHaveBeenCalled()
    expect(response).toBe(mockResponse)
  })

  it('should handle cookie management', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: '123' } },
    })

    // Trigger the cookie callback logic
    // This part is tricky because it's inside the createServerClient callback
    // We need to simulate how createServerClient calls these callbacks
    // But since we mocked createServerClient, we need to inspect the calls to it
    // and invoke the callbacks manually if we want to test them, OR rely on the fact
    // that we are testing the integration of updateSession which sets up these callbacks.

    // Actually, the callbacks are defined INSIDE updateSession and passed TO createServerClient.
    // So to test them, we need to grab the options passed to createServerClient and call them.

    await updateSession(mockRequest)

    const cookieOptions = (createServerClient as jest.Mock).mock.calls[0][2]
      .cookies

    // Test getAll
    cookieOptions.getAll()
    expect(mockRequest.cookies.getAll).toHaveBeenCalled()

    // Test setAll
    const cookiesToSet = [{ name: 'foo', value: 'bar', options: {} }]
    cookieOptions.setAll(cookiesToSet)

    expect(mockRequest.cookies.set).toHaveBeenCalledWith('foo', 'bar')
    expect(mockResponse.cookies.set).toHaveBeenCalledWith('foo', 'bar', {})
  })
})
