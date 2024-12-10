import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BilliT - 인증",
  description: "BilliT 회원가입 및 로그인",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full max-w-none px-4 py-1 sm:px-6 lg:px-8 pt-12">
        {children}
      </main>
    </div>
  )
}