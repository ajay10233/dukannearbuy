
import { Heart, Calendar, Filter, ArrowDownToLine, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import toast from 'react-hot-toast';
import LogoLoader from '../../LogoLoader';

export default function Bill() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState(null);
  const [selectedAction, setSelectedAction] = useState(''); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showFavFilter, setShowFavFilter] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { data: session } = useSession();

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
      if (!session?.user?.id) return;
      try {
        const res = await axios.get(`/api/favorite-bills?userId=${session.user.id}`);
        setFavorites(res.data); 
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    fetchFavorites();
  }, [session]);
  
  const isFavorited = (billId) => {
    return favorites.some(fav => fav.billId === billId);
  };

  const toggleFavorite = async (billId) => {
    const favorite = favorites.find(fav => fav.billId === billId);

      if (favorite) {
        // Unfavorite
        try {
          const res = await fetch(`/api/favorite-bills?favoriteBillId=${favorite.id}`, {
            method: 'DELETE',
          });

          if (res.ok) {
            setFavorites(prev => prev.filter(fav => fav.billId !== billId));
            toast.success("Removed from favorites");
          } else {
            toast.error("Failed to remove favorite");
          }
        } catch (err) {
          console.error("Error not favoriting:", err);
          toast.error("An error occurred");
        }
      } else {
        // Favorite
        try {
          const res = await fetch(`/api/favorite-bills`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              billId,
              userId: session?.user?.id,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setFavorites(prev => [...prev, data]);
            toast.success("Added to favorites");
          } else {
            toast.error("Failed to favorite");
          }
        } catch (err) {
          console.error("Error favoriting:", err);
          toast.error("An error occurred");
        }
      }
  };


  const filteredBills = bills.filter((bill) => {
  const firmName = bill.institution?.firmName || bill.institution?.firmName || '';
  const matchesSearch = firmName.toLowerCase().includes(search.toLowerCase());

  // const isDateValid =
  //   (!dateFrom || new Date(bill.createdAt) >= new Date(dateFrom)) &&
    //   (!dateTo || new Date(bill.createdAt) <= new Date(dateTo));
    // Date filter with end of day fix for dateTo
  const billDate = new Date(bill.createdAt);
  const from = dateFrom ? new Date(dateFrom) : null;
  const to = dateTo ? new Date(new Date(dateTo).setHours(23, 59, 59, 999)) : null;
  const isDateValid =
    (!from || billDate >= from) &&
    (!to || billDate <= to);


  const isRoleValid =
  roleFilter === '' ||
  (roleFilter === 'Institution' && bill.institution?.role === 'INSTITUTION') ||
  (roleFilter === 'Shop Owner' && bill.institution?.role === 'SHOP_OWNER');

  const isFavValid =
    favoriteFilter === null ||
    (favoriteFilter === true && isFavorited(bill.id)) ||
    (favoriteFilter === false && !isFavorited(bill.id));


  return matchesSearch && isDateValid && isRoleValid && isFavValid;
});


  const handleDropdownChange = (action) => {
    setSelectedAction(action);
    setIsDropdownOpen(false); 
  };

  if (loading) {
    return <LogoLoader content={"Loading bills..."} />
  }
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
        <ul className="flex w-full *:w-2/5 justify-between relative">
          <li className='justify-center items-center relative hidden md:flex'>
            Favourite
            <Heart fill='#ec0909' stroke='#ec0909'
              className="ml-1 w-4 h-4 cursor-pointer"
              onClick={() => {
                setShowFavFilter(!showFavFilter);
                setShowTypeFilter(false);
                setShowDateFilter(false);
              }}
            />
            {showFavFilter && (
              <div className="absolute top-6 bg-white w-28 text-sm border border-gray-300 rounded-md shadow-md p-2 flex flex-col cursor-pointer">
                <label><input type="radio" checked={favoriteFilter === null} onChange={() => setFavoriteFilter(null)} className="mr-1 cursor-pointer" />All</label>
                <label><input type="radio" checked={favoriteFilter === true} onChange={() => setFavoriteFilter(true)} className="mr-1 cursor-pointer" />Favourites</label>
                <label><input type="radio" checked={favoriteFilter === false} onChange={() => setFavoriteFilter(false)} className="mr-1 cursor-pointer" />Others</label>
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
              <div className="absolute top-6 left-2 bg-white w-60 text-slate-700 border border-gray-300 rounded-lg shadow-md p-2 flex flex-col">
                <label className="text-sm mb-2">From:</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full mb-2 bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm" />
                <label className="text-sm mb-2">To:</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm" />
              </div>
            )}
          </li>

          <li className='flex justify-center items-center relative whitespace-nowrap'>
            Firm Name
            <Filter
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
              onClick={() => {
                setShowTypeFilter(!showTypeFilter);
                setShowDateFilter(false);
                setShowFavFilter(false);
              }}
            />
            {/* {showTypeFilter && (
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setShowTypeFilter(false); }} className="absolute top-6 w-40 bg-white border border-gray-300 rounded-lg shadow-md p-2 text-sm">
                <option value="">All</option>
                <option value="Medical">Institition</option>
                <option value="Shop Owner">Shop Owner</option>
              </select>
            )} */}

            {showTypeFilter && (
              <div className="absolute top-6 w-40 bg-white border border-gray-300 rounded-lg shadow-md p-2 text-sm flex flex-col gap-1 z-10">
                <button className='cursor-pointer transition-all ease-in-out duration-400 hover:bg-gray-100' onClick={() => { setRoleFilter(''); setShowTypeFilter(false); }}>All</button>
                <button className='cursor-pointer transition-all ease-in-out duration-400 hover:bg-gray-100' onClick={() => { setRoleFilter('Institution'); setShowTypeFilter(false); }}>Medical Institute</button>
                <button className='cursor-pointer transition-all ease-in-out duration-400 hover:bg-gray-100' onClick={() => { setRoleFilter('Shop Owner'); setShowTypeFilter(false); }}>Shop</button>
              </div>
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
                  <button>
                  <Heart
                      size={20}
                      strokeWidth={1.5}
                      stroke="red"
                      fill={isFavorited(bill.id) ? "#ec0909" : "none"}

                      // fill={(favorites || []).some(fav => fav.billId === bill.id) ? 'red' : 'transparent'}
                      className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
                      onClick={() => toggleFavorite(bill.id)}
                    />
                  </button>
                </li>
                <li className="font-semibold hidden md:block">{bill.invoiceNumber}</li>
                <li className='whitespace-nowrap'>
                  {new Date(bill.createdAt).toLocaleDateString()}
                </li>
                <li>
                  <Link href={`/partnerProfile/${bill?.institution?.id}`}>
                  {bill.institution?.firmName}
                  </Link>
                </li>
                <li className='hidden md:block'>₹{bill?.totalAmount}</li>
                <li className="flex justify-center items-center">
                  <Link href={`download-bill/${bill.id}?institutionId=${bill.institution.id}`} className='hidden md:flex text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out'>
                      <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
                    </Link>
                    {/* Show icon based on selected dropdown option */}
                    <span className='md:hidden flex justify-center items-center'>
                    {selectedAction === 'favorite' ? (
                      <Heart size={20} strokeWidth={1.5} stroke="red" fill={isFavorited(bill.id) ? "#ec0909" : "none"}  className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110" onClick={() => toggleFavorite(bill.id)} />
                    ) : selectedAction === 'download' ? (
                          <Link href={`download-bill/${bill.id}?institutionId=${bill.institution.id}`} className='className="text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out"'>
                          <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
                      </Link>
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
