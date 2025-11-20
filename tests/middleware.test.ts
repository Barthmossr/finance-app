import { NextRequest, NextResponse } from 'next/server'

import { updateSession } from '@/lib/middleware'
import { middleware } from '@/middleware'

jest.mock('@/lib/middleware', () => ({
  updateSession: jest.fn(),
}))

describe('middleware', () => {
  it('should call updateSession', async () => {
    const mockRequest = {} as NextRequest
    const mockResponse = {} as NextResponse
    ;(updateSession as jest.Mock).mockResolvedValue(mockResponse)

    const response = await middleware(mockRequest)

    expect(updateSession).toHaveBeenCalledWith(mockRequest)
    expect(response).toBe(mockResponse)
  })
})
