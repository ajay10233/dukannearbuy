import React, { Suspense } from 'react'
import Payment from '../components/promotion-payment/Payment'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Payment/>
    </Suspense>
  )
}
