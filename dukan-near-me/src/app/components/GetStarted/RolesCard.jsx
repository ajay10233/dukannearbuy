import { Activity, Store, UsersRound } from "lucide-react";
import Link from "next/link";

export default function RolesCard() {
  const profiles = [
    {
      icon: <UsersRound size={50} strokeWidth={1.3} color="#92613a" />,
      name: "Customers",
      desc: "I want to buy the products",
      role: "USER",
    },
    {
      icon: <Activity size={50} strokeWidth={1.3} color="#92613a" />,
      name: "Medical institutes",
      desc: "Need a medical help",
      role: "INSTITUTION",
    },
    {
      icon: <Store size={50} strokeWidth={1.3} color="#92613a" />,
      name: "Shop owner",
      desc: "Business with us",
      role: "SHOP_OWNER",
    },
  ];
  return (
    <div className="flex flex-col justify-around w-full h-3/4 p-3">
      {profiles.map((detail, i) => {
        return (
          <Link
            href={`/getstarted/signup?role=${detail.role}`}
            className="cursor-pointer flex bg-[var(--secondary-color)] w-full rounded-lg shadow-md p-5"
            key={i}
          >
            <div className="flex justify-content items-center w-1/3 px-4">
              <div className="p-3 w-full h-full bg-[var(--background)] rounded-lg flex justify-center items-center">
                <span>{detail.icon}</span>
              </div>
            </div>
            <div className="flex flex-col justify-center w-2/3">
              <h1 className="text-2xl font-bold text-[var(--specialtext)] capitalize">
                {detail.name}
              </h1>
              <p className="text-slate-700">{detail.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
