import React, { Suspense } from 'react'
import PaymentOffer from '../components/payment/PaymentOffer'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <PaymentOffer/>
    </Suspense>
  )
}
