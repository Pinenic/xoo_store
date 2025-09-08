// src/components/FinalCTA.jsx
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate()
  return (
    <section className="bg-indigo-600 text-white py-16">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience a Better Marketplace?
        </h2>
        <p className="text-lg mb-8 text-indigo-100">
          Shop from trusted sellers or open your own store today — it’s quick,
          simple, and secure.
        </p>
        <div className="flex justify-center gap-4">
          <Button color="light" size="lg" onClick={() => navigate("/marketplace")}>
            Shop Today
          </Button>
          <Button color="dark" size="lg" onClick={() => navigate("/features")}>
            Open a Store
          </Button>
        </div>
      </div>
    </section>
  );
}
