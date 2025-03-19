import { toast, ToastContainer } from "react-toastify";
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      router.push("/login");
    } else {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          backgroundColor: "#f44336",
          color: "#fff",
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-96 mx-auto mt-10">
      <ToastContainer/>
      <input name="name" placeholder="Name" onChange={handleChange} className="p-2 border mb-2" />
      <input name="username" placeholder="Username" onChange={handleChange} className="p-2 border mb-2" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border mb-2" />
      <input name="phone" placeholder="Phone" onChange={handleChange} className="p-2 border mb-2" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border mb-2" />
      <button type="submit" className="bg-green-500 text-white p-2">Sign Up</button>
    </form>
  );
}
