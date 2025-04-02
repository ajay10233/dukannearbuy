"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBillFormat() {
  const router = useRouter();

  const [form, setForm] = useState({
    gstNumber: "",
    taxType: "",
    taxPercentage: "",
    proprietorSign: "",
    extraText: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/billFormat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      router.push("/dashboard/bill-format");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Add Bill Format</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="gstNumber" placeholder="GST Number" onChange={handleChange} />
        <input type="text" name="taxType" placeholder="Tax Type" onChange={handleChange} />
        <input type="number" name="taxPercentage" placeholder="Tax Percentage" onChange={handleChange} />
        <input type="text" name="proprietorSign" placeholder="Proprietor Sign Path" onChange={handleChange} />
        <textarea name="extraText" placeholder="Extra Text" onChange={handleChange}></textarea>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
