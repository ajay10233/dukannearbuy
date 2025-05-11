"use client";

import { useState,useEffect,useRef } from "react";
import { toast } from "react-hot-toast";
import { ScanLine, Upload, X } from 'lucide-react';
import UserQrScan from '../../components/userqr-scan/UserQrScan';
import axios from 'axios';
import Navbar from "@/app/components/InstitutionHome/navbar/Navbar";
import EditFormat from "@/app/components/bill-format/EditFormat";

export default function EditFormatComponent() {
    const [shortBill, setShortBill] = useState(false);
    const [tokenGeneration, setTokenGeneration] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [userId, setUserId] = useState('');
    // const [username, setUsername] = useState('');
    const [file, setFile] = useState(null);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(() => {
        const now = new Date();
        return now.toLocaleDateString('en-GB').split('/').join('-');
    });

    //   const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState({ firstName: '', lastName: '' });
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const handleUpload = () => {
        if (userId.trim() === '' || !file) {
            toast.error('Please fill User ID and upload a file.');
            return;
        }

        // TODO: handle actual upload logic here
        
        toast.success('File uploaded successfully!');
        setIsModalOpen(false);
        setUserId('');
        setFile(null);
    };

    const handleShortBillToggle = () => {
        const newValue = !shortBill;
        setShortBill(newValue);
        toast.success(`Short Bill ${newValue ? "Enabled" : "Disabled"}`);
    };

    const handleTokenGenerationToggle = () => {
        const newValue = !tokenGeneration;
        setTokenGeneration(newValue);
        toast.success(`Token Generation ${newValue ? "Enabled" : "Disabled"}`);
    };

    const fetchUserDetails = async () => {
        try {
            const { data } = await axios.get('/api/users/me');
            console.log(data);
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };

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

    const handleGenerateBill = async () => {
        if (!userId) {
            toast.error('Please scan a user QR code first.');
            return;
        }

        if (!invoiceNo.trim()) {
            toast.error('Please enter an invoice number.');
            return;
        }

        try {
            const payload = {
                userId,
                name: `${username.firstName} ${username.lastName}`,
                phoneNumber: mobile,
                invoiceNumber: invoiceNo,
                items: items.map((item) => ({
                    name: item.particulars,
                    quantity: Number(item.qty),
                    price: Number(item.rate),
                })),
                remarks: '', // Optional field, add UI input if needed
                otherCharges: 0, // Update this if you enable otherCharges section
                generateShortBill: false, // Adjust based on usage
            };

            const { data } = await axios.post('/api/bill', payload);
            toast.success('Bill generated successfully!');
            console.log('Generated bill:', data);
        } catch (error) {
            console.error('Error generating bill:', error);
            toast.error(error.response?.data?.error || 'Error generating bill');
        }
    };


    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col relative">
            <Navbar />
            <main className="flex flex-col flex-1 gap-y-4">

                <div className="flex flex-col flex-1 bg-white p-3 md:p-6 gap-4 shadow-md w-full md:w-full md:max-w-5xl border border-black self-center mt-16">
                    <EditFormat />
                    {/* toggles */}
                    <div className="flex flex-wrap gap-2 md:gap-4 p-2 md:p-4 justify-evenly">
                        {/* Short Bill Toggle */}
                        <div className="flex items-center justify-evenly gap-2 w-full sm:w-auto">
                            <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">Short Bill Generation</span>
                            <label className="relative cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={shortBill}
                                    onChange={handleShortBillToggle}
                                />
                                <div className="relative h-6.5 md:h-9 w-14 md:w-22 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-0.5 after:h-5 after:w-5 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:after:translate-x-7 md:peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
                                    <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
                                    <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
                                </div>
                            </label>
                        </div>

                        {/* Token Generation Toggle */}
                        <div className="flex items-center justify-evenly gap-2 w-full sm:w-auto">
                            <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">Token Generation</span>
                            <label className="relative cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={tokenGeneration}
                                    onChange={handleTokenGenerationToggle}
                                />
                                <div className="relative h-6.5 md:h-9 w-14 md:w-22 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-0.5 after:h-5 after:w-5 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:after:translate-x-7 md:peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
                                    <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
                                    <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
                                </div>
                            </label>
                        </div>
                    </div>
                    {/* <Toggles /> */}
                    {/* upload image */}
                    <div className="flex flex-col gap-6">
                        {/* Upload Box */}
                        <div className="flex justify-between items-center border border-gray-400 p-2 md:p-4 rounded-md">
                            <span className="text-gray-700 font-semibold text-md">Upload Image or PDF</span>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-2 md:px-4 py-2 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-800 transition-all duration-500 ease-in-out"
                            >
                                <Upload size={20} strokeWidth={1.5} /> Upload
                            </button>
                        </div>

                        {/* Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                <div className="bg-white p-6 rounded-md w-96 flex flex-col gap-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Details</h2>

                                    {/* User ID Input + QR Button */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter User ID"
                                            value={username || userId}
                                            onChange={(e) => {
                                                setUserId(e.target.value);
                                                setUsername('');
                                            }}
                                            className="flex-1 border p-2 rounded-md"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowQRScanner(true)}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
                                        >
                                            <ScanLine size={20} strokeWidth={1.5} /> Scan
                                        </button>
                                    </div>

                                    {/* Username Display */}
                                    {username && (
                                        <p className="text-green-700 font-medium -mt-2">Username: {username}</p>
                                    )}

                                    {/* File Upload */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="fileUpload" className="text-gray-700 font-medium">
                                            Upload Image or PDF
                                        </label>
                                        <input
                                            id="fileUpload"
                                            type="file"
                                            accept="application/pdf,image/*"
                                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                            className="border p-2 rounded-md"
                                        />
                                    </div>

                                    {/* Modal Buttons */}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleUpload}
                                            className="px-4 py-2 rounded-md bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 transition-all duration-500 ease-in-out"
                                        >
                                            Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 rounded-md border border-gray-400 cursor-pointer text-gray-700 hover:bg-gray-100 transition-all duration-500 ease-in-out"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                {/* QR Scanner Modal */}
                                {showQRScanner && (
                                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                                        <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-md relative">
                                            <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-3 md:mb-6">QR Code Scanner</h1>
                                            <div className="text-center text-gray-500 mb-2 md:mb-4">
                                                <p>Scan a QR code using your camera</p>
                                            </div>
                                            <button
                                                onClick={() => setShowQRScanner(false)}
                                                className="absolute top-2 right-2 text-red-500 font-bold cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                            <QrScan
                                                setUserId={(id) => {
                                                    setUserId(id);
                                                    setShowQRScanner(false);
                                                    toast.success('User ID scanned');
                                                }}
                                                setUsername={(name) => setUsername(name)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* <UploadPdfImage /> */}

                </div>
                {/* Create bill */}

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
                                <h1 className="text-lg font-bold text-[#0D6A9C]">{user?.firmName}</h1>
                                <p>{user?.address && `${user.address.houseNumber}, ${user.address?.buildingName ? user.address.buildingName + ', ' : ''}${user.address.street}, ${user.address.landmark}, ${user.address.city}, ${user.address.state} - ${user.address.zipCode}, ${user.address.country}`}</p>
                                <p>Mobile: {user?.mobileNumber}</p>
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
                            <button onClick={handleGenerateBill} className="bg-blue-500 text-white px-4 py-2 rounded text-sm">Generate Bill</button>
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

                {/* <CreateBill /> */}


            </main>
            {/* <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
        <Image
            src="/nearbuydukan - watermark.png"
            alt="Watermark"
            fill sizes="120"
            className="object-contain w-17 h-17 md:w-32 md:h-32"
            priority/>
      </div>       */}
        </div>

    );
}
