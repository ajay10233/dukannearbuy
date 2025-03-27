
import React from 'react'
import ChatBox from '../components/chat/ChatBox'
import SidebarChat from '../components/chat/SidebarChat'
import Footer from '../components/footer/Footer'

export default function page() {
  return (
    <>
      <div className='flex flex-row h-screen bg-white font-[var(--font-plus-jakarta)]'>
        <SidebarChat/>
        <ChatBox />
    </div>
    <Footer/>
    </>

  )
}
