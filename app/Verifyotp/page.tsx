"use client";

import { useState } from "react";
import axios from "axios";

const OTPVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleVerifyOtp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const verifyResponse = await axios.post("http://localhost:8003/verify-otp/", { email, otp });

      if (verifyResponse.data) {
        const checkoutResponse = await axios.post("http://localhost:8003/create-checkout-session/", { email, otp });
        const { checkout_url } = checkoutResponse.data;

        if (checkout_url) {
          setCheckoutUrl(checkout_url);
          window.location.href = checkout_url; // Redirect to the checkout session
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch {
      setError("Invalid OTP or payment record not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    // Construct the dynamic URL for resend OTP
    const resendOtpUrl = `http://localhost:8003/resend-otp/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`;

    try {
      const response = await axios.post(resendOtpUrl, {
        first_name: firstName,
        last_name: lastName,
      });

      setToastMessage("OTP sent successfully!");
      setShowResendModal(false);
    } catch {
      setError("Failed to resend OTP. Please check the provided details.");
    } finally {
      setResendLoading(false);
    }
  };

  const closeToast = () => {
    setToastMessage("");
  };

  return (
    <div className="card grid grid-cols-2 gap-4 p-6">
      <h1 className="text-2xl font-bold mb-4">OTP Verification</h1>
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {loading && <p className="text-gray-500 mt-4">Verifying OTP, please wait...</p>}
      {error && (
        <div>
          <p className="mt-4 text-red-500">{error}</p>
          <button
            onClick={() => setShowResendModal(true)}
            className="mt-2 bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600"
          >
            Resend OTP
          </button>
        </div>
      )}

      {showResendModal && (
        <div className="modal bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Resend OTP</h2>
          <input
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <input
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <button
            onClick={handleResendOtp}
            className={`button ${
              resendLoading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
            }`}
            disabled={resendLoading}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
          <button
            onClick={() => setShowResendModal(false)}
            className="button"
          >
            Cancel
          </button>
        </div>
      )}

      {toastMessage && (
        <div className="toast bg-green-500 text-white p-4 rounded-md fixed top-4 right-4 shadow-lg">
          <p>{toastMessage}</p>
          <button onClick={closeToast} className="text-white underline mt-2">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default OTPVerificationPage;
