// src/components/StoreHero.jsx
import { Card, Button } from "flowbite-react";

export default function StoreHero({
  bannerUrl,
  logoUrl,
  storeName,
  tagline,
  onShopNow,
  onContact,
}) {
  return (
    <section className="relative w-full">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 md:h-96">
        <img
          src={bannerUrl}
          alt="Store Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Logo + Info */}
      <div className="absolute inset-x-0 -bottom-16 flex flex-col items-center">
        <img
          src={logoUrl}
          alt="Store Logo"
          className="h-28 w-28 rounded-full border-4 border-white shadow-lg object-cover"
        />

        <Card className="mt-4 w-fit px-6 py-4 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
          {tagline && <p className="mt-1 text-gray-600">{tagline}</p>}

          {/* CTA buttons */}
          <div className="mt-4 flex gap-3 justify-center">
            <Button color="info" onClick={onShopNow}>
              Shop Now
            </Button>
            <Button color="gray" onClick={onContact}>
              Contact Seller
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
