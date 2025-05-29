import { Stethoscope, Store, UsersRound } from "lucide-react";
import Link from "next/link";

export default function RolesCard() {
  const profiles = [
    {
      icon: <UsersRound size={50} strokeWidth={1.3}/>,
      name: "Customer",
      desc: "I want to buy the products",
      role: "USER",
    },
    {
      icon: <Stethoscope size={50} strokeWidth={1.3}/>,
      name: "Medical institute",
      desc: "Need a medical help",
      role: "INSTITUTION",
    },
    {
      icon: <Store size={50} strokeWidth={1.3} />,
      name: "Shop owner",
      desc: "Business with us",
      role: "SHOP_OWNER",
    },
  ];
  return (
    <>
      <div className="flex flex-col justify-around w-full h-3/4 p-3">
        {profiles.map((detail, i) => {
          return (
            <Link
              href={`/getstarted/signup?role=${detail.role}`}
              className="cursor-pointer flex bg-gray-100 gap-x-4 w-full rounded-lg shadow-md p-3 md:p-5"
              key={i}>
              <div className="flex justify-content items-center bg-white w-1/3 px-2.5 md:px-4">
                <div className="md:p-3 p-2.5 w-full h-full rounded-lg flex justify-center items-center">
                  <span className="text-gray-600">{detail.icon}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center w-2/3">
                <h1 className="text-xl md:text-2xl font-bold text-gray-600 capitalize">
                  {detail.name}
                </h1>
                <p className="text-sm text-slate-700">{detail.desc}</p>
              </div>
            </Link>
          );
        })}

        <div className="flex flex-col justify-around items-end p-2">
          <p className="text-gray-700 text-sm md:text-[16px]">
            Already existing customers?{" "}
            <Link href="/login" className="text-gray-800 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* <div className="flex flex-col justify-around p-2">
        <p className="text-gray-600 text-md">
          Already existing customers?{" "}
          <Link href="/login" className="text-gray-800 font-semibold">
            Login
          </Link>
        </p>
      </div> */}
    </>
  );
}
