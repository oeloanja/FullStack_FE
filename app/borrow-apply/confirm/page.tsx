'use client'

import dynamic from 'next/dynamic'

const BorrowConfirmComponent = dynamic(() => import('./BorrowConfirmComponent'), { 
  ssr: false 
})

export default BorrowConfirmComponent