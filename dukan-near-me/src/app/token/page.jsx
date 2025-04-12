import React from 'react'
import Navbar from '../components/userProfile/navbar/Navbar'
import TokenUpdate from '../components/token/TokenUpdate'
import TokenGeneration from '../components/token/TokenGeneration'

export default function page() {
  return (
        <div>
            <Navbar />
            {/* <TokenUpdate /> */}
            <TokenGeneration/>
        </div>
    )
}

