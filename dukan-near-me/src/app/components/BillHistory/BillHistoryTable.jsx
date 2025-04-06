import { ArrowDownToLine, ArrowUpNarrowWide, ChevronDown, ChevronUp, Download } from "lucide-react";

export default function BillHistoryTable() {
  
  const data = [
    { invoiceId: '#10001', billingDate: "10 Jan 2025", customerName: 'Hare Krsna', amount: "₹500", status: "Pending" },
    { invoiceId: '#10002', billingDate: "15 Mar 2024", customerName: 'Hare Krsna', amount: "₹200", status: "Paid" },
    { invoiceId: '#10003', billingDate: "05 Mar 2024", customerName: 'Hare Krsna', amount: "₹800", status: "Pending" },
    { invoiceId: '#10004', billingDate: "20 Apr 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10005', billingDate: "18 Dec 2024", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10006', billingDate: "29 Nov 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Pending" },
    { invoiceId: '#10004', billingDate: "20 Apr 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10005', billingDate: "18 Dec 2024", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10006', billingDate: "29 Nov 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Pending" },
    { invoiceId: '#10004', billingDate: "20 Apr 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10005', billingDate: "18 Dec 2024", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10006', billingDate: "29 Nov 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Pending" },
  ];
  console.log(data[0]);
  const invoiceHead = Object.keys(data[0]);
  
  return (
    <div className="flex flex-col gap-y-3 cursor-default w-full overflow-hidden h-full">
      <div className="flex items-center text-sm capitalize text-slate-400 px-2" >
        <ul className="flex *:w-1/5 w-full">
        {
            invoiceHead.map((head, i) => {
              console.log(head)
              return(
              <li className="flex justify-center " key={i}>
                <span className="flex justify-center gap-x-1 cursor-pointer w-fit">
                  {head === "invoiceId" ? `Invoice Id` : head === "billingDate" ? `Billing Date` : head === "customerName" ? `Customers` : head === "amount" ? `Amount` : `Status`} 
                  <span><ArrowUpNarrowWide size={18}/></span>
                </span>
                
              </li>
              )
            })
        }
        </ul>
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-scroll dialogScroll h-full">
        {data?.map((details, i) => (
          <div className="flex items-center bg-white p-2 py-3 rounded-lg" key={i}>
            <ul className="flex items-center text-sm text-slate-500 *:w-1/3 w-full text-center"> 
              <li>{details.invoiceId}</li>
              <li>{details.billingDate}</li>
              <li>{details.customerName}</li>
              <li>{details.amount}</li>
              <li className="flex justify-center items-center relative">
                <span className={`${details.status === "Pending" ? `bg-yellow-100 text-yellow-400` : `bg-green-100 text-green-400`} rounded-full block w-1/2 py-2`}>
                  {details.status}
                </span>
                <span className="absolute right-2 text-white bg-teal-600 p-1.5 rounded-full cursor-pointer"><ArrowDownToLine size={17} strokeWidth={2.5}/></span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
