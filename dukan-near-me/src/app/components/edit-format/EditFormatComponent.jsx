"use client";
import Image from 'next/image';
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { ScanLine, Upload, X } from 'lucide-react';
import UserQrScan from '../../components/userqr-scan/UserQrScan';
import axios from 'axios';
import Navbar from "@/app/components/InstitutionHome/navbar/Navbar";
// import EditFormat from "@/app/components/bill-format/EditFormat";
import EditFormatModal from "../../components/bill-format/EditFormatModal";
import { FaEdit } from "react-icons/fa";
import LogoLoader from '../LogoLoader';


export default function EditFormatComponent() {
    const [shortBill, setShortBill] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [userId, setUserId] = useState('');
    // const [username, setUsername] = useState('');
    const [file, setFile] = useState(null);
    const [invoiceNo, setInvoiceNo] = useState('');
    //   const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState({ firstName: '', lastName: '' });
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    // const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [items, setItems] = useState([{ particulars: '', qty: 0, rate: 0, amount: 0 }]);
    const [shortBillDetails, setShortBillDetails] = useState(null);
    const billRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formDetails, setFormDetails] = useState(null);
    const [tokenEnabled, setTokenEnabled] = useState(false); // for toggle switch
    const [token, setToken] = useState(''); // for token input value
const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);


    const handleFormDetailsChange = (updatedForm) => {
        setFormDetails(updatedForm); // Set the updated form data 
        console.log(updatedForm);
    };

    const [invoiceDate, setInvoiceDate] = useState(() => {
        const now = new Date();
        return now.toLocaleDateString('en-GB').split('/').join('-');
    });


    const handleShortBillToggle = () => {
        const newValue = !shortBill;
        setShortBill(newValue);
        toast.success(`Short Bill ${newValue ? "Enabled" : "Disabled"}`);
    };

    const handleIsReportToggle = () => {
        const newValue = !isReport;
        setIsReport(newValue);
        toast.success(`Is Report ${newValue ? "Enabled" : "Disabled"}`);
    };

    const handleTokenToggle = () => {
        const newValue = !tokenEnabled;
        console.log('Token toggle:', newValue);

        setTokenEnabled(newValue);
        toast.success(`Token ${newValue ? "Enabled" : "Disabled"}`);
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

    const handleItemChange = (index, key, value) => {
        const newItems = [...items];

        if (key === 'qty' || key === 'rate') {
            newItems[index][key] = parseFloat(value) || 0;
            // For shop_owner, update amount automatically
            if (user?.role !== 'INSTITUTION') {
                newItems[index].amount = newItems[index].qty * newItems[index].rate;
            }
        } else if (key === 'amount') {
            // For institution, allow manual amount input
            newItems[index][key] = parseFloat(value) || 0;
        } else {
            newItems[index][key] = value;
        }

        setItems(newItems);
    };


    const itemsSubtotal = items.reduce((acc, item) => acc + item.amount, 0);
    // const totalAmount = itemsSubtotal;

    const addItemRow = () => {
        setItems([...items, { particulars: '', qty: 0, rate: 0, amount: 0 }]);
    };

    const handleScanSuccess = (userData) => {
        setUserId(userData.userId);
        setUsername(userData.username);
        const formattedAddress = `${userData.address.houseNumber}, ${userData.address.buildingName}, ${userData.address.street}, ${userData.address.city}, ${userData.address.state} - ${userData.address.zipCode}`;

        setAddress(formattedAddress);

        setMobile(userData.mobile);
        toast.success('User details fetched successfully!');
        setIsScanning(false);
    };

    const handlePrint = () => {
        // const printContents = billRef.current.innerHTML;
        // const originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        // window.print();
        // document.body.innerHTML = originalContents;
        // window.location.reload();

        window.print();
    };

 
    const handleGenerateBill = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    if (!userId) {
        toast.error('Please scan a user QR code first.');
        setIsGenerating(false);
        return;
    }

    if (!invoiceNo.trim()) {
        toast.error('Please enter an invoice number.');
        setIsGenerating(false);
        return;
    }

    // Validate items before proceeding
    if (!Array.isArray(items) || items.length === 0) {
        toast.error('Please add at least one item to generate a bill.');
        setIsGenerating(false);
        return;
    }

    const safeItems = Array.isArray(items) ? items : [];

    try {
        // Check if invoice number already exists
        const checkResponse = await axios.get('/api/bill', {
            params: { invoiceNumber: invoiceNo }
        });

        const existingBills = checkResponse.data.bills.filter(bill => {
            return bill.invoiceNumber === invoiceNo;
        });

        if (existingBills.length > 0) {
            toast.error('A bill with this invoice number already exists.');
            setIsGenerating(false);
            return;
        }

        const hasFile = file !== null;
        let data;

        if (hasFile) {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('name', `${username.firstName} ${username.lastName}`);
            formData.append('phoneNumber', mobile);
            formData.append('invoiceNumber', invoiceNo);
            formData.append('remarks', '');
            formData.append('otherCharges', '0');
            formData.append('file', file);
            formData.append('generateShortBill', shortBill);
            formData.append('report', isReport);
            formData.append('generationToken', tokenEnabled);

            if (user?.role === 'INSTITUTION') {
                const notesPayload = safeItems.map(item => ({
                    chief_complaint: item.chiefComplaint || '',
                    treatment: item.treatment || '',
                    others: item.others || '',
                    amount: item.amount || 0

                }));
                formData.append('notes', JSON.stringify(notesPayload));
            } else {
                formData.append('items', JSON.stringify(safeItems.map(item => ({
                    name: item.particulars,
                    quantity: Number(item.qty),
                    price: Number(item.rate),
                }))));
            }

            data = await axios.post('/api/bill', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        } else {
            let payload;

            if (user?.role === 'INSTITUTION') {
                payload = {
                    userId,
                    name: `${username.firstName} ${username.lastName}`,
                    phoneNumber: mobile,
                    invoiceNumber: invoiceNo,
                    notes: safeItems.map(item => ({
                        chief_complaint: item.chiefComplaint || '',
                        treatment: item.treatment || '',
                        others: item.others || '',
                        amount: item.amount || 0

                    })),
                    remarks: '',
                    otherCharges: 0,
                    generateShortBill: shortBill,
                    generationToken: tokenEnabled,
                };
            } else {
                payload = {
                    userId,
                    name: `${username.firstName} ${username.lastName}`,
                    phoneNumber: mobile,
                    invoiceNumber: invoiceNo,
                    items: safeItems.map(item => ({
                        name: item.particulars,
                        quantity: Number(item.qty),
                        price: Number(item.rate),
                    })),
                    remarks: '',
                    otherCharges: 0,
                    generateShortBill: shortBill,
                    generationToken: tokenEnabled,
                };
            }

            data = await axios.post('/api/bill', payload);
        }

        if (data?.data?.shortBill) {
            setShortBillDetails(data.data.shortBill); // Save shortBill data to state
        }

        toast.success('Bill generated successfully!');
        console.log('Generated bill:', data);

    } catch (error) {
        console.error('Error generating bill:', error);
        toast.error(error.response?.data?.error || 'Error generating bill');
    } finally {
        setIsGenerating(false);
    }
};

    
    useEffect(() => {
        fetchUserDetails();
    }, []);


    useEffect(() => {
        const fetchFormatDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/billFormat');
            if (response.ok) {
                const data = await response.json();
                
                // Split tax and extra text for internal handling
                const [cgst, sgst] = data.taxPercentage?.split('+').map((val) => val.trim()) || [0, 0];
                const [terms = '', updates = ''] = data.extraText?.split('\n') || ['', ''];

                    const institution = data.institutionRelation || {};

                    setFormDetails({
                        firmName: institution.firmName || '',
                        address: institution.shopAddress || '',
                        contactNo: institution.phone || '',
                        gstNo: data.gstNumber || '',
                        email: institution.contactEmail || '',
                        cgst: parseFloat(cgst),
                        sgst: parseFloat(sgst),
                        proprietorSign: data.proprietorSign || null,
                        terms,
                        updates,
                    });
                } else {
                    const error = await response.json();
                    toast.error(error?.error || 'Failed to fetch format');
                }
            } catch (err) {
            console.error('Error fetching format details:', err);
            toast.error('Error fetching format details');
            } finally {
                setLoading(false); // hide loader
            }
        };

        fetchFormatDetails();
    }, []);

    const handleFetchingToken = async () => {
        if (!token) return toast.error("Please enter a token number");

        try {
            const response = await fetch(`/api/token/${token}/`);
            const data = await response.json();

            if (response.ok && data) {
                setUserId(data.id || '');
                setUsername({ firstName: data.firstName || '', lastName: data.lastName || '' });
                setAddress(data.address || '');
                setMobile(data.mobile || '');
                // toast.success("Receiver details fetched successfully!");
            } else {
                setUserId('');
                setUsername({ firstName: '', lastName: '' });
                setAddress('');
                setMobile('');
                toast.error("No data found for this token.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);

            setUserId('');
            setUsername({ firstName: '', lastName: '' });
            setAddress('');
            setMobile('');
            toast.error("Something went wrong.");
        }
    };

    useEffect(() => {
        if (userId) {
            toast.success("Receiver details fetched successfully");
        }
    }, [userId]);



    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        if (selectedFile.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl('');
        }
    };

    const cgstPercent = formDetails?.cgst || 0;
    const sgstPercent = formDetails?.sgst || 0;

    const cgstAmount = (itemsSubtotal * cgstPercent) / 100;
    const sgstAmount = (itemsSubtotal * sgstPercent) / 100;

    const totalAmount = itemsSubtotal + cgstAmount + sgstAmount;

    if (loading ) {
        return <LogoLoader content={"Loading bill format..."} />;
    }


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col relative">
            <Navbar />
            <main className="flex flex-col flex-1 gap-y-2 md:gap-y-4">

                <div className='p-4 relative flex justify-center items-center'>
                    <div className="flex flex-col flex-1 bg-white p-3 md:p-6 gap-2 md:gap-4 shadow-md w-full md:w-full md:max-w-5xl border border-black self-center mt-16">
                        {/* <EditFormat /> */}
                        <div className="flex items-center justify-between mt-2 md:mt-6 p-2 md:p-4 border rounded-md border-gray-400 ">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-sm md:text-[16px] bg-blue-600 cursor-pointer text-white rounded transition-all duration-500 ease-in-out hover:bg-blue-800 hover:font-medium"
                            >
                                <FaEdit size={20} strokeWidth={1.5} color="#fff" /> Edit Format
                            </button>
                            <span className="text-gray-700 font-semibold text-sm md:text-[16px]">Save your details</span>

                            {isOpen && <EditFormatModal closeModal={() => setIsOpen(false)} user={user} formDetails={formDetails} onFormDetailsChange={handleFormDetailsChange} />}
                        </div>
                        {/* toggles */}
                        <div className="flex flex-wrap gap-2 md:gap-4 p-2 md:p-4 justify-evenly">
                            {/* Short Bill Toggle */}
                            <div className="flex items-center justify-between md:justify-evenly gap-2 w-full sm:w-auto">
                                <span className="text-[16px] md:text-lg font-semibold text-gray-700 whitespace-nowrap">Short Bill Generation</span>
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

                            {/* Is Report Toggle */}
                            <div className="flex items-center justify-between md:justify-evenly gap-2 w-full sm:w-auto">
                                <span className="text-[16px] md:text-lg font-semibold text-gray-700 whitespace-nowrap">Is Report</span>
                                <label className="relative cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isReport}
                                        onChange={handleIsReportToggle}
                                    />
                                    <div className="relative h-6.5 md:h-9 w-14 md:w-22 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-0.5 after:h-5 after:w-5 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:after:translate-x-7 md:peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
                                        <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
                                        <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
                                    </div>
                                </label>
                            </div>

                            {/* Token generation toggle */}
                            <div className="flex items-center justify-between md:justify-evenly gap-2 w-full sm:w-auto">
                                <span className="text-[16px] md:text-lg font-semibold text-gray-700 whitespace-nowrap">Token Generation</span>
                                <label className="relative cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={tokenEnabled}
                                        onChange={handleTokenToggle}
                                    />
                                    <div className="relative h-6.5 md:h-9 w-14 md:w-22 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-0.5 after:h-5 after:w-5 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:after:translate-x-7 md:peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
                                        <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
                                        <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* upload image */}
                        <div className="flex flex-col gap-2 md:gap-6">
                            {/* Upload Section */}
                            <div className="flex justify-between items-center border border-gray-400 p-2 md:p-4 rounded-md">
                                <span className="text-gray-700 font-semibold text-sm md:text-[16px]">Upload Image or PDF</span>

                                <input
                                    type="file"
                                    id="hiddenFileInput"
                                    accept="application/pdf,image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => document.getElementById('hiddenFileInput').click()}
                                    className="flex items-center text-sm md:text-[16px] gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 cursor-pointer transition-all ease-in-out duration-400"
                                >
                                    <Upload size={20} /> Upload
                                </button>
                            </div>

                            {/* Preview */}
                            {/* {file && (
                                <div className="flex items-start gap-4 border p-3 rounded-md bg-gray-50">
                                    {previewUrl ? (
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="rounded object-cover"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">📄 {file.name}</p>
                                    )}
                                </div>
                            )} */}

                            {file && (
  <div className="flex items-start gap-4 border p-3 rounded-md bg-gray-50">
    {previewUrl ? (
      <div className="relative">
        <Image
          src={previewUrl}
          alt="Preview"
          width={100}
          height={100}
          className="rounded object-cover"
        />
        {/* Cross icon button inside image box */}
        <button
          onClick={() => {
            setFile(null);
            setPreviewUrl('');
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; 
            }
          }}
          className="absolute top-1 right-1 p-1 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80"
          aria-label="Remove file"
          type="button"
        >
          <X size={16} color="white" />
        </button>
      </div>
    ) : (
      <div className="relative flex items-center">
        <p className="text-sm text-gray-500">📄 {file.name}</p>
        {/* Cross icon for PDF or file */}
        <button
          onClick={() => {
            setFile(null);
            setPreviewUrl('');
          }}
          className="absolute top-1 right-1 p-1 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80"
          aria-label="Remove file"
          type="button"
        >
          <X size={16} color="white" />
        </button>
      </div>
    )}
  </div>
)}

                        </div>

                        {/* <UploadPdfImage /> */}

                    </div>
                </div>
                {/* Create bill */}

                <div className="p-4 relative" id="invoice-print" ref={billRef}>
                    <div
                        className="max-w-5xl mx-auto p-4 bg-white shadow-md border text-sm text-black"
                        // ref={billRef}
                    >
                        {/* Header Section */}
                        <div className="relative flex justify-center items-center my-4 md:my-8">
                            <h1 className="text-2xl font-bold text-center md:text-right md:w-3/5 md:mr-28">INVOICE</h1>
                            {/* <span
                                onClick={() => setIsScanning(true)}
                                className="flex items-center print:hidden gap-2 px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
                            >
                                <ScanLine size={20} strokeWidth={1.5} /> Scan
                            </span> */}

                            <div className="hidden md:flex items-center gap-2 print:hidden ml-auto">

                                {!tokenEnabled && (

                                    <>
                                        <input
                                            type="number"
                                            value={token}
                                            min="1"
                                            onChange={(e) => setToken(e.target.value)}
                                            placeholder="Enter Token No."
                                            className="px-3 py-2 border border-gray-300 transition-all duration-500 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleFetchingToken}
                                            className="px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
                                        >
                                            Fetch
                                        </button>
                                    </>

                                )}
                                <span
                                    onClick={() => setIsScanning(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
                                >
                                    <ScanLine size={20} strokeWidth={1.5} /> Scan
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center my-4 md:my-8">
                            <div className="flex md:hidden items-center gap-1 md:gap-2 print:hidden ml-auto">

                                {!tokenEnabled && (

                                    <>
                                        <input
                                            type="number"
                                            value={token}
                                            min="1"
                                            onChange={(e) => setToken(e.target.value)}
                                            placeholder="Enter Token No."
                                            className="p-1.5 md:px-3 md:py-2 border w-30 sm:w-50 border-gray-300 transition-all duration-500 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleFetchingToken}
                                            className="p-1.5 md:px-3 md:py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
                                        >
                                            Fetch
                                        </button>
                                    </>
                                )}
                                <span
                                    onClick={() => setIsScanning(true)}
                                    className="flex items-center gap-2 p-1.5 md:px-3 md:py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
                                >
                                    <ScanLine size={20} strokeWidth={1.5} /> Scan
                                </span>
                            </div>
                        </div>

                        {/* Bill Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2  gap-4 border-b pb-2 mb-4">
                            {/* <div className="p-2 border-r border-black">
                                <h2 className="text-lg font-bold text-[#0D6A9C] capitalize">{user?.firmName}</h2>
                                <p>{user?.address && `${user.address.houseNumber}, ${user.address?.buildingName ? user.address.buildingName + ', ' : ''}${user.address.street}, ${user.address.landmark}, ${user.address.city}, ${user.address.state} - ${user.address.zipCode}, ${user.address.country}`}</p>
                                <p>Mobile: {user?.mobileNumber}</p>
                            </div> */}
                            {formDetails ? (
                                <div className="p-2 pb-4 border-b md:border-r md:border-gray-400 print:border-b-0 print:border-r ">
                                    <h2 className="text-lg font-bold text-[#0D6A9C] capitalize">
                                        {formDetails?.firmName || "N/A"}
                                    </h2>
                                    <p>
                                        {formDetails?.address || "Address: N/A"}
                                    </p>
                                    <p> Mobile: <span className='text-gray-600'>{formDetails?.contactNo || "N/A"}</span></p>
                                    {formDetails?.email ? (
                                        <p>Email: <span className='text-gray-600'>{formDetails?.email}</span></p>
                                    ) : (
                                        <p>Email: N/A</p>
                                    )}
                                    {formDetails?.gstNo ? (
                                        <p>GST No: <span className='text-gray-600'>{formDetails?.gstNo}</span> </p>
                                    ) : (
                                        <p>GST No: N/A</p>
                                    )}
                                </div>
                            ) : (
                                <div className="p-2 border-r border-black">
                                    <h2 className="text-lg font-bold text-[#0D6A9C] capitalize">Firm Name: N/A</h2>
                                    <p>Address: N/A</p>
                                    <p>Mobile: N/A</p>
                                    {/* <p>Email: N/A</p>
                                    <p>GST No: N/A</p> */}
                                </div>
                            )}


                            <div className="p-2">
                                <h2 className="font-bold mb-1">RECEIVER DETAILS</h2>
                                <div className="flex flex-col mb-1">
                                    <div className="flex items-start">
                                        <label htmlFor="receiver-name" className="mr-1">Name:</label>
                                        <input
                                            id="receiver-name"
                                            type="text"
                                            value={username.firstName || ''}
                                            onChange={(e) => setUsername({ ...username, firstName: e.target.value })}
                                            className="w-full text-sm text-gray-600 capitalize outline-none"
                                            placeholder="Enter Name"
                                        />
                                        {/* <input
                                            id="receiver-lastname"
                                            type="text"
                                            value={username.lastName || ''} 
                                            onChange={(e) => setUsername({ ...username, lastName: e.target.value })}
                                            className="text-sm text-gray-700 capitalize outline-none"
                                            placeholder="Enter Last Name"
                                        /> */}
                                    </div>

                                    <div className="flex items-start">
                                        <label htmlFor="receiver-address" className="font-medium mr-1">Address:</label>
                                        <input id="receiver-address"
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full text-sm text-gray-600 outline-none"
                                            placeholder="Enter Address" />
                                    </div>
                                    <div className="flex items-start">
                                        <label htmlFor="receiver-phone" className="font-medium mr-1">Phone:</label>
                                        <input
                                            id="receiver-phone"
                                            type="number"
                                            min="10"
                                            max="10"
                                            value={mobile || ''}
                                            onChange={(e) => setMobile(e.target.value)}
                                            className="w-full text-sm text-gray-600 outline-none"
                                            placeholder="Enter Phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4 items-center">
                            <div className="text-left">
                                <p className="text-sm text-gray-600">Invoice Number</p>
                                <input
                                    type="number"
                                    min="1"
                                    className="font-bold outline-none border-b border-gray-400"
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
                                    {items.map((item, index) => (
                                        <tr key={index} className='text-xs md:text-sm print:text-sm'>
                                            <td className="border p-1 md:p-2 text-center print:p-2">{index + 1}</td>

                                            <td className="border p-1 md:p-2 print:p-2">

                                                {/* CHIEF COMPLAINT / PARTICULARS */}
                                                    {user?.role === 'INSTITUTION' ? (
                                                        <input
                                                            type="text"
                                                            value={item.chiefComplaint || ''}
                                                            onChange={(e) => handleItemChange(index, 'chiefComplaint', e.target.value)}
                                                            className="w-full border-none outline-none"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={item.particulars || ''}
                                                            onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                                                            className="w-full border-none outline-none"
                                                        />
                                                    )}
                                            </td>

                                            <td className="border p-1 md:p-2 print:p-2">

                                                {/* TREATMENT / QUANTITY */}
                                                    {user?.role === 'INSTITUTION' ? (
                                                        <input
                                                            type="text"
                                                            value={item.treatment || ''}
                                                            onChange={(e) => handleItemChange(index, 'treatment', e.target.value)}
                                                            className="w-full border-none outline-none"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={item.qty}
                                                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                            className="w-full border-none outline-none"
                                                        />
                                                    )}
                                            </td>

                                            <td className="border p-1 md:p-2 print:p-2">

                                                {/* OTHERS / RATE */}
                                                    {user?.role === 'INSTITUTION' ? (
                                                        <input
                                                            type="text"
                                                            value={item.others || ''}
                                                            onChange={(e) => handleItemChange(index, 'others', e.target.value)}
                                                            className="w-full border-none outline-none"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={item.rate}
                                                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                            className="w-full border-none outline-none"
                                                        />
                                                    )}
                                            </td>
                                            <td className="border p-1 md:p-2 text-center print:p-2">
                                                {user?.role === 'INSTITUTION' ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.amount || ''}
                                                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                                        className="w-full border-none outline-none text-center"
                                                    />
                                                ) : (
                                                    item?.amount?.toFixed(2)
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="4" className="text-xs md:text-sm print:text-sm border p-2 text-right font-bold">Items Subtotal</td>
                                        <td className="text-xs md:text-sm print:text-sm border p-2 text-center font-bold">{itemsSubtotal.toFixed(2)}</td>
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

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-4">
                            <button onClick={addItemRow} className="bg-yellow-500 cursor-pointer transition-all ease-in-out duration-400 hover:bg-amber-500 print:hidden text-white px-2 py-1 rounded text-sm">Add Item</button>
                            <button
                                onClick={handlePrint}
                                className="px-3 py-1 bg-indigo-500 cursor-pointer transition-all ease-in-out duration-400 hover:bg-indigo-600 print:hidden text-white text-sm rounded"
                            >
                                Print
                            </button>
                            <button onClick={handleGenerateBill} disabled={isGenerating} className={`px-4 py-2 rounded-md cursor-pointer transition-all ease-in-out duration-400 print:hidden text-white ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>{isGenerating ? 'Generating...' : 'Generate Bill'}</button>
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
                        {/* Short Bill Display Section */}

                        {shortBillDetails && (
                            <div className="bg-gray-50/80 p-4 rounded-sm shadow-md text-sm text-slate-600 w-full mt-20">
                                {/* Row 1 */}
                                <div className="flex justify-between border-b pb-2 mb-2">
                                    <span className="w-1/3 text-slate-800 text-[16px] md:text-lg font-semibold">Short Bill</span>
                                    <span className="w-1/3 text-slate-800 text-center text-sm">
                                        <span className="font-semibold">Invoice No:</span> {invoiceNo}
                                    </span>
                                    <span className="w-1/3 text-slate-800 text-right text-sm">
                                        <span className="font-semibold block md:inline">Phone:</span> <span className='block md:inline'> {user?.phone || phoneNumber || "N/A"} </span>
                                    </span>
                                </div>

                                {/* Row 2 */}
                                {user?.role === 'SHOP_OWNER' ? (
                                    <div className="mb-2">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-1">Particulars (Qty)</h3>
                                        <p className="text-xs text-slate-600">
                                            {items.map((item, i) => `${item.particulars}(${item.qty})`).join(', ')}
                                        </p>
                                    </div>
                                ) : user?.role === 'INSTITUTION' ? (
                                    <div className="mb-2 text-xs text-slate-700">
                                        <div className="mb-1">
                                            <span className="font-semibold">Treatment: </span>
                                            {items.map(item => item.treatment).join(', ')}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Others: </span>
                                            {items.map(item => item.others).join(', ')}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 italic">No details available for this role.</div>
                                )}

                                {/* Row 3 */}
                                <div className="flex justify-between border-t pt-2 mt-2 text-sm font-medium">
                                    <span className="w-1/2">
                                        <span className="font-semibold block md:inline">Username:</span> <span className='block md:inline'>{username?.firstName} {username?.lastName}</span>
                                    </span>
                                    <span className="w-1/2 text-right">
                                        <span className="font-semibold">Total Amt:</span> ₹{totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}


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
                                    // setUserId={setUserId}
                                    // setUsername={setUsername}
                                    // setAddress={setAddress}
                                    // setMobile={setMobile}
                                    // onScanSuccess={() => setIsScanning(false)} 
                                    onScanSuccess={handleScanSuccess}

                                />
                            </div>
                        </div>
                    )}

                </div>

            </main>
        </div>

    );
}
