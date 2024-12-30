"use client";

import React, { useState } from "react";

export default function ProcessPayment() {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [errorMessage, setErrorMessage] = useState(""); // Error message

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Process Payment</h1>

      {/* Payment Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block font-medium mb-2">
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-2">
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

        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>

      {/* Success/Error Messages */}
      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
}


