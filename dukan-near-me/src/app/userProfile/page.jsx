import React from 'react'
import Footer from '../components/footer/Footer'
import HeroSection from '../components/userProfile/HeroSection'

export default function page() {
  return (
      <>
        {/* header  */}
        <main className='flex justify-center items-center min-h-screen w-full bg-[var-(--background)]'>
            <section className='flex gap-6 items-center px-4 py-6'>
                {/* search bar  */}
                {/* hero-section  */}
                <HeroSection />  
            </section>
        </main>  
        <Footer />
    </>
  )
}
