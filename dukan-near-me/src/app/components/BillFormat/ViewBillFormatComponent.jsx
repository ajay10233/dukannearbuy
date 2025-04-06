"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ViewBillFormatComponent() {
  const [billFormat, setBillFormat] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchBillFormat() {
    try {
      const res = await fetch("/api/billFormat");
      if (!res.ok) throw new Error("Failed to fetch bill format");
      const data = await res.json();
      setBillFormat(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteBillFormat() {
    if (!window.confirm("Are you sure you want to delete this bill format?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/billFormat", { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete bill format");
      }

      alert("Bill format deleted successfully!");
      setBillFormat(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBillFormat();
  }, []);

  return (
    <div>
      <h1>Bill Format</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {billFormat ? (
        <div>
          <p><strong>GST Number:</strong> {billFormat.gstNumber}</p>
          <p><strong>Tax Type:</strong> {billFormat.taxType}</p>
          <p><strong>Tax Percentage:</strong> {billFormat.taxPercentage}%</p>
          <p><strong>Proprietor Sign:</strong> {billFormat.proprietorSign}</p>
          <p><strong>Extra Text:</strong> {billFormat.extraText}</p>
          
          <Link href="/dashboard/bill-format/edit">
            <button>Edit</button>
          </Link>
          <button 
            onClick={deleteBillFormat} 
            style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      ) : (
        <p>
          No bill format found. 
          <Link href="/dashboard/bill-format/add">
            <button>Add One</button>
          </Link>
        </p>
      )}
    </div>
  );
}
