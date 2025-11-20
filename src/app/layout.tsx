import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AuthProvider } from '@/components/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const metadata: Metadata = {
  title: 'Finance App',
  description: 'Track your expenses with style.',
}

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export { metadata }
export { RootLayout as default }
