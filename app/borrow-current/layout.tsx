import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BillIT - 대출 상세",
  description: "BillIT 대출 상세",
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