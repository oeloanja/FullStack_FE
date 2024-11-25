import InvestmentSuccessContent from './InvestmentSuccessContent'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center p-4">
        <InvestmentSuccessContent />
      </main>
      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        <p>© 2024 BillIT. All rights reserved.</p>
      </footer>
    </div>
  )
}

