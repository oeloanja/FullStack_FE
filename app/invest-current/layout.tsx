import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BilliT - 투자 현황",
  description: "BilliT 투자 현황",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}