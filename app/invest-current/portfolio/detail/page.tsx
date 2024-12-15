'use client'

import dynamic from 'next/dynamic'

const InvestmentDetailComponent = dynamic(() => import('./InvestmentDetailComponent'), { 
  ssr: false 
})

export default Investme