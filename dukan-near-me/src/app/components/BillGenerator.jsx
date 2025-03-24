'use client';

import { useState } from 'react';

export default function BillGenerator() {
    const [invoiceNo, setInvoiceNo] = useState();

    const [invoiceDate, setInvoiceDate] = useState(() => {
    const now = new Date();
        return now.toLocaleDateString('en-GB').split('/').join('-');
    });

    const [items, setItems] = useState([
        { particulars: '', qty: 0, rate: 0, amount: 0 },
    ]);

    const handleItemChange = (index, key, value) => {
        const newItems = [...items];
        newItems[index][key] = value;
        const qty = parseFloat(newItems[index].qty) || 0;
        const rate = parseFloat(newItems[index].rate) || 0;
        newItems[index].amount = qty * rate;
        setItems(newItems);
    };

    const addItemRow = () => {
        setItems([...items, { particulars: '', qty: 0, rate: 0, amount: 0 }]);
    };

    const [charges, setCharges] = useState([]);

    const handleChargeChange = (index, key, value) => {
        const newCharges = [...charges];
        newCharges[index][key] = value;
        setCharges(newCharges);
    };

    const addChargeRow = () => {
        setCharges([...charges, { particulars: '', amount: 0 }]);
    };

    const itemsSubtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const chargesSubtotal = charges.reduce(
        (acc, charge) => acc + (parseFloat(charge.amount) || 0),0);
    const totalAmount = itemsSubtotal + chargesSubtotal;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <button onClick={handlePrint} className="bg-amber-300 text-white px-4 py-2 rounded text-sm">Print</button>
            </div>

            <div className="max-w-4xl mx-auto p-4 bg-white shadow-md border text-sm text-black">
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
            <p className="font-bold">{invoiceNo}</p>
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
                    <input type="text"
                        value={item.particulars}
                        onChange={(e) =>handleItemChange(index, 'particulars', e.target.value)}className="w-full border-none outline-none"/>
                  </td>
                  <td className="border p-2">
                    <input type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange( index,'qty', parseFloat(e.target.value) || 0 )}
                        className="w-full border-none outline-none"/>
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange( index, 'rate', parseFloat(e.target.value) || 0 )} className="w-full border-none outline-none"/>
                  </td>
                  <td className="border p-2 text-center">
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="border p-2 text-right font-bold">
                  Items Subtotal
                </td>
                <td className="border p-2 text-center font-bold">
                  {itemsSubtotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Other Charges</h3>
          {charges.map((charge, index) => (
            <div key={index} className="flex justify-between items-center mb-2 border p-2">
              <input type="text"
                value={charge.particulars}
                onChange={(e) => handleChargeChange(index, 'particulars', e.target.value)}
                placeholder="Charge description" className="w-full border-none outline-none" />
              <input type="number" value={charge.amount}
                onChange={(e) =>handleChargeChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="w-22 border-l p-1 outline-none text-right ml-2"/>
            </div>
          ))}
          <button onClick={addChargeRow} className="px-3 py-1 bg-[#9fc9de] cursor-pointer text-white text-sm rounded"> Add Other Charge</button>
        </div>

        <div className="text-right font-bold text-lg"> Total Amount: {totalAmount.toFixed(2)} </div>

        <div className="flex space-x-4 mt-4">
          <button className="px-3 py-1 bg-[#9fc9de] text-white text-sm rounded cursor-pointer"
            onClick={addItemRow}> Add Item </button>
        </div>
      </div>
    </div>
  );
}
