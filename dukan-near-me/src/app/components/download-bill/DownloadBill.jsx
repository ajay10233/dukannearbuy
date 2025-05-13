"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DownloadBill({ params }) {
  const { data: session } = useSession();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBill = async () => {
    try {
      const res = await axios.get(`/api/bill/${params.id}`);
      if (!res?.data.success) {
        return toast.error(res.data.error || "Failed to fetch billasdfas");
      }
      const data = res.data;
      setBill(data.bill);
      console.log(data.bill);
    } catch (error) {
      toast.error("Failed to fetch bill");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!params.id) return;
    fetchBill();
  }, [session])

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!bill) return <div className="p-4 text-red-500">Bill not found.</div>;


  return (
    // <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md print:shadow-none print:bg-white">
    //   <div className="flex justify-between items-center mb-6">
    //     <h1 className="text-2xl font-bold">Bill #{bill.id}</h1>
    //     <button
    //       onClick={handlePrint}
    //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 print:hidden"
    //     >
    //       Print
    //     </button>
    //   </div>

    //   <div className="mb-4">
    //     <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleDateString()}</p>
    //     {bill.user && (
    //       <>
    //         <p><strong>Customer:</strong> {bill.user.name}</p>
    //         <p><strong>Email:</strong> {bill.user.email}</p>
    //       </>
    //     )}
    //   </div>

    //   <h2 className="text-xl font-semibold mb-2 mt-6">Bill Items</h2>
    //   <table className="w-full border border-gray-300 text-sm">
    //     <thead className="bg-gray-100">
    //       <tr>
    //         <th className="border p-2 text-left">#</th>
    //         <th className="border p-2 text-left">Item</th>
    //         <th className="border p-2 text-left">Qty</th>
    //         <th className="border p-2 text-left">Price</th>
    //         <th className="border p-2 text-left">Total</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {bill.items?.map((item, idx) => (
    //         <tr key={idx}>
    //           <td className="border p-2">{idx + 1}</td>
    //           <td className="border p-2">{item?.name}</td>
    //           <td className="border p-2">{item?.quantity}</td>
    //           <td className="border p-2">₹{item?.price}</td>
    //           <td className="border p-2">₹{item?.price * item?.quantity}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>

    //   {bill.charges?.length > 0 && (
    //     <>
    //       <h2 className="text-xl font-semibold mb-2 mt-6">Additional Charges</h2>
    //       <table className="w-full border border-gray-300 text-sm">
    //         <thead className="bg-gray-100">
    //           <tr>
    //             <th className="border p-2 text-left">Label</th>
    //             <th className="border p-2 text-left">Amount</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {bill.charges.map((charge, idx) => (
    //             <tr key={idx}>
    //               <td className="border p-2">{charge.label}</td>
    //               <td className="border p-2">₹{charge.amount}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </>
    //   )}

    //   <div className="text-right mt-6 text-lg font-semibold">
    //     Total: ₹{bill.totalAmount}
    //   </div>
    // </div>

    <div className="p-4 relative">
      <div className="max-w-5xl mx-auto p-4 bg-white shadow-md border text-sm text-black" >
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl font-bold text-center w-full">BILL</h1>
        </div>

        {/* Bill Information */}
         <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4">
          <div className="p-2 border-r border-black">
            <h1 className="text-lg font-bold text-[#0D6A9C]">{bill?.institution?.firmName}</h1>
            <p>{`${bill?.institution.houseNumber}, ${bill?.institution.address?.buildingName ? bill?.institution.buildingName + ', ' : ''}${bill?.institution.street}, ${bill?.institution.landmark}, ${bill?.institution.city}, ${bill?.institution.state} - ${bill?.institution.zipCode}, ${bill?.institution.country}`}</p>
            <p>Mobile: {bill?.institution?.mobileNumber}</p>
          </div>
          <div className="p-2">
            <h2 className="font-bold mb-1">RECEIVER DETAILS</h2>
            <div className="flex flex-col mb-1">
              <p className="flex items-start">
                Name:&nbsp;
                <span className="text-sm text-gray-700">
                  {bill?.user?.firstName || 'N/A'} {bill?.user?.lastName || ''}
                </span>
              </p>
              <p className="flex items-start">
                <span className="font-medium">Address:&nbsp;</span>
                {bill?.user ? (
                  <span className="text-sm text-gray-700">
                    {bill?.user?.houseNumber}, {bill?.user?.street}, {bill?.user?.buildingName}, {bill?.user?.city}, {bill?.user?.state}, {bill?.user?.zipCode}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}
              </p>
              <p>Phone: <span className="text-sm text-gray-700">{bill?.user?.mobileNumber || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4 items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600">Invoice Number {bill?.invoiceNumber}</p>   
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="font-bold">{bill?.createdAt ? bill?.createdAt?.split("T")[0] : "N/A"}</p>
          </div>
        </div>

        {/* Bill Items Table */}
        <div className="overflow-x-auto mb-4">
          {bill?.items && 

          <table className="w-full border-collapse border text-left">
            <thead>
              <tr className="bg-[#CFEBF9]">
                <th className="border p-2">S.NO</th>
                <th className="border p-2">PARTICULARS</th>
                <th className="border p-2">QUANTITY</th>
                <th className="border p-2">RATE</th>
                <th className="border p-2">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {bill?.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      disabled
                      value={item?.particulars}
                      onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                      className="w-full border-none outline-none"
                      />
                  </td>
                  <td className="border p-2">
                    <input
                      disabled
                      type="number"
                      value={item?.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="w-full border-none outline-none"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item?.rate}
                      disabled
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full border-none outline-none"
                    />
                  </td>
                  <td className="border p-2 text-center">{item?.amount?.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="border p-2 text-right font-bold">Items Subtotal</td>
                <td className="border p-2 text-center font-bold">{bill?.totalAmount}</td>
              </tr>
            </tbody>
          </table>
          }
        </div>

        {/* <div className="text-right font-bold text-lg">Total Amount: ₹{totalAmount.toFixed(2)}</div> */}

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-[#3f51b5] text-white text-sm rounded"
          >
            Print
          </button>
        </div>
        <div className="text-right mt-10 text-xs text-gray-500 uppercase">
          This bill is generated using <span className="font-semibold text-black">NearBuyDukan</span>
        </div>
      </div>

    </div>
  );
}
