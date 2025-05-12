
import React from 'react'
import ChatBox from '../components/chat/ChatBox'
import TokenGeneration from '../components/token/TokenGeneration'
import Navbar from '../components/InstitutionHome/navbar/Navbar'

export default function page() {
  return (
    <>
        <Navbar/>
        <TokenGeneration/>
      </>
    )
}
