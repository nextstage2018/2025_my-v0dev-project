import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { DatabaseContextProvider } from "@/contexts/database-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "広告管理ツール",
  description: "広告キャンペーン管理のためのツール",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <DatabaseContextProvider>{children}</DatabaseContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'