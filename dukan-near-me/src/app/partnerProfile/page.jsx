"use client";

import { useState, useEffect } from "react";
import {
  MessageCircleMore,
  Mail,
  Phone,
  Store,
  Hash,
  Clock,
  Clock9,
  IndianRupee,
  MapPin,
  X,
  Copy,
  Check,
  ChevronDown,
  Pencil,
  MoveLeft,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ChangeAddress from "../components/InstitutionHome/Profile/ChangeAddress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import HeroSection from "../components/InstitutionHome/Profile/HeroSection";
import HeaderLocation from "../components/Location/HeaderLocation";
import Navbar from "../components/InstitutionHome/navbar/Navbar";
import HeroSectionEditProfile from "../components/saerch-result/HeroSectionEditProfile";
import EditProfile from "../components/InstitutionHome/Profile/EditProfile";
import Image from "next/image";
import Review from "../components/InstitutionHome/Profile/Review";
import LogoLoader from "../components/LogoLoader";

export default function About({ profileUpdated }) {
  const [userData, setUserData] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showManageOptions, setShowManageOptions] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [changingAddress, setChangingAddress] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({});
  const [pastAddresses, setPastAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // const params = useSearchParams();

  const router = useRouter();
  // Add profileUpdated to useEffect dependencies
  useEffect(() => {
    fetchUserData();
    fetchPastAddresses();
    console.log("Profile Updated:", profileUpdated);
    console.log("Past Addresses is here :", pastAddresses);
  }, [profileUpdated]); // Add this dependency

  const fetchPastAddresses = async () => {
    try {
      const response = await fetch(`/api/institutions/past-address`);
      if (response.ok) {
        const data = await response.json();
        setPastAddresses(data);
      } else {
        toast.error("Error fetching past addresses.");
      }
    } catch (error) {
      toast.error("Error fetching past addresses.");
    }
  };

  // Update your fetchUserData to properly merge address data
  const fetchUserData = async () => {
    try {
      // const id = params.get("id");
      const response = await fetch(`/api/users/me`);
      // const response = await fetch("/api/users/me");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched userData:", data);

        // Merge address data properly
        setUserData({
          ...data,
          // Spread address fields to top level for easy access
          ...(data.address || {}),
          // Ensure address object exists
          address: data.address || {},
        });

        setUserData(data);

        setCurrentAddress({
          houseNo: data?.address?.houseNumber || "",
          street: data?.address?.street || "",
          city: data?.address?.city || "",
          zipcode: data?.address?.zipCode || "",
          state: data?.address?.state || "",
          country: data?.address?.country || "",
        });
      }
    } catch (error) {
      toast.error("Error fetching user data.");
    }
  };

  // const handleChat = () => {
  //   const institutionId = userData?.id;
  //   if (institutionId) {
  //     router.push(`/chat?role=institution&to=${institutionId}`);
  //   } else {
  //     toast.error("Institution ID not found");
  //   }
  // };

  const handleCopyUpi = () => {
    const upi = userData?.upi_id;
    if (upi) {
      navigator.clipboard.writeText(upi);
      setCopiedUPI(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopiedUPI(false), 2000);
    }
  };

  const handleCopyEmail = () => {
    const email = userData?.email;
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied!");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleAddressChange = (newAddress, previousAddress) => {
    setCurrentAddress(newAddress);
    setPastAddresses((prev) => [...prev, previousAddress]);
    toast.success("Address changed successfully!");
    setChangingAddress(false);
  };

  useEffect(() => {
  const loadAllData = async () => {
    setLoading(true);
    await fetchUserData();
    await fetchPastAddresses();
    setLoading(false);
  };

  loadAllData();
}, [profileUpdated]);


  return (
    <div className="flex flex-col items-start w-full bg-white overflow-x-hidden">
          {loading ? (
            <LogoLoader content={"Fetching profile..."}  />
          ) : (
            <>
              <Navbar />
              <div className="mt-14 w-full">
                <div className="px-4 py-2">
                  <Link href="/partnerHome"
                    className="flex items-center gap-2 text-blue-600 rounded-md transition ease-in-out duration-400 hover:text-blue-700">
                      <MoveLeft size={20} strokeWidth={1.5} /> Back
                  </Link>
                </div>
                  <HeroSectionEditProfile />
                </div>

                <div className="flex w-full p-2 md:px-8 md:py-2 justify-between items-start">
                  <div className="flex flex-col gap-1 ">
                    <div className="pl-2 md:pl-8 flex flex-col gap-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push("/institution-edit-profile")}
                        className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium transition ease-in-out duration-400"
                      >
                        <Pencil size={16} className="mr-1" />
                        Edit Profile
                      </button>
                    </div>
                      <p className="text-md text-gray-500">
                        User ID: {userData?.username}
                      </p>

                      {profileUpdated && (
                        <>
                          <div className="flex items-start gap-x-2">
                            <span className="font-semibold flex items-center gap-x-1">
                              <Phone size={20} strokeWidth={1.5} color="#1751c4" />
                            </span>
                            {userData?.mobileNumber ? (
                              <a
                                href={`tel:${userData.mobileNumber}`}
                                className="hover:text-gray-600 transition ease-in-out duration-400 hover:not-first:underline"
                              >
                                {userData.mobileNumber}
                              </a>
                            ) : (
                              <span>N/A</span>
                            )}
                          </div>
                          <div className="text-md text-gray-700 flex items-center gap-2">
                            <Mail size={20} strokeWidth={1.5} color="#1751c4" />
                            <span className="hover:text-gray-600 flex gap-x-1.5 transition ease-in-out duration-400">
                              {userData?.contactEmail || "N/A"}
                              <button onClick={handleCopyEmail} title="Copy Email">
                                {copiedEmail ? (
                                  <Check
                                    className="text-green-600 cursor-pointer"
                                    size={14}
                                  />
                                ) : (
                                  <Copy
                                    size={14}
                                    className="text-gray-500 cursor-pointer hover:text-blue-600"
                                  />
                                )}
                              </button>
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {userData?.id && (
                      <Link
                        href={`/tokenupdate/${userData.id}`}
                        className="text-blue-600 cursor-po hover:text-blue-800 transition font-medium pl-2 md:pl-8"
                      >
                        View Live Token
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setShowManageOptions(true)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium transition"
                    >
                      Manage Address
                    </button>
                  </div>
                </div>

                {profileUpdated && (
                  <div className="w-full px-0 md:px-8 flex flex-col gap-y-8">
                    <div className="flex flex-col gap-y-2 md:gap-y-3 text-sm md:text-md text-gray-700 border-t pl-2 md:pl-8 pt-4">
                      <div className="flex items-start gap-x-2">
                        <span className="font-semibold flex items-center gap-x-1">
                          <Store size={20} strokeWidth={1.5} color="#1751c4" />
                          Address:
                        </span>
                        <div className="text-base text-gray-800 pb-1 hover:text-gray-600 transition ease-in-out">
                          {userData?.houseNo && <span>{userData.houseNo}, </span>}
                          {userData?.street && <span>{userData.street}, </span>}
                          {userData?.city && <span>{userData.city}, </span>}
                          {userData?.zipcode && <span>{userData.zipcode}, </span>}
                          {userData?.state && <span>{userData.state}, </span>}
                          {userData?.country && <span>{userData.country}</span>}
                          {!userData?.houseNo &&
                            !userData?.street &&
                            !userData?.city &&
                            !userData?.zipcode &&
                            !userData?.state &&
                            !userData?.country && (
                              <span className="text-gray-500">Not provided</span>
                            )}
                        </div>
                      </div>

                      {/* past addresses */}
                      <div className="flex flex-col w-full  pr-4 py-4 md:px-8 md:py-4">
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full p-0 md:p-4"
                        >
                          <AccordionItem
                            value="past-addresses"
                            className="rounded-md overflow-hidden w-full"
                          >
                            <AccordionTrigger className="bg-white px-4 py-3 text-sm cursor-pointer hover:no-underline text-blue-700 font-semibold hover:bg-gray-100 rounded-t-md flex justify-between items-center">
                              <span>Past Addresses</span>
                              {/* <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" /> */}
                            </AccordionTrigger>
                            <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md border-t border-blue-200">
                              {pastAddresses?.length === 0 ? (
                                <p className="text-gray-500">No past addresses found.</p>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {pastAddresses?.map((addr, i) => (
                                    <div
                                      key={addr.id || i}
                                      className="p-3 bg-white rounded-md shadow-sm border border-blue-200 transition-all hover:shadow-md"
                                    >
                                      <p className="font-semibold text-blue-700">
                                        #{i + 1} (Moved out:{" "}
                                        {new Date(addr.movedOutAt).toLocaleDateString()})
                                      </p>
                                      <p className="text-gray-700 mt-1">
                                        {[
                                          addr.buildingName,
                                          addr.street,
                                          addr.city,
                                          addr.state,
                                        ]
                                          .filter(Boolean)
                                          .join(", ")}
                                        , {addr.zipCode}
                                      </p>
                                      <p className="text-gray-600">{addr.country}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      <div className="flex items-start gap-x-2">
                        <span className="font-semibold flex items-center gap-x-1">
                          <Hash size={20} strokeWidth={1.5} color="#1751c4" />
                          Hashtags:
                        </span>
                        {userData?.hashtags?.length > 0 ? (
                          userData.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-block px-1.5 md:px-3 py-1 lowercase text-sm bg-gradient-to-tl from-blue-300 via-blue-500 to-blue-600 text-white rounded-2xl"
                            >
                              #{tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="inline-block px-3 py-1 text-sm bg-gradient-to-tl from-blue-300 via-blue-500 to-blue-600 text-white rounded-2xl">
                            None
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-x-2">
                        <span className="font-semibold flex items-center gap-x-1">
                          <Clock size={20} strokeWidth={1.5} color="#1751c4" />
                          Open Time:
                        </span>
                        <span className="hover:text-gray-600 transition ease-in-out">
                          {userData?.shopOpenTime || "Not Set"}
                        </span>
                      </div>

                      <div className="flex items-start gap-x-2">
                        <span className="font-semibold flex items-center gap-x-1">
                          <Clock9 size={20} strokeWidth={1.5} color="#1751c4" />
                          Close Time:
                        </span>
                        <span className="hover:text-gray-600 transition ease-in-out">
                          {userData?.shopCloseTime || "Not Set"}
                        </span>
                      </div>

                      <div className="flex items-start gap-x-2">
                        <span className="font-semibold flex items-center gap-x-1">
                          <MapPin size={20} strokeWidth={1.5} color="#1751c4" />
                          Direction: 
                        </span>
                        {userData?.latitude && userData?.longitude ? (
                          <Link
                            href={`https://www.google.com/maps?q=${userData.latitude},${userData.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 flex items-center gap-x-1 cursor-pointer hover:text-blue-500 transition ease-in-out"
                          >
                            View on Map
                          </Link>
                        ) : (
                          "Location not set"
                        )}
                      </div>
                  
                    </div>
                  </div>
                )}

                <div className="py-4 px-6 md:p-8 bg-white w-full">
                  <div className="space-y-3 items-center justify-center w-full ml-0 md:ml-[32px]">
                    {/* PROFILE INFO */}
                    <div>
                      <h2 className="text-[16px] md:text-xl font-bold text-blue-700 mb-4">
                        Profile Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 ml-4 text-sm text-gray-700">
                        {userData?.firstName && (
                          <div>
                            <p className="font-semibold text-gray-600">First Name</p>
                            <p>{userData.firstName}</p>
                          </div>
                        )}
                        {userData?.lastName && (
                          <div>
                            <p className="font-semibold text-gray-600">Last Name</p>
                            <p>{userData.lastName}</p>
                          </div>
                        )}
                        {userData?.username && (
                          <div>
                            <p className="font-semibold text-gray-600">Username</p>
                            <p>{userData.username}</p>
                          </div>
                        )}
                        {userData?.mobileNumber && (
                          <div>
                            <p className="font-semibold text-gray-600">Mobile Number</p>
                            <p>{userData.mobileNumber}</p>
                          </div>
                        )}
                        {userData?.email && (
                          <div>
                            <p className="font-semibold text-gray-600">Email</p>
                            <p>{userData.email}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="w-full">
                      <div className="mb-4">
                        <h2 className="text-[16px] md:text-xl font-bold text-blue-700 mb-4">Address</h2>
                        <div className="flex flex-col w-full gap-2 md:gap-4 ml-4">
                            {userData?.address ? (
                            <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm text-gray-700">
                              {userData.address.houseNumber && (
                                <div>
                                  <p className="font-semibold text-gray-600">{userData.role === "INSTITUTION" ? "Building Number" : "Shop Number"}</p>
                                  <p>{userData.address.houseNumber}</p>
                                </div>
                              )}
                              {userData.address.street && (
                                <div>
                                  <p className="font-semibold text-gray-600">Street</p>
                                  <p>{userData.address.street}</p>
                                </div>
                              )}
                              {userData.address.buildingName && (
                                <div>
                                  <p className="font-semibold text-gray-600">Building Name</p>
                                  <p>{userData.address.buildingName}</p>
                                </div>
                              )}
                              {userData.address.landmark && (
                                <div>
                                  <p className="font-semibold text-gray-600">Landmark</p>
                                  <p>{userData.address.landmark}</p>
                                </div>
                              )}
                              {userData.address.city && (
                                <div>
                                  <p className="font-semibold text-gray-600">City</p>
                                  <p>{userData.address.city}</p>
                                </div>
                              )}
                              {userData.address.state && (
                                <div>
                                  <p className="font-semibold text-gray-600">State</p>
                                  <p>{userData.address.state}</p>
                                </div>
                              )}
                              {userData.address.country && (
                                <div>
                                  <p className="font-semibold text-gray-600">Country</p>
                                  <p>{userData.address.country}</p>
                                </div>
                              )}
                              {userData.address.zipCode && (
                                <div>
                                  <p className="font-semibold text-gray-600">Zip Code</p>
                                  <p>{userData.address.zipCode}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic text-sm">
                              Address not provided
                            </p>
                          )}
                        </div>
                        
                      </div>
                      <div className="flex flex-col w-full ">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem
                              value="past-addresses"
                              className="rounded-md overflow-hidden mr-8"
                            >
                              <AccordionTrigger className="bg-white px-4 py-3 text-sm md:text-[16px] cursor-pointer hover:no-underline text-blue-700 font-semibold hover:bg-gray-100 rounded-t-md flex justify-between items-center">
                                <span>Past Addresses</span>
                              </AccordionTrigger>
                              <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md border-t border-blue-200">
                                {pastAddresses.length === 0 ? (
                                  <p className="text-gray-500">
                                    No past addresses found.
                                  </p>
                                ) : (
                                  <div className="flex flex-col gap-3">
                                    {pastAddresses.map((addr, i) => (
                                      <div
                                        key={addr.id}
                                        className="p-3 bg-white rounded-md shadow-sm border border-blue-200 transition-all hover:shadow-md"
                                      >
                                        <p className="font-semibold text-blue-700">
                                          #{i + 1} (Moved out:{" "}
                                          {new Date(addr.movedOutAt).toLocaleDateString()}
                                          )
                                        </p>
                                        <p className="text-gray-700 mt-1">
                                          {[
                                            addr.buildingName,
                                            addr.street,
                                            addr.city,
                                            addr.state,
                                          ]
                                            .filter(Boolean)
                                            .join(", ")}
                                          , {addr.zipCode}
                                        </p>
                                        <p className="text-gray-600">{addr.country}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                      {/* {userData?.address ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                          {userData.address.houseNumber && (
                            <div>
                              <p className="font-semibold text-gray-600">House Number</p>
                              <p>{userData.address.houseNumber}</p>
                            </div>
                          )}
                          {userData.address.street && (
                            <div>
                              <p className="font-semibold text-gray-600">Street</p>
                              <p>{userData.address.street}</p>
                            </div>
                          )}
                          {userData.address.buildingName && (
                            <div>
                              <p className="font-semibold text-gray-600">Building Name</p>
                              <p>{userData.address.buildingName}</p>
                            </div>
                          )}
                          {userData.address.landmark && (
                            <div>
                              <p className="font-semibold text-gray-600">Landmark</p>
                              <p>{userData.address.landmark}</p>
                            </div>
                          )}
                          {userData.address.city && (
                            <div>
                              <p className="font-semibold text-gray-600">City</p>
                              <p>{userData.address.city}</p>
                            </div>
                          )}
                          {userData.address.state && (
                            <div>
                              <p className="font-semibold text-gray-600">State</p>
                              <p>{userData.address.state}</p>
                            </div>
                          )}
                          {userData.address.country && (
                            <div>
                              <p className="font-semibold text-gray-600">Country</p>
                              <p>{userData.address.country}</p>
                            </div>
                          )}
                          {userData.address.zipCode && (
                            <div>
                              <p className="font-semibold text-gray-600">Zip Code</p>
                              <p>{userData.address.zipCode}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-sm">
                          Address not provided
                        </p>
                      )} */}
                    </div>

                    {/* SHOP INFORMATION */}
                    {(userData?.firmName || userData?.shopAddress) && (
                      <div>
                        <h2 className="text-[16px] md:text-xl font-bold text-blue-700 ">
                          {userData?.role === "INSTITUTION" ? "Medical Institute Information" : "Shop Information"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-gray-700 ml-4">
                          {userData.shopAddress && (
                            <div>
                              <p className="font-semibold text-gray-600">
                                {userData?.role === "INSTITUTION" ? "Address" : "Shop Address"}
                              </p>
                              <p>{userData.shopAddress}</p>
                            </div>
                          )}
                          {userData.contactEmail && (
                            <div>
                              <p className="font-semibold text-gray-600">Contact Email</p>
                              <p>{userData.contactEmail}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SHOP TIMINGS */}
                    {(userData?.shopOpenTime ||
                      userData?.shopCloseTime ||
                      userData?.shopOpenDays?.length > 0) && (
                      <div>
                        <h2 className="text-[16px] md:text-xl  font-bold text-blue-700 mb-4">
                          {userData?.role === "INSTITUTION" ? "Medical Institute Timings" : "Shop Timings"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-gray-700 ml-4">
                          {userData.shopOpenTime && (
                            <div>
                              <p className="font-semibold text-gray-600">Open Time</p>
                              <p>{userData.shopOpenTime}</p>
                            </div>
                          )}
                          {userData.shopCloseTime && (
                            <div>
                              <p className="font-semibold text-gray-600">Close Time</p>
                              <p>{userData.shopCloseTime}</p>
                            </div>
                          )}
                          {userData.shopOpenDays?.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-600">Open Days</p>
                              <p>{userData.shopOpenDays.join(", ")}</p>
                            </div>
                          )}
                        </div>
                      </div>
                  )}
                
                      <div className="flex items-start gap-x-2">
                        <span className="font-semibold flex items-center gap-x-1">
                          <MapPin size={20} strokeWidth={1.5} color="#1751c4" />
                          Direction: 
                        </span>
                        {userData?.latitude && userData?.longitude ? (
                          <Link
                            href={`https://www.google.com/maps?q=${userData.latitude},${userData.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 flex items-center gap-x-1 cursor-pointer hover:text-blue-500 transition ease-in-out"
                          >
                            View on Map
                          </Link>
                        ) : (
                          "Location not set"
                        )}
                      </div>

                    {/* PAYMENT DETAILS */}
                    {userData?.upi_id && (
                      <div className="grid grid-cols-2 gap-2 md:gap-4 items-center w-full max-w-md">
                        {/* Column 1 */}
                        {/* <div>
                          <h2 className="text-sm md:text-base font-bold text-blue-700">
                            Payment Details
                          </h2>
                        </div> */}

                        {/* Column 2 – button only */}
                        <div className="col-span-2 sm:col-span-1 flex justify-start">
                          <button
                            onClick={() => setShowQRModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r cursor-pointer from-green-400 via-emerald-500 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-md shadow-md transition-all duration-300 ease-in-out"
                          >
                            <IndianRupee size={18} className="transition-transform group-hover:translate-x-1" />
                            <span className="font-medium">Pay Now</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* HASHTAGS */}
                    {userData?.hashtags?.length > 0 && (
                      <div>
                        <h2 className="text-[16px] md:text-xl font-bold text-blue-700 mb-4">Hashtags</h2>
                        <div className="flex flex-wrap gap-2 ml-4">
                          {userData.hashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 lowercase px-3 py-1 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ABOUT */}
                    {userData?.description && (
                      <div className="mr-4 md:mr-[32px]">
                        <h2 className="text-[16px] md:text-xl font-bold text-blue-700 mb-4">About</h2>
                        <p className="ml-2 text-sm text-gray-700 sm:max-w-4xl md:max-w-6xl lg:w-full lg:max-w-7xl bg-gradient-to-br from-blue-50 via-white to-blue-100  h-45 bg-white border border-gray-200 shadow-sm rounded-xl p-4 overflow-auto leading-relaxed whitespace-pre-line">{userData.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Review />
              
                {showQRModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg h-100 md:h-125 w-75 md:w-95 relative">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => setShowQRModal(false)}
                      >
                        <X size={20} strokeWidth={1.5} />
                      </button>
                      <h2 className="text-xl font-semibold text-center text-blue-700 mb-0 md:mb-4">
                        Scan QR Code
                      </h2>
                      <div className="p-4 relative">
                        <Image
                          src={userData?.scanner_image}
                          alt="QR Code" height={280} width={280}
                          className="w-70 h-70 mx-auto object-contain" priority
                        />
                      </div>
                      <p className="pt-2 md:pt-4 flex items-center justify-center gap-2 text-center text-gray-600">
                        <span className="text-gray-800 text-sm font-medium">
                          UPI ID: <span className="font-normal">{userData?.upi_id}</span>
                        </span>
                        <button onClick={handleCopyUpi} title="Copy UPI ID" className="cursor-pointer transition-all duration-300 ease-in-out">
                          {copiedUPI ? (
                            <Check className="text-green-600" size={18} />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {showManageOptions && (
                  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className="flex flex-col gap-y-4 bg-white rounded-lg shadow-lg w-82 h-32 md:w-100 md:h-40 p-4 whitespace-nowrap">
                      <div className="flex justify-between items-center border-b pb-2 mb-0 md:mb-4">
                        <h2 className="text-lg font-semibold text-blue-700">
                          Manage Address
                        </h2>
                        <button onClick={() => setShowManageOptions(false)}>
                          <X
                            size={20}
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                          />
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setChangingAddress(true);
                            setShowManageOptions(false);
                          }}
                          className="bg-blue-600 transition-all duration-500 ease-in-out hover:bg-blue-700 cursor-pointer text-white px-7 py-2 rounded"
                        >
                          Change Address
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {changingAddress && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="flex flex-col bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-6 overflow-y-auto max-h-[90vh] dialogScroll">
                      <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-2xl font-bold text-blue-700">
                          Change Address
                        </h2>
                        <button onClick={() => setChangingAddress(false)}>
                          <X
                            size={20}
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                          />
                        </button>
                      </div>
                      {changingAddress && (
                        <ChangeAddress
                          currentAddress={currentAddress}
                          onSave={handleAddressChange}
                        />
                      )}
                    </div>
                  </div>
                )}
            </>
    )}
    </div>
  );
}
