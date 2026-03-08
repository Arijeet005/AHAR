import React, { useState, useEffect } from "react";

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const initiatePayment = () => {
    if (!isRazorpayLoaded) {
      alert("Razorpay SDK not loaded yet.");
      return;
    }
    setLoading(true);
    const options = {
      key: "rzp_test_0yx0AGbEbJaWtH", // EXTRACTED KEY
      amount: 69900, // Amount in paise (699 * 100)
      currency: "INR",
      name: "Urban Roots",
      description: "Consultation Session Fee",
      image: "https://your-logo-url.com/logo.png",
      handler: function (response) {
        // Handle successful payment
        console.log("Payment Successful", response);
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
        setLoading(false);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Urban Roots Booking",
      },
      theme: {
        color: "#34A12E", // Forest Green
      },
    };
    const rzp1 = new window.Razorpay(options);

    // Handle failures
    rzp1.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.description);
      setLoading(false);
    });
    rzp1.open();
  };

  return (
    <div>
      <h2>Payment Checkout</h2>
      <p>Amount: ₹699.00</p>
      <button
        onClick={initiatePayment}
        disabled={loading || !isRazorpayLoaded}
        style={{
          background: "#34A12E",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;