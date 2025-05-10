'use client';

import React, { useState, useRef } from 'react';
import { ScanLine, X } from 'lucide-react';
import toast from 'react-hot-toast';
import UserQrScan from '../../components/userqr-scan/UserQrScan';

export default function BillGeneratorWithSave() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-GB').split('/').join('-');
  });

  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState({ firstName: '', lastName: '' });
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const billRef = useRef();

  const [items, setItems] = useState([{ particulars: '', qty: 1, rate: 0, amount: 0 }]);

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = key === 'qty' || key === 'rate' ? parseFloat(value) || 0 : value;
    newItems[index].amount = newItems[index].qty * newItems[index].rate;
    setItems(newItems);
  };

  const itemsSubtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const totalAmount = itemsSubtotal;

  const handleScanSuccess = (userData) => {
    setUserId(userData.userId);
    setUsername(userData.username);
    setAddress(userData.address);
    setMobile(userData.mobile);
    toast.success('User details fetched successfully!');
    setIsScanning(false);
  };

  const handlePrint = () => {
    const printContents = billRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="p-4 relative">
      <div
        className="max-w-5xl mx-auto p-4 bg-white shadow-md border text-sm text-black"
        ref={billRef}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl font-bold text-center w-full">BILL GENERATION</h1>
          <button
            onClick={() => setIsScanning(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
          >
            <ScanLine size={20} strokeWidth={1.5} /> Scan
          </button>
        </div>

        {/* Bill Information */}
        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4">
          <div className="p-2 border-r border-black">
            <h1 className="text-lg font-bold text-[#0D6A9C]">SHRI GANESH TRADING CO.</h1>
            <p>SHOP: 6.7 KARAWAL NAGAR OPPOSITE NEW SHANDYA PUBLIC SCHOOL</p>
            <p>Delhi</p>
            <p>Mobile: 8851723708</p>
          </div>
          <div className="p-2">
            <h2 className="font-bold mb-1">RECEIVER DETAILS</h2>
            <div className="flex flex-col mb-1">
              <p className="flex items-start">
                Name:&nbsp;
                <span className="text-sm text-gray-700">
                  {username.firstName || 'N/A'} {username.lastName || ''}
                </span>
              </p>
              <p className="flex items-start">
                <span className="font-medium">Address:&nbsp;</span>
                {address ? (
                  <span className="text-sm text-gray-700">
                    {address.houseNumber}, {address.street}, {address.buildingName}, {address.city}, {address.state}, {address.zipCode}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}
              </p>
              <p>Phone: <span className="text-sm text-gray-700">{mobile || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4 items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600">Invoice Number</p>
            <input
              type="text"
              className="font-bold w-full outline-none"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="font-bold">{invoiceDate}</p>
          </div>
        </div>

        {/* Bill Items Table */}
        <div className="overflow-x-auto mb-4">
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
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.particulars}
                      onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                      className="w-full border-none outline-none"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="w-full border-none outline-none"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full border-none outline-none"
                    />
                  </td>
                  <td className="border p-2 text-center">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="border p-2 text-right font-bold">Items Subtotal</td>
                <td className="border p-2 text-center font-bold">{itemsSubtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Other Charges */}
        {/* <div className="mb-4">
          <h3 className="font-bold mb-2">Other Charges</h3>
          <button className="px-3 py-1 bg-[#9fc9de] cursor-pointer text-white text-sm rounded">
            Add Other Charge
          </button>
        </div> */}

        {/* Total Amount */}
        <div className="text-right font-bold text-lg">Total Amount: ₹{totalAmount.toFixed(2)}</div>

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

      {/* Modal for QR Scanner */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white relative p-4 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="absolute cursor-pointer top-2 right-2 text-gray-600 transition-all duration-500 ease-in-out hover:text-black"
              onClick={() => setIsScanning(false)}
            >
              <X size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-3 md:mb-6">QR Code Scanner</h1>
          <div className="text-center text-gray-500 mb-2 md:mb-4">
            <p>Scan a QR code using your camera</p>
          </div>

            <UserQrScan
              setUserId={setUserId}
              setUsername={setUsername}
              setAddress={setAddress}
              setMobile={setMobile}
              onScanSuccess={handleScanSuccess} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
