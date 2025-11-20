import { render, screen } from '@testing-library/react'

import Dashboard from '@/app/page'

jest.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))
jest.mock('@/components/user-nav', () => ({
  UserNav: () => <div data-testid="user-nav">UserNav</div>,
}))

describe('Dashboard', () => {
  it('should render dashboard with child components', () => {
    render(<Dashboard />)
    expect(screen.getByText('Finance Dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('user-nav')).toBeInTheDocument()
  })
})
