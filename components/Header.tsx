import Link from "next/link"
import Image from "next/image"

export function Header() {
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
          <Link href="/detail/borrow" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">대출하기</Link>
          <Link href="/detail/invest" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">투자하기</Link>
          <Link href="/auth/select-type" className="text-gray-600 hover:text-[#4FFFD7] transition-colors">
            시작하기
          </Link>
        </nav>
      </div>
    </header>
  )
}