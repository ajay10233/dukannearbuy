
import React, { Suspense } from 'react'
import ChatBox from '../components/chat/ChatBox'

export default function page() {
  return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatBox />
        </Suspense>
    )
}
