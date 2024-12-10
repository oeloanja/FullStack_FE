"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'

export function Header() {
  const { userType, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/') // Redirect to home page after logout
  }

  console.log('Header render - userType:', userType, 'isAuthenticated:', isAuthenticated)

  return (
    <header className="border-b">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/billit_logo.png"
            alt="BillIT Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex gap-5 items-center">
          {!isAuthenticated && (
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
              <Link href="/auth/login" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                로그인
              </Link>
            </>
          )}
          
          {isAuthenticated && userType === 'borrow' && (
            <>
              <Link href="/borrow-apply/input" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출 신청
              </Link>
              <Link href="/borrow-current" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출 현황
              </Link>
              <Link href="/borrow-current/history" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                대출 이력
              </Link>
              <Link href="/borrow-my-page" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                마이페이지
              </Link>
            </>
          )}

          {isAuthenticated && userType === 'invest' && (
            <>
              <Link href="/invest-apply/input" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                투자 신청
              </Link>
              <Link href="/invest-current/portfolio" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                포트폴리오
              </Link>
              <Link href="/invest-my-page" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
                마이페이지
              </Link>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-[#4FFFD7] transition-colors"
            >
              로그아웃
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}