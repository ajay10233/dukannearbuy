"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '../components/InstitutionHome/navbar/Navbar'
import HeroSection from '../components/userProfile/heroSection/HeroSection'
import Subscription from '../components/userProfile/offer/Subscription'
import PromotionCard from '../components/userProfile/PromotionCard'
import SearchBar from '../components/userProfile/searchBar/SearchBar'
import Footer from '../components/userProfile/footer/Footer'
import Faq from '../components/InstitutionHome/Faq/Faq'
import Cards from '../components/InstitutionHome/cards/Cards'
import LogoLoader from '../components/LogoLoader'

export default function page() {
    // const [isLoading, setIsLoading] = useState(true);
    
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //       setIsLoading(false);
    //     }, 1000);
    
    //     return () => clearTimeout(timer);
    //   }, []);
    
    //   if (isLoading) {
    //     return (
    //         <LogoLoader content={"Loading home..."} />
    //     );
    //   }
    
    return (
        <>
            <Navbar />
            <main className='flex flex-col min-h-screen w-full md:pt-14 pt-13'>
                <section className='flex flex-col gap-y-4 w-full bg-black p-4'>
                    <SearchBar />              
                    <HeroSection />  
                </section>
                <section className='bg-gradient-to-t from-[#A7BEC2] via-[#005d6e] to-[#0f0f0f]'>
                    <Cards/>
                    <PromotionCard/>
                    <Subscription />
                    <Faq/>
                </section>
            </main>  
            <Footer />
        </>
    )
}
