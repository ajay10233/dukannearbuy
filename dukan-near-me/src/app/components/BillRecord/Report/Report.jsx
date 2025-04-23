'use client';

import { Heart, Calendar, ArrowDownToLine } from 'lucide-react';
import { useEffect, useState } from 'react';

const dummyReports = [
  { id: 'RPT001', date: '2025-04-19', institution: 'ABC Medical Center', report: 'Annual Blood Report', type: 'Medical' },
  { id: 'RPT002', date: '2025-04-17', institution: 'XYZ Hospital', report: 'X-ray Result', type: 'Medical' },
  { id: 'RPT003', date: '2025-04-15', institution: 'Global Health Clinic', report: 'Diabetes Checkup', type: 'Medical' },
  { id: 'RPT004', date: '2025-04-12', institution: 'BrightCare Diagnostics', report: 'MRI Scan', type: 'Diagnostic' },
  { id: 'RPT005', date: '2025-04-10', institution: 'SkillMed Institute', report: 'Allergy Test', type: 'Medical' },
  { id: 'RPT006', date: '2025-04-07', institution: 'Delta Hospital', report: 'ECG Report', type: 'Cardiology' },
  { id: 'RPT007', date: '2025-04-05', institution: 'LearnFast Lab', report: 'Thyroid Panel', type: 'Lab' },
  { id: 'RPT008', date: '2025-04-03', institution: 'Sunrise Healthcare', report: 'Liver Function Test', type: 'Diagnostic' },
];

export default function Report() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState(null);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showFavFilter, setShowFavFilter] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favReports')) || {};
    const withFavStatus = dummyReports.map((r) => {
      const fav = stored[r.id];
      return {
        ...r,
        favorited: fav ? (!fav.expiry || new Date(fav.expiry) > new Date()) : false,
        expiry: fav?.expiry || null,
      };
    });
    setReports(withFavStatus);
  }, []);
  

  const toggleFavorite = (id) => {
    const updated = reports.map((report) => {
      if (report.id === id) {
        const isNowFav = !report.favorited;
        const expiry = isNowFav ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
        return {
          ...report,
          favorited: isNowFav,
          expiry: expiry?.toISOString() || null,
        };
      }
      return report;
    });
  
    setReports(updated);
  
    const saveToStorage = {};
    updated.forEach((report) => {
      if (report.expiry) {
        saveToStorage[report.id] = {
          expiry: report.expiry,
        };
      }
    });
  
    localStorage.setItem('favReports', JSON.stringify(saveToStorage));
  };  

  const filteredReports = reports.filter((report) => {
    const isFavoriteValid =
      favoriteFilter === null || report.favorited === favoriteFilter;
  
    const isDateValid =
      (!dateFrom || new Date(report.date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(report.date) <= new Date(dateTo));
  
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      report.report.toLowerCase().includes(query) ||
      report.institution.toLowerCase().includes(query);
  
    return isFavoriteValid && isDateValid && matchesSearch;
  });
  

  return (
    <div className="flex flex-col gap-3 w-full h-full p-4 bg-gray-50 rounded-lg shadow-sm">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by institution and reports..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-teal-700 transition-all duration-300 ease-in-out outline-none hover:border-gray-400"
      />

      {/* Header with Filters */}
      <div className="flex text-sm text-slate-400 font-medium pr-8 relative z-10">
        <ul className="flex w-full *:w-1/5 justify-between relative">
        <li className="flex justify-center items-center relative">
            Favorite
            <Heart
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-red-500"
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
                  Favorites
                </label>
                <label>
                  <input
                    type="radio"
                    checked={favoriteFilter === false}
                    onChange={() => setFavoriteFilter(false)}
                    className="mr-1"
                  />
                  Unfavorite
                </label>
              </div>
            )}
          </li>
          <li className="flex justify-center items-center">ID</li>

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
          <li className="flex justify-center items-center relative">Report</li>
          <li className="flex justify-center items-center relative">Download</li>

          {/* <li className="flex justify-center items-center relative">
            Favorite
            <Heart
              className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-red-500"
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
                  Favorites
                </label>
                <label>
                  <input
                    type="radio"
                    checked={favoriteFilter === false}
                    onChange={() => setFavoriteFilter(false)}
                    className="mr-1"
                  />
                  Unfavorite
                </label>
              </div>
            )}
          </li> */}
        </ul>
      </div>

      {/* Report List */}
      <div className="flex flex-col gap-3 h-[60vh] overflow-y-scroll dialogScroll pr-2">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center w-full">
              <ul className="flex items-center text-sm text-slate-600 w-full justify-between *:w-1/5 text-center">
                <li>
                  <button onClick={() => toggleFavorite(report.id)}>
                    <Heart
                      size={20}
                      strokeWidth={1.5}
                      stroke="red"
                      fill={report.favorited ? 'red' : 'transparent'}
                      className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
                    />
                  </button>
                </li>
                <li className="font-semibold">{report.id}</li>
                <li>{report.date}</li>
                <li>{report.institution}</li>
                <li>{report.report}</li>
                <li className="flex justify-center items-center">
                  <span
                    className="text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out">
                    <ArrowDownToLine size={17} strokeWidth={2.5} />
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
