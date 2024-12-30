"use client";

import React, { useState } from "react";
import ProcessPayment from "./payment/page";


export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    document: null as File | null,
    picture: null as File | null,
    is_registered: false,
  });
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [errorMessage, setErrorMessage] = useState(""); // Error message

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

  const handlePaymentPage = () => {
    // Redirect to the payment page
    window.location.href = "/payment";
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Register User</h1>

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Document Upload */}
        <div>
          <label htmlFor="document" className="block font-medium mb-2">
            Document
          </label>
          <input
            type="file"
            id="document"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "document")}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        {/* Picture Upload */}
        <div>
          <label htmlFor="picture" className="block font-medium mb-2">
            Picture
          </label>
          <input
            type="file"
            id="picture"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, "picture")}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        {/* Is Registered */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_registered}
              onChange={(e) => setFormData({ ...formData, is_registered: e.target.checked })}
              className="border border-gray-300 rounded-md"
            />
            <span>Is Registered?</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>

      {/* Success/Error Messages */}
      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}



      <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Process Payment</h1>

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <button
          type="button"
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          onClick={handlePaymentPage}
        >
          Go to Payment
        </button>
      </form>
    </div>
    </div>



  );
}
