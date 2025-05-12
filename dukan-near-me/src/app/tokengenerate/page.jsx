'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/InstitutionHome/navbar/Navbar';
import TokenGeneration from '../components/token/TokenGeneration';
import { Grid } from 'react-loader-spinner'; // Importing the loader component

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {
      setLoading(false); 
    }, 2000); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Grid
          height="80"
          width="80"
          color="#3b82f6"
          ariaLabel="grid-loading"
          radius="12.5"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <TokenGeneration />
      {/* <ChatBox /> */}
    </div>
  );
}
