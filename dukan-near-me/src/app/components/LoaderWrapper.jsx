'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from './Loader';

export default function LoaderWrapper({ children }) {
  const pathname = usePathname(); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout); 
  }, [pathname]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="transition-all duration-300">{children}</div>
      )}
    </>
  );
}
