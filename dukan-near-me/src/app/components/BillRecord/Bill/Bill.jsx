// import { Heart, Calendar, Filter, ArrowDownToLine } from 'lucide-react';
// import { useState, useEffect } from 'react';

// export default function Bill() {
//   const initialBills = [
//     { id: 1, invoice: 'MED001', date: '2025-04-19', institution: 'Apollo Hospitals', amount: 12500, type: 'Medical' },
//     { id: 2, invoice: 'MED002', date: '2025-04-18', institution: 'Fortis Healthcare', amount: 8900, type: 'Medical' },
//     { id: 3, invoice: 'MED003', date: '2025-04-17', institution: 'AIIMS Delhi', amount: 10250, type: 'Medical' },
//     { id: 4, invoice: 'MED004', date: '2025-04-16', institution: 'Max Super Speciality', amount: 7600, type: 'Medical' },
//     { id: 5, invoice: 'MED005', date: '2025-04-15', institution: 'Medanta The Medicity', amount: 13400, type: 'Medical' },
//     { id: 6, invoice: 'MED006', date: '2025-04-14', institution: 'Care Hospitals', amount: 9750, type: 'Medical' },
//     { id: 7, invoice: 'SHOP001', date: '2025-04-13', institution: 'KIMS Shop', amount: 8800, type: 'Shop Owner' },
//     { id: 8, invoice: 'SHOP002', date: '2025-04-12', institution: 'Narayana Shop', amount: 11700, type: 'Shop Owner' },
//   ];

//   const [bills, setBills] = useState([]);
//   const [search, setSearch] = useState('');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');
//   const [typeFilter, setTypeFilter] = useState('');
//   const [favoriteFilter, setFavoriteFilter] = useState(null);

//   const [showDateFilter, setShowDateFilter] = useState(false);
//   const [showTypeFilter, setShowTypeFilter] = useState(false);
//   const [showFavFilter, setShowFavFilter] = useState(false);
//   const [selectedAction, setSelectedAction] = useState({});
//   const [openMenuId, setOpenMenuId] = useState(null);


//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('favBills')) || {};
//     const withFavStatus = initialBills.map((bill) => {
//       const fav = stored[bill.id];
//       const favorited = fav && (!fav.expiry || new Date(fav.expiry) > new Date());
//       return {
//         ...bill,
//         favorited,
//         expiry: fav?.expiry || null,
//       };
//     });
//     setBills(withFavStatus);
//   }, []);

//   const toggleFavorite = (id) => {
//     const updated = bills.map((bill) => {
//       if (bill.id === id) {
//         const isNowFav = !bill.favorited;
//         const expiry = isNowFav ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);
//         return {
//           ...bill,
//           favorited: isNowFav,
//           expiry: expiry?.toISOString() || null,
//         };
//       }
//       return bill;
//     });

//     setBills(updated);

//     const saveToStorage = {};
//     updated.forEach((bill) => {
//       if (bill.favorited || (bill.expiry && new Date(bill.expiry) > new Date())) {
//         saveToStorage[bill.id] = {
//           expiry: bill.expiry,
//         };
//       }
//     });

//     localStorage.setItem('favBills', JSON.stringify(saveToStorage));
//   };

//   const filteredBills = bills.filter((bill) => {
//     const isFavValid =
//       favoriteFilter === null ||
//       bill.favorited === favoriteFilter;
  
//     const isDateValid =
//       (!dateFrom || new Date(bill.date) >= new Date(dateFrom)) &&
//       (!dateTo || new Date(bill.date) <= new Date(dateTo));
  
//     const matchesSearch = bill.institution.toLowerCase().includes(search.toLowerCase());
  
//     return isFavValid && isDateValid && (!typeFilter || bill.type === typeFilter) && matchesSearch;
//   });
  
//   const handleActionSelect = (billId, action) => {
//     setSelectedAction(prev => ({ ...prev, [billId]: action }));
//     setOpenMenuId(null);
//   };


//   return (
//     <div className="flex flex-col gap-3 w-full h-full p-4 bg-gray-50 rounded-lg shadow-sm">
//       {/* Search Bar */}
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search by institution..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-teal-700 transition-all duration-300 ease-in-out outline-none hover:border-gray-400"
//         />
//       </div>

//       {/* Header */}
//       <div className="flex text-sm text-slate-400 font-medium pr-8 relative z-5">
//         <ul className="flex w-full *:w-1/5 justify-between relative">
//         <li className='justify-center items-center relative hidden md:flex'>
//             Favorite
//             <Heart
//               className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-red-500"
//               onClick={() => {
                
//                 setShowFavFilter(!showFavFilter);
//                 setShowTypeFilter(false);
//                 setShowDateFilter(false);
//               }}
//             />
//             {showFavFilter && (
//               <div className="absolute top-6 bg-white w-28 text-sm border border-gray-300 rounded-md shadow-md p-2 flex flex-col">
//                 <label>
//                   <input
//                     type="radio"
//                     checked={favoriteFilter === null}
//                     onChange={() => setFavoriteFilter(null)}
//                     className="mr-1"
//                   />
//                   All
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     checked={favoriteFilter === true}
//                     onChange={() => setFavoriteFilter(true)}
//                     className="mr-1"
//                   />
//                   Favorites
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     checked={favoriteFilter === false}
//                     onChange={() => setFavoriteFilter(false)}
//                     className="mr-1"
//                   />
//                   UnFavorite
//                 </label>
//               </div>
//             )}
//         </li>

//           <li className='justify-center items-center hidden md:flex'>Invoice No.</li>

//           <li className='flex justify-center items-center relative'>
//             Date
//             <Calendar
//               className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
//               onClick={() => {
//                 setShowDateFilter(!showDateFilter);
//                 setShowTypeFilter(false);
//                 setShowFavFilter(false);
//               }}
//             />
//             {showDateFilter && (
//               <div className="absolute top-6 bg-white w-60 text-slate-700 border border-gray-300 rounded-lg shadow-md p-2 flex flex-col">
//                 <label className="text-sm mb-2">From:</label>
//                 <input
//                   type="date"
//                   value={dateFrom}
//                   onChange={(e) => setDateFrom(e.target.value)}
//                   className="w-full mb-2 bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm"
//                 />
//                 <label className="text-sm mb-2">To:</label>
//                 <input
//                   type="date"
//                   value={dateTo}
//                   onChange={(e) => setDateTo(e.target.value)}
//                   className="w-full bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm"
//                 />
//               </div>
//             )}
//           </li>

//           <li className='flex justify-center items-center relative'>
//             Institution
//             <Filter
//               className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
//               onClick={() => {
//                 setShowTypeFilter(!showTypeFilter);
//                 setShowDateFilter(false);
//                 setShowFavFilter(false);
//               }}
//             />
//             {showTypeFilter && (
//               <select
//                 value={typeFilter}
//                 onChange={(e) => {
//                   setTypeFilter(e.target.value);
//                   setShowTypeFilter(false);
//                 }}
//                 className="absolute top-6 w-40 bg-white border border-gray-300 rounded-lg shadow-md p-2 text-sm"
//               >
//                 <option value="">All</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Shop Owner">Shop Owner</option>
//               </select>
//             )}
//           </li>

//           <li className='hidden md:flex justify-center items-center'>₹Amount</li>
//           <li className='flex justify-center items-center'>Download</li>
//         </ul>
//       </div>

//       {/* Scrollable list */}
//       <div className="flex flex-col gap-3 h-[60vh] overflow-y-scroll dialogScroll pr-2">
//         {filteredBills.length > 0 ? (
//         //   <div className="text-center text-gray-500 mt-4">No results found</div>
//         // ) : (
//           filteredBills.map((bill) => (
//             <div key={bill.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center w-full">
//               <ul className="flex items-center text-sm text-slate-600 w-full justify-between *:w-1/5 text-center">
//                 <li className='hidden md:block'>
//                   <button onClick={() => toggleFavorite(bill.id)}>
//                     <Heart
//                       size={20}
//                       strokeWidth={1.5}
//                       stroke="red"
//                       fill={bill.favorited ? 'red' : 'transparent'}
//                       className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
//                     />
//                   </button>
//                 </li>
//                 <li className="font-semibold hidden md:block">{bill.invoice}</li>
//                 <li>{bill.date}</li>
//                 <li>{bill.institution}</li>
//                 <li className='hidden md:block'>₹{bill.amount}</li>
//                 <li className="flex justify-center items-center">
//                   <span
//                     className="text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out">
//                     <ArrowDownToLine size={17} strokeWidth={2.5} />
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 mt-4">No results found</div>
//         )}
//       </div>
//     </div>
//   );
// }


import { Heart, Calendar, Filter, ArrowDownToLine, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios'; 

export default function Bill() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState(null);
  const [selectedAction, setSelectedAction] = useState(''); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showFavFilter, setShowFavFilter] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/billRecord');
        const data = response.data;
        console.log(response.data);
  
        const stored = JSON.parse(localStorage.getItem('favBills')) || {};
        console.log(stored); 
  
        const withFavStatus = Array.isArray(data.bills) ? data.bills.map((bill) => {
          const fav = stored[bill.id];
          const favorited = fav && (!fav.expiry || new Date(fav.expiry) > new Date());
          return {
            ...bill,
            favorited,
            expiry: fav?.expiry || null,
          };
        }) : [];
  
        setBills(withFavStatus);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch bills.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBills();
  }, []);
  

  const toggleFavorite = (id) => {
    const updated = bills.map((bill) => {
      if (bill.id === id) {
        const isNowFav = !bill.favorited;
        const expiry = isNowFav ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);
        return {
          ...bill,
          favorited: isNowFav,
          expiry: expiry?.toISOString() || null,
        };
      }
      return bill;
    });

    setBills(updated);

    const saveToStorage = {};
    updated.forEach((bill) => {
      if (bill.favorited || (bill.expiry && new Date(bill.expiry) > new Date())) {
        saveToStorage[bill.id] = {
          expiry: bill.expiry,
        };
      }
    });

    localStorage.setItem('favBills', JSON.stringify(saveToStorage));
  };

  const filteredBills = bills.filter((bill) => {
    const isFavValid =
      favoriteFilter === null ||
      bill.favorited === favoriteFilter;

    const isDateValid =
      (!dateFrom || new Date(bill.date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(bill.date) <= new Date(dateTo));

    // const matchesSearch = bill.institution.toLowerCase().includes(search.toLowerCase());

    // return isFavValid && isDateValid && (!typeFilter || bill.type === typeFilter) && matchesSearch;
  });

  const handleDropdownChange = (action) => {
    setSelectedAction(action);
    setIsDropdownOpen(false); 
  };

  if (loading) return <div className="p-4 text-center text-slate-600">Loading bills...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-3 w-full h-full p-4 bg-gray-50 rounded-lg shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by institution..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-teal-700 transition-all duration-300 ease-in-out outline-none hover:border-gray-400"
        />
      </div>

      {/* Header */}
      <div className="flex text-sm text-slate-400 font-medium pr-8 relative z-5">
        <ul className="flex w-full *:w-1/5 justify-between relative">
          <li className='justify-center items-center relative hidden md:flex'>
            Favorite
            <Heart
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-red-500"
              onClick={() => {
                setShowFavFilter(!showFavFilter);
                setShowTypeFilter(false);
                setShowDateFilter(false);
              }}
            />
            {showFavFilter && (
              <div className="absolute top-6 bg-white w-28 text-sm border border-gray-300 rounded-md shadow-md p-2 flex flex-col">
                <label><input type="radio" checked={favoriteFilter === null} onChange={() => setFavoriteFilter(null)} className="mr-1" />All</label>
                <label><input type="radio" checked={favoriteFilter === true} onChange={() => setFavoriteFilter(true)} className="mr-1" />Favorites</label>
                <label><input type="radio" checked={favoriteFilter === false} onChange={() => setFavoriteFilter(false)} className="mr-1" />UnFavorite</label>
              </div>
            )}
          </li>

          <li className='justify-center items-center hidden md:flex'>Invoice No.</li>

          <li className='flex justify-center items-center relative'>
            Date
            <Calendar
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
              onClick={() => {
                setShowDateFilter(!showDateFilter);
                setShowTypeFilter(false);
                setShowFavFilter(false);
              }}
            />
            {showDateFilter && (
              <div className="absolute top-6 bg-white w-60 text-slate-700 border border-gray-300 rounded-lg shadow-md p-2 flex flex-col">
                <label className="text-sm mb-2">From:</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full mb-2 bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm" />
                <label className="text-sm mb-2">To:</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm" />
              </div>
            )}
          </li>

          <li className='flex justify-center items-center relative'>
            Institution
            <Filter
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
              onClick={() => {
                setShowTypeFilter(!showTypeFilter);
                setShowDateFilter(false);
                setShowFavFilter(false);
              }}
            />
            {showTypeFilter && (
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setShowTypeFilter(false); }} className="absolute top-6 w-40 bg-white border border-gray-300 rounded-lg shadow-md p-2 text-sm">
                <option value="">All</option>
                <option value="Medical">Medical</option>
                <option value="Shop Owner">Shop Owner</option>
              </select>
            )}
          </li>

          <li className='hidden md:flex justify-center items-center'>₹Amount</li>
          <li className="flex justify-center items-center">
            <MoreVertical size={20} className="cursor-pointer md:hidden" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
            <span className='hidden md:block justify-center items-center'>Download</span>
            <div className={`absolute top-6 right-0 bg-white w-32 text-sm border ${isDropdownOpen ? 'block' : 'hidden'} md:hidden border-gray-300 rounded-md shadow-md p-2`}>
              <button onClick={() => handleDropdownChange('favorite')} className="w-full text-left p-2 hover:bg-gray-100">Favorite</button>
              <button onClick={() => handleDropdownChange('download')} className="w-full text-left p-2 hover:bg-gray-100">Download</button>
            </div>
          </li>
        </ul>
      </div>

      {/* Scrollable list */}
      <div className="flex flex-col gap-3 h-[60vh] overflow-y-scroll dialogScroll pr-2">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => (
            <div key={bill.id} className="bg-white p-2 md:p-4 rounded-xl shadow-sm flex items-center w-full">
              <ul className="flex items-center text-sm text-slate-600 w-full justify-between *:w-1/5 text-center">
                <li className='hidden md:block'>
                  <button onClick={() => toggleFavorite(bill.id)}>
                    <Heart size={20} strokeWidth={1.5} stroke="red" fill={bill.favorited ? 'red' : 'transparent'} className='transition-all duration-300 ease-in-out cursor-pointer hover:scale-110' />
                  </button>
                </li>
                <li className="font-semibold hidden md:block">{bill.invoiceNumber}</li>
                <li className='whitespace-nowrap'>
                  {new Date(bill.createdAt).toLocaleDateString()}
                </li>
                <li>{bill.institution}</li>
                <li className='hidden md:block'>₹{bill.totalAmount}</li>
                <li className="flex justify-center items-center">
                  <span className='hidden md:flex text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out'>
                          <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
                    </span>
                    {/* Show icon based on selected dropdown option */}
                    <span className='md:hidden flex justify-center items-center'>
                    {selectedAction === 'favorite' ? (
                      <Heart size={20} strokeWidth={1.5} stroke="red" fill={bill.favorited ? 'red' : 'transparent'} className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110" onClick={() => toggleFavorite(bill.id)} />
                    ) : selectedAction === 'download' ? (
                          <span className='className="text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out"'>
                          <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
                      </span>
                    ) : null}
                    </span>
                </li>
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 mt-8">No bills found.</div>
        )}
      </div>
    </div>
  );
}
