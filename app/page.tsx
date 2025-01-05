"use client";

import React, { useState } from "react";

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

      // Navigate to payment page upon successful registration
      window.location.href = "/payment";
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 border border-gray-300 rounded-md shadow-md bg-gradient-to-r text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome on MicroPedro Remittance</h1>

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name and Last Name in a Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block font-bold mb-2">
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
            <label htmlFor="last_name" className="block font-bold mb-2">
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
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-bold mb-2">
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
          <label htmlFor="address" className="block font-bold mb-2">
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
          <label htmlFor="document" className="block font-bold mb-2">
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
          <label htmlFor="picture" className="block font-bold mb-2">
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

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </form>

      {/* Success/Error Messages */}
      {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
    </div>
  );
}
