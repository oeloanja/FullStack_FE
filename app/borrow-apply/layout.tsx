import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BilliT - 대출 신청",
  description: "BilliT 대출 신청",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full max-w-none px-4 py-12 sm:px-6 lg:px-8 pt-16">
        {children}
      </main>
    </div>
  )
}