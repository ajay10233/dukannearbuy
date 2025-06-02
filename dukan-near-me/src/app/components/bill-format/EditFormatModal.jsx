"use client";

import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function EditFormatModal({ closeModal, onFormDetailsChange, user, formDetails }) {
  const [formData, setFormData] = useState({
    firmName: "",
    address: "",
    contactNo: "",
    gstNo: "",
    email: "",
    cgst: "",
    sgst: "",
    proprietorSign: null,
    terms: "",
    updates: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);


    
  useEffect(() => {
    const fetchFormat = async () => {
      try {
        const res = await fetch("/api/billFormat"); 
        if (res.ok) {
          const data = await res.json();

          const [cgst, sgst] = data.taxPercentage?.split("+").map((t) => t.trim()) || [0, 0];
          const [terms = "", updates = ""] = data.extraText?.split("\n") || ["", ""];

          const institution = data.institutionRelation || {};

          setFormData({
            firmName: institution.firmName || "",
            address: institution.address || "",
            contactNo: institution.phone || "",
            gstNo: data.gstNumber || "",
            email: institution.contactEmail || "",
            cgst,
            sgst,
            proprietorSign: data.proprietorSign || null,
            terms,
            updates,
          });
        }
      } catch (err) {
        console.error("Error fetching format:", err);
      }
    };

    fetchFormat();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNo") {
      if (!/^\d*$/.test(value)) return; // Only allow digits

      if (value.length > 10) {
        setError("Contact number cannot be more than 10 digits");
      } else if (value.length < 10) {
        setError("Contact number must be exactly 10 digits");
      } else {
        setError(""); // Clear error if valid
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contactNo.length !== 10) {
      setError("Contact number cannot be more than 10 digits");
      return;
    }

    const form = e.target.form || e.target.closest("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      gstNumber: formData.gstNo,
      taxType: "CGST+SGST",
      taxPercentage: `${formData.cgst || 0} + ${formData.sgst || 0}`,
      extraText: `${formData.terms}\n${formData.updates}`,
      // firmName: formData.firmName,
  // contactEmail: formData.email,
  // phone: formData.contactNo,
  // shopAddress: formData.address,

    };

    if (formData.proprietorSign) {
      payload["proprietorSign"] = formData.proprietorSign;

      setIsSaving(true);

        try {
          const res = await fetch("/api/billFormat", {
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            toast.success("Format details saved successfully!");
            onFormDetailsChange(formData);
            closeModal();
          } else {
            toast.error("Failed to save format.");
          }
        } catch (err) {
          console.error(err);
          toast.error("An error occurred.");
        } finally {
  setIsSaving(false);
}

      // };
      // reader.readAsDataURL(formData.proprietorSign);
          } else {
            try {
              const res = await fetch("/api/billFormat", {
                method: "POST", 
                body: JSON.stringify(payload),
              });

              if (res.ok) {
                toast.success("Format details saved successfully!");
                onFormDetailsChange(formData); 
                closeModal();
              } else {
                toast.error("Failed to save format.");
              }
            } catch (err) {
              console.error(err);
              toast.error("An error occurred.");
            } finally {
              setIsSaving(false);
            }
          }

      };

   const handleUpdate = async (e) => {
    e.preventDefault();

    const form = e.target.form || e.target.closest("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      gstNumber: formData.gstNo,
      taxType: "CGST+SGST",
      taxPercentage: `${formData.cgst || 0} + ${formData.sgst || 0}`,
      extraText: `${formData.terms}\n${formData.updates}`,
    //   firmName: formData.firmName,
    // contactEmail: formData.email,
    // phone: formData.contactNo,
    // shopAddress: formData.address,
    };

    if (formData.proprietorSign) {
      payload["proprietorSign"] = formData.proprietorSign;
      setIsSaving(true);

    try {
      const res = await fetch("/api/billFormat", {
        method: "PUT", 
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Format details updated successfully!");
        onFormDetailsChange(formData); 
        closeModal();
      } else {
        toast.error("Failed to update format details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
              setIsSaving(false);
            }
  // };
  // reader.readAsDataURL(formData.proprietorSign);
} else {
  try {
    const res = await fetch("/api/billFormat", {
      method: "PUT", 
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Format details saved successfully!");
      onFormDetailsChange(formData); 
      closeModal();
    } else {
      toast.error("Failed to save format.");
    }
  } catch (err) {
    console.error(err);
    toast.error("An error occurred.");
  } finally {
    setIsSaving(false);
  }
}

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-4 md:p-8 rounded-md shadow-lg w-80 md:w-full md:max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4">Edit Format Details</h2>

        <form className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-4" onSubmit={handleSubmit}>
          <label className="flex flex-col">
            Firm Name:
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              required
              className="border p-2 rounded mt-1"
              placeholder="Enter your Firm Name"
            />
          </label>

          <label className="flex flex-col">
            Firm Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border p-2 rounded mt-1"
              placeholder="Enter your Firm Address"
            />
          </label>

          <label className="flex flex-col">
            Contact No.:
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={10} 
              className="border p-2 rounded mt-1"
              placeholder="Type your Contact No."
            />
              {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
          </label>

          <label className="flex flex-col">
            GST No.:
            <input
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
              className="border p-2 rounded mt-1"
              placeholder="Type your GST No."
            />
          </label>

          <label className="flex flex-col">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded mt-1 lowercase"
              placeholder="Type your Email ID"
            />
          </label>

          <label className="flex flex-col">
            CGST (%):
            <input
              type="number"
              name="cgst"
              value={formData.cgst}
              onChange={handleChange}
              min="0"
              max="100"
              // step="0.01"
              className="border p-2 rounded mt-1"
              placeholder="CGST in %"
            />
          </label>

          <label className="flex flex-col">
            SGST (%):
            <input
              type="number"
              name="sgst"
              value={formData.sgst}
              onChange={handleChange}
              min="0"
              max="100"
              // step="0.01"
              className="border p-2 rounded mt-1"
              placeholder="SGST in %"
            />
          </label>

          <label className="flex flex-col">
            Upload Proprietor Signature:
            <input
              type="file"
              accept="image/*"
              // onChange={(e) =>
              //   setFormData((prev) => ({
              //     ...prev,
              //     proprietorSign: e.target.files?.[0] || null,
              //   }))
              // }
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      proprietorSign: reader.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                } else {
                  setFormData((prev) => ({ ...prev, proprietorSign: null }));
                }
              }}
              className="border p-2 rounded mt-1"
            />
          </label>

          <label className="flex flex-col">
            Terms & Conditions (max 250 characters):
            <textarea
              name="terms"
              value={formData.terms}
              maxLength={250}
              onChange={handleChange}
              className="border p-2 rounded resize-none mt-1 min-h-[120px]"
              placeholder="Enter Terms & Conditions"
            />
          </label>

          <label className="flex flex-col">
            Updates / Offer Information (max 150 characters):
            <textarea
              name="updates"
              value={formData.updates}
              maxLength={150}
              onChange={handleChange}
              className="border p-2 rounded resize-none mt-1 min-h-[80px]"
              placeholder="Enter Updates or Offers"
            />
          </label>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              onClick={handleUpdate}
              disabled={isSaving}
              className="px-8 py-2 rounded cursor-pointer bg-blue-600 text-white transition-all duration-500 ease-in-out hover:bg-blue-800"
            >
                {isSaving ? "Saving..." : "Save Changes"}

            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded border border-gray-500 cursor-pointer transition-all duration-500 ease-in-out hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
