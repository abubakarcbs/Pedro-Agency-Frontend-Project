"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserRegistrationPayment() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    document: null as File | null,
    picture: null as File | null,
    is_registered: false,
    name: "",
    amount: "",
    description: "",
  });

  const [loading, setLoading] = useState(false); // State to manage loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [errorMessage, setErrorMessage] = useState(""); // Error message

  const labelStyle = "block font-medium mb-2 text-white";
  const inputStyle = "border border-gray-300 rounded-md p-2 w-full text-dark-blue";

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "document" | "picture"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [key]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Prepare FormData for file uploads
    const payload = new FormData();
    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("email", formData.email);
    payload.append("address", formData.address);
    if (formData.document) payload.append("document", formData.document);
    if (formData.picture) payload.append("picture", formData.picture);
    payload.append("is_registered", String(formData.is_registered));

    try {
      const response = await fetch("http://localhost:8002/users/", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create user");
      }

      const result = await response.json();
      setSuccessMessage("User registered successfully!");
      console.log("New user:", result);
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8002/process-payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          amount: formData.amount,
          description: formData.description,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to process payment");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Payment processing initiated.");
    } catch (error) {
      console.error("Error processing payment:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-mehrun min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">User Registration</h1>

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name" className={labelStyle}>
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="last_name" className={labelStyle}>
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={labelStyle}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="address" className={labelStyle}>
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="document" className={labelStyle}>
            Document
          </label>
          <input
            type="file"
            id="document"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "document")}
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="picture" className={labelStyle}>
            Picture
          </label>
          <input
            type="file"
            id="picture"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, "picture")}
            className={inputStyle}
          />
        </div>

        <button
          type="submit"
          className="bg-dark-blue text-white rounded-md px-4 py-2 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>

      <button
        onClick={() => router.push("/payment")}
        className="mt-4 bg-white text-dark-blue rounded-md px-4 py-2 hover:bg-gray-300"
      >
        Proceed to Payment
      </button>

      {/* Payment Section */}
    <div className="mt-8"></div>
        <h2 className="text-2xl font-bold mb-4 text-white">Process Payment</h2>

        <form className="space-y-4" onSubmit={handlePaymentSubmit}>
            {/* Form content */}
        </form>
          <div>
            <label htmlFor="name" className={labelStyle}>
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className={labelStyle}>
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className={labelStyle}>
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputStyle}
              required
            />
            </div>

            <button
              type="submit"
              className="bg-dark-blue text-white rounded-md px-4 py-2 hover:bg-blue-700"
              disabled={loading}
            >   
                {loading ? "Processing..." : "Process Payment"}
            </button>

        {errorMessage && (
            <div className="text-red-600 mt-4">{errorMessage}</div>
            )}
        {successMessage && (
            <div className="text-green-600 mt-4">{successMessage}</div>
            )}
    </div>
    );
}
