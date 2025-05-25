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
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([{ particulars: '', qty: 0, rate: 0, amount: 0 }]);

  const [formDetails, setFormDetails] = useState(null);


  const fetchBill = async () => {
    try {
      const res = await axios.get(`/api/bill/${params.id}`);
      if (!res?.data.success) {
        return toast.error(res.data.error || "Failed to fetch billasdfas");
      }
      const data = res.data;
      setBill(data.bill);
      setItems(data.bill.items);
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

      const extension = bill?.fileType.startsWith("image/") ? bill?.fileType.split("/")[1] : "pdf";

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

    // Fetch form/bill format details
  useEffect(() => {
    const fetchFormatDetails = async () => {
      try {
        const res = await fetch('/api/billFormat');
        if (res.ok) {
          const data = await res.json();
          setFormDetails({
            firmName: data.institutionRelation?.firmName || '',
            address: data.institutionRelation?.shopAddress || '',
            contactNo: data.institutionRelation?.phone || '',
            gstNo: data.gstNumber || '',
            email: data.institutionRelation?.contactEmail || '',
            cgst: parseFloat((data.taxPercentage?.split('+')[0]) || 0),
            sgst: parseFloat((data.taxPercentage?.split('+')[1]) || 0),
            proprietorSign: data.proprietorSign || '',
            terms: data.extraText?.split('\n')[0] || '',
            updates: data.extraText?.split('\n')[1] || '',
          });
        }
      } catch (error) {
        console.error("Error fetching format details:", error);
      }
    };

    fetchFormatDetails();
  }, []);
  

  useEffect(() => {
    const fetchUserDetails = async () => {
            try {
                const { data } = await axios.get('/api/users/me');
                console.log(data);
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

  fetchUserDetails();
}, [])

const itemsSubtotal = items.reduce((acc, item) => acc + (item.total || 0), 0);

    const cgstPercent = formDetails?.cgst || 0;
    const sgstPercent = formDetails?.sgst || 0;

    const cgstAmount = (itemsSubtotal * cgstPercent) / 100;
    const sgstAmount = (itemsSubtotal * sgstPercent) / 100;

    const totalAmount = itemsSubtotal + cgstAmount + sgstAmount;

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!bill) return <div className="p-4 text-red-500">Bill not found.</div>;


  return (

    <div className="p-4 relative">
      <div className="max-w-5xl mx-auto p-4 bg-white shadow-md border text-sm text-black" >
        <div className="flex justify-between items-center my-4 md:my-8">
          <h1 className="text-2xl font-bold text-center w-full uppercase">Invoice</h1>
        </div>

        {/* Bill Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2  gap-4 border-b pb-2 mb-4">
          <div className="p-2 pb-4 border-b md:border-r md:border-gray-400 print:border-b-0 print:border-r ">
            <h1 className="text-lg font-bold text-[#0D6A9C] capitalize">{bill?.institution?.firmName}</h1>
            <p>{`${bill?.institution.houseNumber}, ${bill?.institution.address?.buildingName ? bill?.institution.buildingName + ', ' : ''}${bill?.institution.street}, ${bill?.institution.landmark}, ${bill?.institution.city}, ${bill?.institution.state} - ${bill?.institution.zipCode}, ${bill?.institution.country}`}</p>
            <p>Mobile: {bill?.institution?.mobileNumber}</p>
          </div>
          <div className="p-2">
            <h2 className="font-bold mb-1">RECEIVER DETAILS</h2>
            <div className="flex flex-col mb-1">
              <p className="flex items-start">
                Name:&nbsp;
                <span className="w-full text-sm text-gray-600 capitalize outline-none">
                  {bill?.user?.firstName || 'N/A'} {bill?.user?.lastName || ''}
                </span>
              </p>
              <p className="flex items-start">
                <span className="font-medium">Address:&nbsp;</span>
                {bill?.user ? (
                  <span className="w-full text-sm text-gray-600 outline-none">
                    {bill?.user?.houseNumber}, {bill?.user?.street}, {bill?.user?.buildingName}, {bill?.user?.city}, {bill?.user?.state}, {bill?.user?.zipCode}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}
              </p>
              <p>Phone: <span className="w-full text-sm text-gray-600 outline-none">{bill?.user?.mobileNumber || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4 items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600">Invoice Number <span className="font-bold outline-none">{bill?.invoiceNumber}</span></p>
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
                <tr className="text-xs md:text-sm print:text-sm bg-[#CFEBF9]">
                  <th className="border p-1 md:p-2 print:p-2">S.NO</th>
                  <th className="border p-1 md:p-2 print:p-2">
                      {user?.role === 'INSTITUTION' ? 'CHIEF COMPLAINT' : 'PARTICULARS'}
                  </th>
                  <th className="border p-1 md:p-2 print:p-2">
                      {user?.role === 'INSTITUTION' ? 'TREATMENT' : 'QUANTITY'}
                  </th>
                  <th className="border p-1 md:p-2 print:p-2">
                      {user?.role === 'INSTITUTION' ? 'OTHERS' : 'RATE'}
                  </th>
                  <th className="border p-1 md:p-2 print:p-2">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {bill?.items.map((item, index) => (
                  <tr key={index} className='text-xs md:text-sm print:text-sm'>
                    <td className="border p-1 md:p-2 text-center print:p-2">{index + 1}</td>
                    <td className="border p-1 md:p-2 print:p-2">
                      <input
                        type="text"
                        readOnly
                        tabIndex={-1}
  value={item?.name || ''}
                        onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                        className="w-full border-none outline-none"
                      />
                    </td>
                    <td className="border p-1 md:p-2 print:p-2">
                      {user?.role === 'INSTITUTION' ? (
                        <input
                          type="text"
                          readOnly
                          tabIndex={-1}
                          value={item?.treatment || ''}
                          onChange={(e) => handleItemChange(index, 'treatment', e.target.value)}
                          className="w-full border-none outline-none"
                                />

                            ) : ( 
                                    
                                <input
                                    readOnly
                                    tabIndex={-1}
                                    type="number"
                                    value={item?.quantity ?? ''} 
                                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                    className="w-full border-none outline-none bg-transparent pointer-events-none select-none"
                                    />
                            )}
                    </td>

                    <td className="border p-1 md:p-2 print:p-2">
                        {user?.role === 'INSTITUTION' ? (
                            <input
                                type="text"
                                value={item.others || item.rate || ''}
                                readOnly
                                tabIndex={-1}
                                onChange={(e) => handleItemChange(index, 'others', e.target.value)}
                                className="w-full border-none outline-none"
                            />
                        ) : (
                            <input
                                readOnly
                                type="number" tabIndex={-1}
                                value={item?.rate || ''}
                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                className="w-full border-none outline-none"
                            />
                        )}
                    </td>

                        <td className="border p-1 md:p-2 text-center print:p-2">
                            {user?.role === 'INSTITUTION' ? (
                                <input
                                    type="number"
                                    readOnly
                                    min="0"
                                    tabIndex={-1}
                                    value={item.amount || ''}
                                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                    className="w-full border-none outline-none text-center"
                                />
                            ) : (
                                item?.total?.toFixed(2)
                            )}
                        </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="text-xs md:text-sm print:text-sm border p-2 text-right font-bold">Items Subtotal</td>
                  <td className="text-xs md:text-sm print:text-sm border p-2 text-center font-bold">{bill?.totalAmount}</td>
                </tr>

                {formDetails && formDetails?.cgst && formDetails?.sgst && (
                  <>
                    <tr className='text-xs md:text-sm print:text-sm'>
                      <td className="border p-2 text-center" rowSpan={2}></td>
                      <td className="border p-2 font-semibold" rowSpan={2}>Tax</td>
                      <td className="border p-2">CGST</td>
                      <td className="border p-2 text-center">{formDetails.cgst}%</td>
                      <td className="border p-2 text-center">{cgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr className='text-xs md:text-sm print:text-sm'>
                      <td className="border p-2">SGST</td>
                      <td className="border p-2 text-center">{formDetails.sgst}%</td>
                      <td className="border p-2 text-center">{sgstAmount.toFixed(2)}</td>
                    </tr>
                  </>
                )}

              </tbody>
            </table>
          }
        </div>

        {/* Total Amount */}
        <div className="text-sm md:text-lg print:text-lg text-right font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</div>
          {/* proprietorSign */}
        
            {/* {formDetails?.proprietorSign && ( */}
            {formDetails?.proprietorSign && typeof formDetails.proprietorSign === 'string' && formDetails.proprietorSign.length > 0 && (

              <div className="flex justify-end mt-4">
                <div className="p-2 w-full max-w-[100px]">
                  <img
                    src={formDetails?.proprietorSign || ''}
                    alt="Proprietor Signature"
                    width={100}
                    height={100}
                    className="object-contain"
                    // priority
                  />
                </div>
              </div>
            )}

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
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-indigo-500 cursor-pointer transition-all ease-in-out duration-400 hover:bg-indigo-600 print:hidden text-white text-sm rounded"
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

        <div className='w-full flex flex-col items-center text-xs md:text-sm print:text-sm justify-center gap-2 mt-5'>
          {formDetails?.terms && (
            <div className="w-full p-2 md:p-4 print:p-4">
              <strong className="block font-semibold">Terms & Conditions: </strong>
              <p>{formDetails?.terms}</p>
            </div>
          )}

          {formDetails?.updates && (
            <div className="w-full p-2 md:p-4 print:p-4">
              <strong className="block font-semibold">Updates / Offer Information:</strong>
              <p>{formDetails?.updates}</p>
            </div>
          )}
        </div>

        <div className="text-right mt-10 text-xs text-gray-500 uppercase">
          This bill is generated using <span className="font-semibold text-black">NearBuyDukan</span>
        </div>
      </div>

    </div>
  );
}
