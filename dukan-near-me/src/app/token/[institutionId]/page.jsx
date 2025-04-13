import React from 'react'
import Navbar from '@/app/components/userProfile/navbar/Navbar'
import TokenUpdate from '@/app/components/token/TokenUpdate'
// import TokenGeneration from '../components/token/TokenGeneration'

export default function page() {
  return (
        <div>
            <Navbar/>
            <TokenUpdate />
            {/* <TokenGeneration/> */}
        </div>
    )
}

