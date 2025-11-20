import { render, screen } from '@testing-library/react'

import Page from '@/app/page'

describe('Page', () => {
  it('renders heading', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Finance Dashboard'
    )
  })
})
