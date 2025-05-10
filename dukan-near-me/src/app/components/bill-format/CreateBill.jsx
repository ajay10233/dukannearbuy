// "use client";

// import { X } from "lucide-react";
// import { useState } from "react";

// export default function CreateBill() {
//   const [billItems, setBillItems] = useState([
//     { particular: "", quantity: 1, rate: 0, amount: 0 },
//   ]);
//   const [customerDetails, setCustomerDetails] = useState({
//     customerName: "",
//     mobileNo: "",
//     date: new Date().toISOString().substr(0, 10),
//   });

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...billItems];
//     updatedItems[index][field] = field === "quantity" || field === "rate" ? parseFloat(value) : value;
//     updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
//     setBillItems(updatedItems);
//   };

//   const addNewItem = () => {
//     setBillItems([...billItems, { particular: "", quantity: 1, rate: 0, amount: 0 }]);
//   };

//   const removeItem = (index) => {
//     const updatedItems = billItems.filter((_, i) => i !== index);
//     setBillItems(updatedItems);
//   };

//   const calculateTotal = () => {
//     return billItems.reduce((total, item) => total + item.amount, 0);
//   };

//   const handleCancel = () => {
//     if (confirm("Are you sure you want to clear all data?")) {
//       setCustomerDetails({
//         customerName: "",
//         mobileNo: "",
//         date: new Date().toISOString().substr(0, 10),
//       });
//       setBillItems([{ particular: "", quantity: 1, rate: 0, amount: 0 }]);
//     }
//   };

//   const handleSave = () => {
//     alert("Bill Saved (Next: connect with backend!)");
//   };

//   const handleSaveAndNew = () => {
//     handleSave();
//     setCustomerDetails({
//       customerName: "",
//       mobileNo: "",
//       date: new Date().toISOString().substr(0, 10),
//     });
//     setBillItems([{ particular: "", quantity: 1, rate: 0, amount: 0 }]);
//   };

//   return (
//     <div className="p-2 md:p-6 flex flex-col flex-1 bg-white/30  gap-4 rounded-md shadow-md w-full md:w-full md:max-w-5xl self-center mb-8">
//       <h1 className="text-2xl font-bold mb-3 md:mb-6">Bill Generation</h1>

//       {/* Customer Details */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-8">
//         <input
//           type="text"
//           placeholder="Customer Name (M/S or M/R)"
//           value={customerDetails.customerName}
//           onChange={(e) => setCustomerDetails({ ...customerDetails, customerName: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Mobile No."
//           value={customerDetails.mobileNo}
//           onChange={(e) => setCustomerDetails({ ...customerDetails, mobileNo: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           value={customerDetails.date}
//           onChange={(e) => setCustomerDetails({ ...customerDetails, date: e.target.value })}
//           className="border p-2 rounded"
//         />
//       </div>

//       {/* Bill Items Table */}
//       <div className="overflow-x-auto sm:overflow-x-hidden">
//         <table className="min-w-full text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-1 sm:p-2">S.No</th>
//               <th className="border p-1 sm:p-2">Particulars</th>
//               <th className="border p-1 sm:p-2">Quantity</th>
//               <th className="border p-1 sm:p-2">Rate</th>
//               <th className="border p-1 sm:p-2">Amount</th>
//               <th className="border p-1 sm:p-2"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {billItems.map((item, index) => (
//               <tr key={index}>
//                 <td className="border p-1 sm:p-2 text-center">{index + 1}</td>
//                 <td className="border p-1 sm:p-2">
//                   <input
//                     type="text"
//                     value={item.particular}
//                     onChange={(e) => handleItemChange(index, "particular", e.target.value)}
//                     className="w-full p-1 "
//                   />
//                 </td>
//                 <td className="border p-1 sm:p-2">
//                   <input
//                     type="number"
//                     min="1"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                     className="w-full p-1 "
//                   />
//                 </td>
//                 <td className="border p-1 sm:p-2">
//                   <input
//                     type="number"
//                     min="0"
//                     value={item.rate}
//                     onChange={(e) => handleItemChange(index, "rate", e.target.value)}
//                     className="w-full p-1 "
//                   />
//                 </td>
//                 <td className="border p-1 sm:p-2 text-right">{item.amount.toFixed(2)}</td>
//                 <td className="border p-1 sm:p-2">
//                   <button
//                     type="button"
//                     onClick={() => removeItem(index)}
//                     className="px-2 py-1 text-red-600 hover:text-red-800 cursor-pointer"
//                   >
//                     <X size={20} strokeWidth={1.5} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         type="button"
//         onClick={addNewItem}
//         className="mt-4 bg-blue-600 text-white cursor-pointer px-4 py-2 rounded transition-all duration-500 ease-in-out hover:bg-blue-800"
//       >
//         + Add Item
//       </button>

//       {/* Total Calculation */}
//       <div className="text-right mt-8">
//         <h2 className="text-xl font-semibold">Total: ₹ {calculateTotal().toFixed(2)}</h2>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-wrap justify-end gap-4 mt-6">
//         {/* Save Button */}
//         <button
//           type="button"
//           onClick={handleSave}
//           className="px-3 md:px-6 py-2 bg-emerald-500 text-white rounded cursor-pointer hover:bg-emerald-700 transition-all duration-500 ease-in-out"
//         >
//           Save Bill
//         </button>

//         {/* Cancel Button */}
//         <button
//           type="button"
//           onClick={handleCancel}
//           className="px-3 md:px-6 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-200 transition-all duration-500 ease-in-out cursor-pointer"
//         >
//           Cancel
//         </button>

//         {/* Save & New Button */}
//         <button
//           type="button"
//           onClick={handleSaveAndNew}
//           className="px-3 md:px-6 py-2 bg-blue-600 text-white rounded cursor-pointer transition-all duration-500 ease-in-out hover:bg-blue-800"
//         >
//           Save & New
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export default function BillGeneratorWithSave() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-GB').split('/').join('-');
  });

  const billRef = useRef();

  const [items, setItems] = useState([
    { particulars: '', qty: 1, rate: 0, amount: 0 },
  ]);

  const [charges, setCharges] = useState([]);

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = key === 'qty' || key === 'rate' ? parseFloat(value) || 0 : value;
    newItems[index].amount = newItems[index].qty * newItems[index].rate;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { particulars: '', qty: 1, rate: 0, amount: 0 }]);
  };

  const handleChargeChange = (index, key, value) => {
    const newCharges = [...charges];
    newCharges[index][key] = key === 'amount' ? parseFloat(value) || 0 : value;
    setCharges(newCharges);
  };

  const addChargeRow = () => {
    setCharges([...charges, { particulars: '', amount: 0 }]);
  };

  const itemsSubtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const chargesSubtotal = charges.reduce((acc, charge) => acc + charge.amount, 0);
  const totalAmount = itemsSubtotal + chargesSubtotal;

  const handleCancel = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setInvoiceNo('');
      setItems([{ particulars: '', qty: 1, rate: 0, amount: 0 }]);
      setCharges([]);
    }
  };

  const handleSave = () => {
    toast.success('Bill saved!');
  };

  const handleSaveAndNew = () => {
    handleSave();
    setInvoiceNo('');
    setItems([{ particulars: '', qty: 1, rate: 0, amount: 0 }]);
    setCharges([]);
  };

  // const handlePrint = () => {
  //   window.print();
  // };
  const handlePrint = () => {
  const printContents = billRef.current.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); 
};


  return (
    <div className="p-4">

      <div className="max-w-5xl mx-auto p-4 bg-white shadow-md border text-sm text-black" ref={billRef}>
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
              <p>Name:</p>
              <p>Address:</p>
              <p>Mobile:</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4 items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600">Invoice Number</p>
            <input type="text" className="font-bold w-full outline-none"
              value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="font-bold">{invoiceDate}</p>
          </div>
        </div>

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
                    <input type="text" value={item.particulars}
                      onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                      className="w-full border-none outline-none" />
                  </td>
                  <td className="border p-2">
                    <input type="number" value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="w-full border-none outline-none" />
                  </td>
                  <td className="border p-2">
                    <input type="number" value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full border-none outline-none" />
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

        <div className="mb-4">
          <h3 className="font-bold mb-2">Other Charges</h3>
          {charges.map((charge, index) => (
            <div key={index} className="flex justify-between items-center mb-2 border p-2">
              <input type="text" value={charge.particulars}
                onChange={(e) => handleChargeChange(index, 'particulars', e.target.value)}
                placeholder="Charge description" className="w-full border-none outline-none" />
              <input type="number" value={charge.amount}
                onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="w-22 border-l p-1 outline-none text-right ml-2" />
            </div>
          ))}
          <button onClick={addChargeRow} className="px-3 py-1 bg-[#9fc9de] cursor-pointer text-white text-sm rounded">Add Other Charge</button>
        </div>

        <div className="text-right font-bold text-lg">Total Amount: ₹{totalAmount.toFixed(2)}</div>

        <div className="flex space-x-4 mt-4">
          <button onClick={addItemRow} className="px-3 py-1 bg-[#9fc9de] text-white text-sm rounded">Add Item</button>
        </div>
      </div>

      <div className="flex justify-end mb-4 space-x-2 my-2">
        <button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-500 ease-in-out cursor-pointer px-4 py-2 rounded text-sm">Save</button>
        <button onClick={handleSaveAndNew} className="bg-green-500 text-white hover:bg-green-600 transition-all duration-500 ease-in-out cursor-pointer px-4 py-2 rounded text-sm">Save & New</button>
        <button onClick={handleCancel} className="border border-gray-700 bg-gray-200 transition-all duration-500 ease-in-out cursor-pointer px-4 py-2 rounded text-sm">Cancel</button>
        <button onClick={handlePrint} className="bg-yellow-500 text-white cursor-pointer px-4 py-2 rounded text-sm">Print</button>
      </div>
    </div>
  );
}
