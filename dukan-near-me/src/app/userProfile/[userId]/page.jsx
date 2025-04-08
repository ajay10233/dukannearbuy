"use client"

import { useParams } from "next/navigation"

export default function page() {
    const { userId } = useParams();
    alert(userId);
  return (
    <div>
      {userId}
    </div>
  )
}
