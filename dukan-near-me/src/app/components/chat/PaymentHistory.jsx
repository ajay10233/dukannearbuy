// import { ChevronDown, ChevronUp } from "lucide-react";

export default function PaymentHistory() {
  const data = [
    { amount: "₹500", status: "Pending", date: "2024-03-10" },
    { amount: "₹200", status: "Completed", date: "2024-03-15" },
    { amount: "₹800", status: "Pending", date: "2024-03-05" },
    { amount: "₹100", status: "Completed", date: "2024-03-20" },
    { amount: "₹100", status: "Conflict", date: "2024-03-20" },
    { amount: "₹100", status: "Completed", date: "2024-03-20" },
    { amount: "₹100", status: "Pending", date: "2024-03-20" },
    { amount: "₹100", status: "Conflict", date: "2024-03-20" },
  ];
  return (
    <div className="flex flex-col gap-y-3 mt-5 cursor-default">
      <div className="flex items-center *:w-1/3 text-sm capitalize text-slate-400">
        <div className="flex justify-center items-center gap-x-1">
          <h3
            className="flex justify-center items-center cursor-pointer"
          >
            Billing Date
            {/* <span>{dateSort == "asc" ? <ChevronUp /> : <ChevronDown />}</span> */}
          </h3>
        </div>
        <div className="flex justify-center items-center gap-x-1">
          <h3
            className="flex justify-center items-center cursor-pointer"
          >
            amount
            {/* <span>{amountSort == "asc" ? <ChevronUp /> : <ChevronDown />}</span> */}
          </h3>
        </div>
        <div className="flex justify-center items-center gap-x-1">
          <h3
            className="flex justify-center items-center cursor-pointer"
          >
            status
            {/* <span>{statusSort == "asc" ? <ChevronUp /> : <ChevronDown />}</span> */}
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        {data.map((details, i) => (
          <div className="flex items-center bg-white p-2 py-3 rounded-lg" key={i}>
            <ul className="flex items-center text-sm text-slate-500 *:w-1/3 w-full text-center"> 
              <li>{details.date}</li>
              <li>{details.amount}</li>
              <li className="flex justify-center"><span className={`${details.status === "Pending" ? `bg-yellow-100 text-yellow-400` : details.status === "Conflict" ? `bg-red-100 text-red-400` : `bg-green-100 text-green-400`} rounded-full block w-3/4 p-0.5`}>{details.status}</span></li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
