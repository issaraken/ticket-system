import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import Toastify from '@components/toast/Toastify'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ticket App',
  description: 'Generated Ticket app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} !bg-gray-100 antialiased`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <div className="min-h-screen max-w-6xl p-4 md:mx-auto md:py-6">
            <div className="">{children}</div>
          </div>
          <Toastify />
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
