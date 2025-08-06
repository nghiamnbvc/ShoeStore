import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const Payment = ({ amount, onApprove }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Abf6qmNwoffdDxhulKIlFaFgvDuUTnI2jtj9hF0cntPfvbg3KmLx1khNglgY4bA0Wv2XtNzoZR3cPoNB",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: amount },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            // ✅ Gửi dữ liệu về server tạo hóa đơn
            onApprove(details);
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default Payment;
