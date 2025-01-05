"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProcessPayment = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    firstName: "",
    lastName: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    const queryParams = new URLSearchParams({
      amount: formData.amount,
      description: formData.description,
      first_name: formData.firstName,
      last_name: formData.lastName,
    }).toString();

    try {
      const response = await axios.post(
        `http://localhost:8003/process-payment/?${queryParams}`
      );

      if (response.data) {
        setSuccessMessage("OTP is sent to your registered email.");

        // Navigate to the Verify OTP page after a short delay
        setTimeout(() => {
          router.push("/Verifyotp");
        }, 1000);
      }
    } catch (error: any) {
      const errorDetail = parseError(error.response?.data);
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  const parseError = (errorData: any) => {
    if (!errorData) return "An unknown error occurred. Please try again.";

    if (Array.isArray(errorData)) {
      return errorData.map((err) => JSON.stringify(err, null, 2)).join(", ");
    }

    if (typeof errorData === "object") {
      return JSON.stringify(errorData, null, 2);
    }

    return String(errorData);
  };

  return (
    <div className="card p-8 grid grid-cols-2 gap-4">
      <h1 className="text-2xl font-bold mb-4">Process Payment</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block font-bold mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block font-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className={`button ${
            loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>

      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <pre className="mt-4 text-red-500">{errorMessage}</pre>}
    </div>
  );
};

export default ProcessPayment;
