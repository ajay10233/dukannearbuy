
import { Heart, Calendar, Filter, ArrowDownToLine, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";

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
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/billRecord');
        const data = response.data.bills;
        console.log(response.data);
  
        setBills(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch bills.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBills();
  }, []);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
        
        if (res.ok) {
          setFavorites(data);
        } else {
          setError('Failed to fetch favorites');
        }
      } catch (err) {
        setError('An error occurred while fetching favorites');
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (billId) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billId }),
      });
    
      if (res.ok) {
        setFavorites((prev) => Array.isArray(prev) ? prev.filter(item => item.billId !== billId) : []);
        console.log("Favorite removed:", billId);
      }
    } catch (error) {
        console.error("Error removing favorite:", error);
      }
  }
  

  // const toggleFavorite = (id) => {
  //   const updated = bills.map((bill) => {
  //     if (bill.id === id) {
  //       const isNowFav = !bill.favorited;
  //       const expiry = isNowFav ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);
  //       return {
  //         ...bill,
  //         favorited: isNowFav,
  //         expiry: expiry?.toISOString() || null,
  //       };
  //     }
  //     return bill;
  //   });

  //   setBills(updated);

  //   const saveToStorage = {};
  //   updated.forEach((bill) => {
  //     if (bill.favorited || (bill.expiry && new Date(bill.expiry) > new Date())) {
  //       saveToStorage[bill.id] = {
  //         expiry: bill.expiry,
  //       };
  //     }
  //   });

  //   localStorage.setItem('favBills', JSON.stringify(saveToStorage));
  // };

  // const filteredBills = bills.filter((bill) => {
  //   const isFavValid =
  //     favoriteFilter === null ||
  //     bill.favorited === favoriteFilter;

  //   const isDateValid =
  //     (!dateFrom || new Date(bill.date) >= new Date(dateFrom)) &&
  //     (!dateTo || new Date(bill.date) <= new Date(dateTo));

  //   const matchesSearch = bill.institution.toLowerCase().includes(search.toLowerCase());

  //   return isFavValid && isDateValid && (!typeFilter || bill.type === typeFilter) && matchesSearch;
  // });

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
        {bills.length > 0 ? (
          bills.map((bill) => (
            <div key={bill.id} className="bg-white p-2 md:p-4 rounded-xl shadow-sm flex items-center w-full">
              <ul className="flex items-center text-sm text-slate-600 w-full justify-between *:w-1/5 text-center">
                <li className='hidden md:block'>
                  <button onClick={() => removeFromFavorites(bill.id)}>
                  <Heart
                      size={20}
                      strokeWidth={1.5}
                      stroke="red"
                      fill={bill.favorited ? 'red' : 'transparent'}
                      className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
                      // onClick={() => removeFromFavorites(bill.id)}
                    />
                  </button>
                </li>
                <li className="font-semibold hidden md:block">{bill.invoiceNumber}</li>
                <li className='whitespace-nowrap'>
                  {new Date(bill.createdAt).toLocaleDateString()}
                </li>
                <li>{bill.institution?.firmName}</li>
                <li className='hidden md:block'>₹{bill.totalAmount}</li>
                <li className="flex justify-center items-center">
                  <span className='hidden md:flex text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out'>
                          <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
                    </span>
                    {/* Show icon based on selected dropdown option */}
                    <span className='md:hidden flex justify-center items-center'>
                    {selectedAction === 'favorite' ? (
                      <Heart size={20} strokeWidth={1.5} stroke="red" fill={bill.favorited ? 'red' : 'transparent'}                      className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110" onClick={() => removeFromFavorites(bill.id)} />
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
