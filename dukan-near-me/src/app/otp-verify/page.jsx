import React, { Suspense } from 'react'
import OTPVerification from '../components/userProfile/profile/OTPVerification'

export default function page() {
  return (
    <Suspense>
      <OTPVerification/>
    </Suspense>
  )
}
