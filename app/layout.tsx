import type { Metadata } from "next"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { UserProvider } from '../contexts/UserContext'
import "./globals.css"

export const metadata: Metadata = {
  title: "BillIT - 외국인을 위한 금융",
  description: "대한민국 모든 비즈니스를 더욱 성장시키는 금융 서비스",
  icons: {
		icon: "/icon.png",
	},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
    </UserProvider>
  )
}