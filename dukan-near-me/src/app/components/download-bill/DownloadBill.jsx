"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DownloadBill({params}) {
    const {data:session} = useSession();
    const [bill,setBill] = useState(null);
    const fetchBill = async () =>{
        try {
            const res = await axios.get(`/api/bill/${params.id}`);
            if (!res?.data.success) {
                return toast.error(res.data.error || "Failed to fetch billasdfas");
            }
            const data = res.data;
            setBill(data.bill);
        } catch (error) {
            toast.error("Failed to fetch bill");
        }
    }
    useEffect(()=>{
        fetchBill();
    },[session])
  return (
    <div>
      {/* {params} */}
      heeeee
      {/* {JSON.stringify(bill)} */}
      {bill!=null && bill.createdAt}
    </div>
  )
}
