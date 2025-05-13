'use client';

import { Heart, Calendar, ArrowDownToLine, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Report() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showFavFilter, setShowFavFilter] = useState(false);
  const [selectedAction, setSelectedAction] = useState(''); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/users/reports');
        const json = await response.json(); 
        const data = json.reports; 
        console.log("Fetched Reports:", data);
 
        setReports(data);  
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);  

  const toggleFavorite = async (billId, isCurrentlyFav) => {
    try {
      const method = isCurrentlyFav ? 'DELETE' : 'POST';
  
      const res = await fetch('/api/favorite-bills', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ billId }),
        body: JSON.stringify({
        billId,
        userId: session?.user?.id, 
      }),
      });
  
      if (res.ok) {
        setFavorites((prev) => {
          if (method === 'POST') {
            return [...prev, { billId }];
          } else {
            return prev.filter(item => item.billId !== billId);
          }
        });
      } else {
        console.error("Toggle failed");
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  // const toggleFavorite = (id) => {
  //   const updated = reports.map((report) => {
  //     if (report.id === id) {
  //       const isNowFav = !report.favorited;
  //       const expiry = isNowFav ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
  //       return {
  //         ...report,
  //         favorited: isNowFav,
  //         expiry: expiry?.toISOString() || null,
  //       };
  //     }
  //     return report;
  //   });
  
  //   setReports(updated);
  
  //   const saveToStorage = {};
  //   updated.forEach((report) => {
  //     if (report.expiry) {
  //       saveToStorage[report.id] = {
  //         expiry: report.expiry,
  //       };
  //     }
  //   });
  
  //   localStorage.setItem('favReports', JSON.stringify(saveToStorage));
  // };  

const filteredReports = reports.filter((report) => {
  const isFavorite = favoriteFilter === null || 
    (favoriteFilter === true && favorites.some(fav => fav.billId === report.id)) ||
    (favoriteFilter === false && !favorites.some(fav => fav.billId === report.id));

  const isDateValid =
  (!dateFrom || new Date(report.createdAt) >= new Date(dateFrom)) &&
  (!dateTo || new Date(report.createdAt) <= new Date(dateTo));

  const query = searchTerm.toLowerCase();
  const matchesSearch =
    report.report?.toLowerCase().includes(query) ||
    report.institution?.firmName?.toLowerCase().includes(query);

  return isFavorite && isDateValid && matchesSearch;
});

  const handleDropdownChange = (action) => {
    setSelectedAction(action);
    setIsDropdownOpen(false); 
  };

  if (loading) return <div className="p-4 text-center text-slate-600">Loading reports...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;


  return (
    <div className="flex flex-col gap-3 w-full h-full p-2 md:p-4 bg-gray-50 rounded-lg shadow-sm">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by institution..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-teal-700 transition-all duration-300 ease-in-out outline-none hover:border-gray-400"
      />

      {/* Header with Filters */}
      <div className="flex text-sm text-slate-400 font-medium pr-8 relative z-10">
        <ul className="flex w-full *:w-1/5 justify-between relative">
        <li className="hidden md:flex justify-center items-center relative">
            Favourite
            <Heart fill='#ec0909' stroke='#ec0909'
              className="ml-1 w-4 h-4 cursor-pointer"
              onClick={() => {
                setShowFavFilter(!showFavFilter);
                setShowDateFilter(false);
              }}
            />
            {showFavFilter && (
              <div className="absolute top-6 bg-white w-28 text-sm border border-gray-300 rounded-md shadow-md p-2 flex flex-col">
                <label>
                  <input
                    type="radio"
                    checked={favoriteFilter === null}
                    onChange={() => setFavoriteFilter(null)}
                    className="mr-1"
                  />
                  All
                </label>
                <label>
                  <input
                    type="radio"
                    checked={favoriteFilter === true}
                    onChange={() => setFavoriteFilter(true)}
                    className="mr-1"
                  />
                  Favourites
                </label>
                <label>
                  <input
                    type="radio"
                    checked={favoriteFilter === false}
                    onChange={() => setFavoriteFilter(false)}
                    className="mr-1"
                  />
                  Others
                </label>
              </div>
            )}
          </li>
          <li className="hidden md:flex justify-center items-center">ID</li>

          <li className="flex justify-center items-center relative">
            Date
            <Calendar
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
              onClick={() => {
                setShowDateFilter(!showDateFilter);
                setShowFavFilter(false);
              }}
            />
            {showDateFilter && (
              <div className="absolute top-6 bg-white w-60 text-slate-700 border border-gray-300 rounded-lg shadow-md p-2 flex flex-col">
                <label className="text-sm mb-2">From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full mb-2 bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm"
                />
                <label className="text-sm mb-2">To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-white border text-slate-700 border-gray-300 rounded-lg shadow-md p-2 text-sm"
                />
              </div>
            )}
          </li>

          <li className="flex justify-center items-center relative">Institution</li>
          {/* <li className="flex justify-center items-center relative">Report</li> */}
          <li className="flex justify-center items-center">
            {/* MoreVertical icon shown on small screen */}
            <MoreVertical
              size={20}
              className="cursor-pointer md:hidden"
              // onClick={() => handleDropdownChange(selectedAction === 'favorite' ? 'download' : 'favorite')}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            
            {/* Download icon shown on large screen */}
            <span className='hidden md:block justify-center items-center'>Download</span>
            
            {/* Dropdown for selecting action */}
            <div className={`absolute top-6 right-0 bg-white w-32 text-sm border ${isDropdownOpen ? 'block' : 'hidden'} md:hidden border-gray-300 rounded-md shadow-md p-2`}>
              <button
                onClick={() => handleDropdownChange('favorite')}
                className="w-full text-left p-2 hover:bg-gray-100">
                Favorite
              </button>
              <button
                onClick={() => handleDropdownChange('download')}
                className="w-full text-left p-2 hover:bg-gray-100">
                Download
              </button>
            </div>
          </li>
        </ul>
      </div>

      {/* Report List */}
      <div className="flex flex-col gap-3 h-[60vh] overflow-y-scroll dialogScroll pr-0 md:pr-2">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, idx) => (
            <div key={report.id} className="bg-white md-2 p-2 md:p-4 rounded-xl shadow-sm flex items-center w-full">
              <ul className="flex items-center text-sm text-slate-600 w-full justify-between *:w-1/5 text-center">
                <li className='hidden md:block'>
                  <button onClick={() => toggleFavorite(report.id, favorites.some(fav => fav.billId === report.id))}>
                    <Heart
                      size={20}
                      strokeWidth={1.5}
                      stroke="red"
                      fill={favorites.some(fav => fav.billId === report.id) ? 'red' : 'transparent'}
                      className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
                    />
                  </button>
                </li>
                <li className="font-semibold hidden md:block">{report.invoiceNumber}</li>
                <li>{new Date(report.createdAt).toLocaleDateString()}</li>
                <li>
                  <Link href={`/partnerProfile/${report?.institution?.id}`}>
                    {report?.institution?.firmName}
                  </Link>
                </li>  {/* //institution name? , report name*/}
                {/* <li>{report.report}</li>    */}
                <li className="flex justify-center items-center">
                  <span className='hidden md:flex text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out'>
                        <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
                  </span>
                  {/* Show icon based on selected dropdown option */}
                  <span className='md:hidden flex justify-center items-center'>
                  {selectedAction === 'favorite' ? (
                    <Heart size={20} strokeWidth={1.5} stroke="red"  fill={favorites.some(fav => fav.billId === report.id) ? 'red' : 'transparent'} className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110" onClick={() => toggleFavorite(report.id, favorites.some(fav => fav.billId === bill.id))} />
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
          <p className="text-center text-gray-500">No reports found.</p>
        )}
      </div>
    </div>
  );
}
