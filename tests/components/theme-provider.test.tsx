import { render, screen } from '@testing-library/react'

import { ThemeProvider } from '@/components/theme-provider'

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider attribute="class">
        <div>Test Child</div>
      </ThemeProvider>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })
})
