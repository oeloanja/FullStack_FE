"use client"

import Link from "next/link"
import Image from "next/image"
import { useUser } from "@/contexts/UserContext"

export function Header() {
  const { userType } = useUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/billit_logo.png"
            alt="BillIT Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex gap-8 items-center">
          {userType === 'none' && (
            <>
              <Link href="/detail/borrow" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출하기
              </Link>
              <Link href="/detail/invest" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                투자하기
              </Link>
              <Link href="/auth/select-type" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                시작하기
              </Link>
            </>
          )}
          
          {userType === 'borrower' && (
            <>
              <Link href="/borrow-apply/input" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출 신청
              </Link>
              <Link href="/borrow-current/history" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출 현황
              </Link>
              <Link href="/borrow-current" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출 이력
              </Link>
              <Link href="/my-page" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                마이페이지
              </Link>
            </>
          )}

          {userType === 'investor' && (
            <>
              <Link href="/invest-apply/input" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                투자 신청
              </Link>
              <Link href="/invest-current/portfolio" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                포트폴리오
              </Link>
              <Link href="/my-page" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                마이페이지
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}