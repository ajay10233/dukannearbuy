"use client";
// add a downoload button as well

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

  // Add this function inside your component
  const handleDownload = async () => {
    if (!bill?.fileUrl) {
      toast.error("No file to download");
      return;
    }

    try {
      const response = await fetch(bill.fileUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const contentType = response.headers.get("Content-Type");

      // Map of MIME types to file extensions
      const mimeMap = {
        "application/pdf": "pdf",
        "image/jpeg": "jpg",
        "image/png": "png",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "text/plain": "txt",
        "application/zip": "zip",
      };

      const extension = mimeMap[contentType] || "file";

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Invoice-${bill?.invoiceNumber || "bill"}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download the file");
    }
  };




  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!bill) return <div className="p-4 text-red-500">Bill not found.</div>;


  return (

    <div className="p-4 relative">
      <div className="max-w-5xl mx-auto p-4 bg-white shadow-md border text-sm text-black" >
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl font-bold text-center w-full uppercase">Invoice</h1>
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
                        readOnly
                        tabIndex={-1}
                        value={item?.name}
                        onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                        className="w-full border-none outline-none bg-transparent pointer-events-none select-none"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        readOnly
                        tabIndex={-1}
                        type="number"
                        value={item?.quantity}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        className="w-full border-none outline-none bg-transparent pointer-events-none select-none"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={item?.price}
                        readOnly
                        tabIndex={-1}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="w-full border-none outline-none bg-transparent pointer-events-none select-none"
                      />
                    </td>
                    <td className="border p-2 text-center">{item?.total?.toFixed(2)}</td>
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

        {/* File Preview */}
        {bill?.fileUrl && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">File Attachment</h2>
            {bill?.fileType?.startsWith("image/") ? (
              <img
                src={bill.fileUrl}
                alt="Attached Image"
                className="w-full max-w-md mx-auto border rounded shadow"
              />
            ) : bill?.fileType === "application/pdf" ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(bill.fileUrl)}&embedded=true`}
                title="PDF Preview"
                className="w-full h-96 border rounded"
              />
            ) : (
              <p className="text-sm text-gray-500">Unsupported file format.</p>
            )}
          </div>
        )}


        {/* Action Buttons */}
        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-[#3f51b5] text-white text-sm rounded"
          >
            Print
          </button>

          {bill?.fileUrl && (
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded cursor-pointer"
            >
              Download File
            </button>
          )}
        </div>

        <div className="text-right mt-10 text-xs text-gray-500 uppercase">
          This bill is generated using <span className="font-semibold text-black">NearBuyDukan</span>
        </div>
      </div>

    </div>
  );
}
