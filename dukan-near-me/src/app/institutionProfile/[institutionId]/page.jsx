import Navbar from '@/app/components/InstitutionHome/navbar/Navbar'
import About from '@/app/components/InstitutionHome/Profile/About'
import HeroSection from '@/app/components/InstitutionHome/Profile/HeroSection'
import React from 'react'

export default function page() {
    return (
        <>
            <Navbar />
            <HeroSection /> 
            <About />
        </>
    )
}
