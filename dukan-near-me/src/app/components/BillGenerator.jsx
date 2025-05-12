'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDebounce } from '@/lib/hooks/useDebounce';

export default function BillGenerator() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([{ particulars: '', qty: 0, rate: 0, amount: 0 }]);
  const [charges, setCharges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [receiverDetails, setReceiverDetails] = useState(null);

  const [invoiceDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-GB').split('/').join('-');
  });

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get('/api/users/me');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const fetchReceiverDetails = async () => {
    if (!debouncedSearchQuery) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const { data } = await axios.get(`/api/users?search=${debouncedSearchQuery}`);
      if (data?.data?.length > 0) {
        console.log(data);
        setSearchResults(data.data);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Failed to fetch receiver details:', error);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleUserSelect = (user) => {
    console.log(user);
    const name = `${user.firstName ? user.firstName + ' ' : ''} ${user.lastName ? user.lastName : ''}`;
    const address = `${user?.houseNumber ? user?.houseNumber + ', ' : ''}, ${user?.buildingName ? user?.buildingName + ', ' : ''}${user?.street ? user?.street + ', ' : ''}, ${user?.landmark ? user?.landmark + ', ' : ''}, ${user?.city ? user?.city + ', ' : ''}, ${user?.state ? user?.state + ', ' : ''} - ${user?.zipCode ? user?.zipCode + ', ' : ''}, ${user?.country ? user?.country : ''}`;
    setReceiverDetails({
      name: name,
      address: address,
      mobileNumber: user?.mobileNumber,
    });
    setSearchQuery(user.name);
    setSearchResults([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchReceiverDetails();
  }, [debouncedSearchQuery]);

  const handleItemChange = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    const qty = parseFloat(updated[index].qty) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].amount = qty * rate;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { particulars: '', qty: 0, rate: 0, amount: 0 }]);
  };

  const handleChargeChange = (index, key, value) => {
    const updated = [...charges];
    updated[index][key] = value;
    setCharges(updated);
  };

  const addChargeRow = () => {
    setCharges([...charges, { particulars: '', amount: 0 }]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateBill = async () => {
    try {
      const payload = {
        userId: 'USER_ID', // Replace with actual user ID
        tokenId: 'TOKEN_ID', // Replace with actual token ID
        name: receiverDetails.name,
        phoneNumber: receiverDetails.mobile,
        invoiceNumber: invoiceNo,
        items: items.map((item) => ({
          name: item.particulars,
          quantity: parseFloat(item.qty),
          price: parseFloat(item.rate),
        })),
        remarks: 'Optional remarks here',
        otherCharges: charges.reduce((acc, cur) => acc + Number(cur.amount || 0), 0),
        generateShortBill: true,
      };

      const { data } = await axios.post('/api/bill', payload);
      alert('Bill generated successfully!');
      console.log('Generated bill:', data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error generating bill');
    }
  };

  const itemsSubtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const chargesSubtotal = charges.reduce((acc, charge) => acc + (parseFloat(charge.amount) || 0), 0);
  const totalAmount = itemsSubtotal + chargesSubtotal;

  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={handlePrint} className="bg-amber-300 text-white px-4 py-2 rounded text-sm">Print</button>
        <button onClick={handleGenerateBill} className="bg-blue-500 text-white px-4 py-2 rounded text-sm">Generate Bill</button>
      </div>

      <div className="max-w-4xl mx-auto p-4 bg-white shadow-md border text-sm text-black">
        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4">
          <div className="p-2 border-r border-black">
            <h1 className="text-lg font-bold text-[#0D6A9C]">{user?.firmName}</h1>
            <p>{user?.address && `${user.address.houseNumber}, ${user.address?.buildingName ? user.address.buildingName + ', ' : ''}${user.address.street}, ${user.address.landmark}, ${user.address.city}, ${user.address.state} - ${user.address.zipCode}, ${user.address.country}`}</p>
            <p>Mobile: {user?.mobileNumber}</p>
          </div>

          <div className="p-2 relative">
            <h2 className="font-bold mb-1">RECEIVER DETAILS</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              className="border px-2 py-1 mb-2 w-full no-print"
            />
            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto shadow-md no-print">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                  >
                    {user.username} - {user.mobileNumber}
                  </li>
                ))}
              </ul>
            )}
            <p><strong>Name:</strong> {receiverDetails != null && receiverDetails.name}</p>
            <p><strong>Address:</strong> {receiverDetails?.address && receiverDetails.address}</p>
            <p><strong>Mobile:</strong> {receiverDetails?.mobileNumber}</p>
          </div>
        </div>

        {/* <div className="mb-4">
          <label className="block font-semibold">Invoice No</label>
         
        </div> */}
        <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4 items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600">Invoice Number</p>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="border px-2 py-1 w-full"
            />
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
                      onChange={(e) => handleItemChange(index, 'particulars', e.target.value)} className="w-full border-none outline-none" />
                  </td>
                  <td className="border p-2">
                    <input type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)}
                      className="w-full border-none outline-none" />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} className="w-full border-none outline-none" />
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
            <div key={index} className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Particulars"
                value={charge.particulars}
                onChange={(e) => handleChargeChange(index, 'particulars', e.target.value)}
                className="border px-2 py-1"
              />
              <input
                type="number"
                placeholder="Amount"
                value={charge.amount}
                onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                className="border px-2 py-1"
              />
            </div>
          ))}
          <button onClick={addChargeRow} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Add Charge</button>
        </div>

        <div className="text-right font-bold">
          <p>Items Total: ₹{itemsSubtotal.toFixed(2)}</p>
          <p>Other Charges: ₹{chargesSubtotal.toFixed(2)}</p>
          <p className="text-xl">Total: ₹{totalAmount.toFixed(2)}</p>
        </div>
        <button onClick={addItemRow} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Add Item</button>
      </div>
    </div>
  );
}
