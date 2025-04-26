  "use client";

  import React, { useState } from "react";
  import { X, MapPin } from "lucide-react";
  import toast from "react-hot-toast";

  export default function EditProfile({ setShowModal, errors, handleChange, handleSubmit, form, setForm, setProfileUpdated, message, setMessage }) {
    const handleLocationFetch = () => {
      if (!navigator.geolocation) {
        toast.error("Geolocation not supported");
        return;
      }
    
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
    
          try {
            // Fetch address from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
    
            const address = data.display_name || `Lat: ${latitude}, Long: ${longitude}`;
    
            setForm((prev) => ({
              ...prev,
              latitude,
              longitude,
              currentLocation: address,
            }));
    
            toast.success("Location fetched successfully");
          } catch (err) {
            toast.error("Failed to fetch address");
          }
        },
        () => toast.error("Location access denied")
      );
    };
    
    
    // const [message, setMessage] = useState('');
    
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    
    const handleDayToggle = (e) => {
      const selectedDay = e.target.value;
      const isChecked = e.target.checked;
    
      setForm((prev) => {
        const updatedDays = isChecked
          ? [...(prev.shopOpenDays || []), selectedDay]
          : prev.shopOpenDays.filter((day) => day !== selectedDay);
    
        return {
          ...prev,
          shopOpenDays: updatedDays.sort(
            (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
          ),
        };
      });
    };

    // const handlePastAddressChange = (e) => {
    //   const { value } = e.target;
    //   setForm((prev) => ({
    //     ...prev,
    //     pastShopAddress: value,
    //   }));
    // };

    // const handlePastAddressFromChange = (e) => {
    //   const { value } = e.target;
    //   setForm((prev) => ({
    //     ...prev,
    //     pastShopAddressFrom: value,
    //   }));
    // };

    // const handlePastAddressToChange = (e) => {
    //   const { value } = e.target;
    //   setForm((prev) => ({
    //     ...prev,
    //     pastShopAddressTo: value,
    //   }));
    // };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white p-6 rounded-lg w-[95%] max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Profile Details</h2>
            <button onClick={() => setShowModal(false)}>
              <X className="text-gray-600 hover:text-red-600 cursor-pointer" />
            </button>
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            
            {/* Firm Name */}
            <div>
              <label className="font-medium text-gray-700">Firm Name</label>
              <input
                type="text"
                name="firmName"
                value={form?.firmName}
                onChange={handleChange}
                placeholder="Enter Firm Name"
                className="border p-2 rounded w-full"
                required
              />
              {errors?.firmName && <span className="text-sm text-red-500">{errors.firmName}</span>}
            </div>

            {/* contact email */}
            <div>
              <label className="font-medium text-gray-700"> Email</label>
              <input
                type="email"
                name="contactEmail"
                value={form?.contactEmail}
                onChange={handleChange}
                placeholder="Type your Email"
                className="border p-2 rounded w-full"
                required
              />
              {errors?.contactEmail && <span className="text-sm text-red-500">{errors.contactEmail}</span>}
            </div>

            {/* contact number */}
            <div>
              <label className="font-medium text-gray-700">Contact Number</label>
              <input
                type="number"
                name="mobileNumber"
                value={form?.mobileNumber}
                onChange={handleChange}
                placeholder="Enter Contact number"
                className="border p-2 rounded w-full"
                required
              />
              {errors?.mobileNumber && <span className="text-sm text-red-500">{errors.mobileNumber}</span>}
            </div>

            <div>
              <label className="font-medium text-gray-700"> User Id:</label>
              <input
                type="username"
                name="username"
                value={form?.username}
                onChange={handleChange}
                placeholder="Type your User Id"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            {/* Detailed Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-gray-700">House Number</label>
                  <input
                    name="houseNumber"
                    value={form?.houseNumber || ""}
                    onChange={handleChange}
                    placeholder="Enter House Number"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Street</label>
                  <input
                    name="street"
                    value={form?.street || ""}
                    onChange={handleChange}
                    placeholder="Enter Street"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Building Name</label>
                  <input
                    name="buildingName"
                    value={form?.buildingName || ""}
                    onChange={handleChange}
                    placeholder="Enter Building Name"
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Landmark</label>
                  <input
                    name="landmark"
                    value={form?.landmark || ""}
                    onChange={handleChange}
                    placeholder="Enter Landmark"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">City</label>
                  <input
                    name="city"
                    value={form?.city || ""}
                    onChange={handleChange}
                    placeholder="Enter City"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">State</label>
                  <input
                    name="state"
                    value={form?.state || ""}
                    onChange={handleChange}
                    placeholder="Enter State"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Country</label>
                  <input
                    name="country"
                    value={form?.country || ""}
                    onChange={handleChange}
                    placeholder="Enter Country"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Zip Code</label>
                  <input
                    name="zipCode"
                    value={form?.zipCode || ""}
                    onChange={handleChange}
                    placeholder="Enter Zip Code"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-medium text-gray-700">Full Shop Address</label>
                  <input
                    name="shopAddress"
                    value={form?.shopAddress || ""}
                    onChange={handleChange}
                    placeholder="Full Address (e.g. auto-generated or manually combined)"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
              </div>

            {/* previous address */}
            {/* <div>
              <label className="font-medium text-gray-700">Past Address</label>
              <input
                type="text"
                name="pastShopAddress"
                value={form?.pastShopAddress || ""}
                onChange={handlePastAddressChange}
                placeholder="Enter Past Address"
                className="border p-2 rounded w-full"
                
              />
              <div className="flex gap-2 mt-2">
                <input
                  type="month"
                  name="pastShopAddressFrom"
                  value={form?.pastShopAddressFrom || ""}
                  onChange={handlePastAddressFromChange}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  type="month"
                  name="pastShopAddressTo"
                  value={form?.pastShopAddressTo || ""}
                  onChange={handlePastAddressToChange}
                  className="border p-2 rounded w-1/2"
                />
              </div>
            </div> */}


            {/* Description */}
            <div>
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form?.description}
                onChange={handleChange}
                placeholder="Enter Description"
                maxLength={1000}
                className="border p-2 rounded w-full"
                required
              />
              <div className="text-sm mt-1 text-right">
                {/* <span className={form?.description?.length === 1000 ? "text-red-500 font-semibold" : "text-gray-500"}>
                  {form?.description?.length || 0}/1000
                </span> */}
                {form?.description?.length === 1000 && (
                  <p className="text-red-500 text-xs font-medium mt-1">You have reached the maximum character limit.</p>
                )}
              </div>

              {errors?.description && <span className="text-sm text-red-500">{errors.description}</span>}
            </div>

            {/* Hashtags */}
            <div>
              <label className="font-medium text-gray-700">Hashtags</label>
              <input
                name="hashtags"
                value={form?.hashtags}
                onChange={handleChange}
                placeholder="Comma separated (e.g. doctor, clinic)"
                className="border p-2 rounded w-full"
                required
              />
              {errors?.hashtags && <span className="text-sm text-red-500">{errors.hashtags}</span>}
            </div>

            {/* Open Time */}
            <div>
              <label className="font-medium text-gray-700">Open Time</label>
              <input
                  name="shopOpenTime"
                type="time"
                value={form?.shopOpenTime}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              {errors?.shopOpenTime && <span className="text-sm text-red-500">{errors.shopOpenTime}</span>}
            </div>

            {/* Close Time */}
            <div>
              <label className="font-medium text-gray-700">Close Time</label>
              <input
                name="shopCloseTime"
                type="time"
                value={form?.shopCloseTime}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              {errors?.shopCloseTime && <span className="text-sm text-red-500">{errors.shopCloseTime}</span>}
            </div>

            {/* Shop Open Days */}
            <div className="flex flex-col gap-y-2">
              <label className="font-medium text-gray-700">Shop Open Days</label>
              <div className="grid grid-cols-2 pl-4 gap-2 text-sm text-gray-700">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={day}
                      checked={form?.shopOpenDays?.includes(day)}
                      onChange={handleDayToggle}
                      className="accent-blue-600"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <label className="font-medium text-gray-700">UPI ID</label>
              <input
                name="upi_id"
                value={form?.upi_id}
                onChange={handleChange}
                placeholder="Enter UPI ID"
                className="border p-2 rounded w-full" required
              />
              {errors?.upi_id && <span className="text-sm text-red-500">{errors.upi_id}</span>}
            </div>

            {/* Scanner Image */}
            <div>
              <label className="font-medium text-gray-700">Upload Scanner Image</label>
              <input
                name="scanner_image"
                placeholder="Upload Scanner QR Image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="border p-2 rounded w-full" required
              />
              {errors?.scanner_image && <span className="text-sm text-red-500">{errors.scanner_image}</span>}
            </div>

            {/* current location */}
            <div>
              <label className="font-medium text-gray-700">Current Location</label>
              <div className="relative">
              <input
                name="currentLocation"
                value={form.currentLocation}
                onChange={handleChange}
                placeholder="Type or Click on Icon to get current location..."
                className="border p-2 rounded w-full pr-10"
                required
              />
                <button
                  type="button"
                  onClick={handleLocationFetch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600"
                >
                  <MapPin size={18} />
                </button>
              </div>
            </div>

            <button type="submit"
            // onClick={handleSubmit}
            className="mt-4 w-full px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>

          </form>
          {message && <p className="mt-4 text-sm">{message}</p>}

        </div>
      </div>
    );
  }
