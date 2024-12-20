import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BilliT - 마이페이지",
  description: "BilliT 마이페이지",
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