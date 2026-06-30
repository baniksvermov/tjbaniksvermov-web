import type { Metadata } from 'next'
import { Inter, Anton } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/shop/CartProvider'
import CartDrawer from '@/components/shop/CartDrawer'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
})

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    default: 'TJ Baník Švermov',
    template: '%s | TJ Baník Švermov',
  },
  description:
    'Fotbalový klub TJ Baník Švermov — novinky, týmy, e-shop a informace o klubu.',
  keywords: ['fotbal', 'Baník Švermov', 'TJ Baník', 'fotbalový klub', 'Kladno'],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'TJ Baník Švermov',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${inter.variable} ${anton.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-[#0a0a0a]">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
