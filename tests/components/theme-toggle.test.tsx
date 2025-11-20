import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeToggle } from '@/components/theme-toggle'

const mockSetTheme = jest.fn()
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeToggle', () => {
  it('should render toggle button and change theme', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()

    await user.click(button)

    const lightItem = await screen.findByText('Light')
    await user.click(lightItem)
    expect(mockSetTheme).toHaveBeenCalledWith('light')

    await user.click(button)
    const darkItem = await screen.findByText('Dark')
    await user.click(darkItem)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')

    await user.click(button)
    const systemItem = await screen.findByText('System')
    await user.click(systemItem)
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })
})
