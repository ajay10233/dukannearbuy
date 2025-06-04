'use client'

import React from 'react'
import AboutUs from '../components/AboutUs'
import Navbar from '../components/InstitutionHome/navbar/Navbar'
import { useSession } from 'next-auth/react';

export default function page() {
    const { data: session, status } = useSession();

    if (status === 'loading') return null;

    const role = session?.user?.role;
    const allowedRoles = ['INSTITUTION', 'SHOP_OWNER', 'USER'];
    const showNavbar = allowedRoles.includes(role);

  return (
        <>
            {showNavbar && <Navbar />}
            <AboutUs />
        </>
    )
}
