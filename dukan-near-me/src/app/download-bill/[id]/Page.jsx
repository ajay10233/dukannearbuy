import DownloadBill from "@/app/components/download-bill/DownloadBill";
import { Suspense } from "react";
import React from 'react'
export default async function Page({params}){
    const param = await params;
    return(
        <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
            <DownloadBill params={param}/>
        </Suspense>
    )
}