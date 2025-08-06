import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const Information = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [paypalPaid, setPaypalPaid] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const data = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

  const subtotal = data.reduce((sum, item) => {
    const price = item.productVariant.price;
    const discount = item.productVariant.discountPercent || 0;
    const discountedPrice = price * (1 - discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  const handlePlaceOrder = async (paypalDetails = null) => {
    if (!["cod", "paypal"].includes(paymentMethod)) {
      alert("Phương thức thanh toán này hiện chưa được hỗ trợ.");
      return;
    }

    if (!firstName || !lastName || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const orderData = {
      customerName: fullName,
      customerPhone: phone,
      shippingAddress: address,
      discountAmount: 0,
      discountId: null,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      items: data.map((item) => {
        const price = item.productVariant.price;
        const discount = item.productVariant.discountPercent || 0;
        const discountedPrice = price * (1 - discount / 100);

        return {
          productVariantId: item.productVariant.id,
          quantity: item.quantity,
          price: discountedPrice,
          unitPrice: discountedPrice,
          totalPrice: discountedPrice * item.quantity,
          productName: item.productVariant.productName,
          colorName: item.productVariant.colorName,
          sizeName: item.productVariant.sizeName,
        };
      }),
      paypalTransactionId: paypalDetails?.id || null,
      paypalPayerEmail: paypalDetails?.payer?.email_address || null,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5235/api/OrderApi/Checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Đặt hàng thành công! Mã đơn: " + result.orderId);
      } else {
        alert("Có lỗi xảy ra khi đặt hàng.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <h2 className="text-2xl font-sans font-semibold">Delivery</h2>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-1/2 border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-1/2 border px-4 py-2 rounded"
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
        <div className="grid gap-4">
          {[
            { id: "credit-card", label: "Credit/Debit Card" },
            { id: "paypal", label: "PayPal" },
            { id: "cod", label: "Cash on Delivery (COD)" },
            { id: "momo", label: "MoMo" },
          ].map((method) => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition 
                ${
                  paymentMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-400"
                }`}
            >
              <span>{method.label}</span>
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio accent-blue-500"
              />
            </label>
          ))}
        </div>

        {paymentMethod === "paypal" && (
          <div className="mt-4">
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalAmount.toFixed(2),
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(function (details) {
                  alert("Thanh toán PayPal thành công!");
                  setPaypalPaid(true);
                  handlePlaceOrder(details); // Truyền thông tin giao dịch
                });
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                alert("Thanh toán PayPal thất bại!");
              }}
            />
          </div>
        )}
      </div>

      {/* ✅ Hiện nút “Pay Now” khi KHÔNG phải PayPal */}
      {paymentMethod !== "paypal" && (
        <div className="pt-6">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Information;
