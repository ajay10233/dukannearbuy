"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBillFormatComponent() {
  const router = useRouter();
  const [form, setForm] = useState({
    gstNumber: "",
    taxType: "",
    taxPercentage: "",
    proprietorSign: "",
    extraText: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBillFormat() {
      try {
        const res = await fetch("/api/billFormat");
        if (!res.ok) throw new Error("Failed to fetch bill format");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchBillFormat();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/billFormat", {
        method: "PUT",
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
      <h1>Edit Bill Format</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} />
        <input type="text" name="taxType" placeholder="Tax Type" value={form.taxType} onChange={handleChange} />
        <input type="number" name="taxPercentage" placeholder="Tax Percentage" value={form.taxPercentage} onChange={handleChange} />
        <input type="text" name="proprietorSign" placeholder="Proprietor Sign Path" value={form.proprietorSign} onChange={handleChange} />
        <textarea name="extraText" placeholder="Extra Text" value={form.extraText} onChange={handleChange}></textarea>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
