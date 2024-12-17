'use client'

import { Suspense } from 'react'
import BorrowConfirmComponent from './BorrowConfirmComponent'

export default function BorrowConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BorrowConfirmComponent />
    </Suspense>
  )
}