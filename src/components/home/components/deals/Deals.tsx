"use client";

import { useEffect, useState } from "react";

//constants
import { deals } from "../../constants";

const DealSection = () => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  useEffect(() => {
    const target = new Date().setHours(23, 59, 59, 999);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-6 px-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🔥 Today’s Top Deals</h2>
        <div className="text-sm text-red-600 font-medium">
          Ends in {timeLeft}
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-4 snap-x scroll-smooth scrollbar-hide">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="min-w-[220px] bg-white border border-gray-200 rounded-xl shadow-sm snap-start"
          >
            <div className="relative">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                {deal.discount}
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2">{deal.title}</h3>
              <p className="text-red-600 font-semibold mt-1">{deal.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealSection;
