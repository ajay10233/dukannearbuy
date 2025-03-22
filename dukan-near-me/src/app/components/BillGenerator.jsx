'use client';

import { useState } from 'react';

export default function BillGenerator() {
    const [items, setItems] = useState([{ particulars: '', qty: '', rate: '', amount: 0 }]);
    const [cgst, setCgst] = useState(0);
    const [sgst, setSgst] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerType, setCustomerType] = useState('M/S');

    // Handle input change
    const handleItemChange = (index, key, value) => {
        const newItems = [...items];
        newItems[index][key] = value;

        if (key === 'qty' || key === 'rate') {
            newItems[index].amount = (newItems[index].qty || 0) * (newItems[index].rate || 0);
        }
        
        setItems(newItems);
    };

    // Calculate total without GST
    const totalWithoutGST = items.reduce((acc, item) => acc + item.amount, 0);
    const cgstAmount = (totalWithoutGST * cgst) / 100;
    const sgstAmount = (totalWithoutGST * sgst) / 100;
    const grandTotal = totalWithoutGST + cgstAmount + sgstAmount;

    // Add new row
    const addRow = () => {
        setItems([...items, { particulars: '', qty: '', rate: '', amount: 0 }]);
    };

    return (
        <div className="p-6 border rounded-lg shadow-lg bg-white max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold text-center mb-4">BILL</h1>

            {/* Shop Details */}
            <div className="text-center mb-6">

                <p>Phone: +91 12345 67890</p>
                <p>Address: XYZ Street, City, State - 123456</p>
            </div>

            {/* Customer Details */}
            <div className="flex items-center gap-4 mb-6">
                <label className="font-medium">Customer:</label>
                <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className="border rounded p-1"
                >
                    <option value="M/S">M/S</option>
                    <option value="M/R">M/R</option>
                </select>
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="border rounded p-1 flex-1"
                />
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">S.No</th>
                        <th className="border p-2">Particulars</th>
                        <th className="border p-2">Qty</th>
                        <th className="border p-2">Rate</th>
                        <th className="border p-2">Amount</th>
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
                                    onChange={(e) =>
                                        handleItemChange(index, 'particulars', e.target.value)
                                    }
                                    className="w-full border-none outline-none"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) =>
                                        handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full border-none outline-none"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    value={item.rate}
                                    onChange={(e) =>
                                        handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full border-none outline-none"
                                />
                            </td>
                            <td className="border p-2 text-center">
                                {item.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Row Button */}
            <button
                onClick={addRow}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                + Add Row
            </button>

            {/* GST Section */}
            <div className="mt-6 border-t pt-4">
                <div className="flex justify-between">
                    <span>Total Without GST:</span>
                    <span>₹ {totalWithoutGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>CGST (%):</span>
                    <input
                        type="number"
                        value={cgst}
                        onChange={(e) => setCgst(parseFloat(e.target.value) || 0)}
                        className="border p-1 w-16"
                    />
                    <span>₹ {cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>SGST (%):</span>
                    <input
                        type="number"
                        value={sgst}
                        onChange={(e) => setSgst(parseFloat(e.target.value) || 0)}
                        className="border p-1 w-16"
                    />
                    <span>₹ {sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Grand Total:</span>
                    <span>₹ {grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
