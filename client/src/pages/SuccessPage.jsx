import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCartStore } from "../context/useCart";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState("");
  const clearCart = useCartStore((state) => state.clearCart);
  const edgeFunctionUrl = `${import.meta.env.VITE_EDGE_FUNCTION_RS}/functions/v1/dynamic-action`;

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID. Cannot display order details.");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`${edgeFunctionUrl}?sessionId=${sessionId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch session.");
        }
        const data = await res.json();
        setSessionData(data);

        // Clear frontend cart since purchase succeeded
        await clearCart();
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  if (loading) return <p>Loading your order details...</p>;
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;
  if (!sessionData) return <p>Unable to retrieve order information.</p>;

  const paymentIntent = sessionData.payment_intent;
  const lineItems = sessionData.line_items?.data || [];

  return (
    <div>
      <h1>✅ Order Successful!</h1>
      <p>Thank you for your purchase.</p>

      <h2>Payment Info</h2>
      <ul>
        <li>
          <strong>Status:</strong> {paymentIntent.status}
        </li>
        <li>
          <strong>Amount Paid:</strong> ${(paymentIntent.amount / 100).toFixed(2)} {paymentIntent.currency.toUpperCase()}
        </li>
        
      </ul>

      <h2>Purchased Items</h2>
      <ul>
        {lineItems.map((item) => (
          <li key={item.id}>
            {item.description} — Quantity: {item.quantity} — Price: ${(item.price.unit_amount / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
