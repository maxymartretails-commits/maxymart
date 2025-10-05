"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce"; // import debounce hook

export function useLatLngByPincode(pincode?: string) {
  const [latLng, setLatLng] = useState<{ lat: string; lng: string; addr: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ debounce user input
  const debouncedPincode = useDebounce(pincode, 800); // 800ms wait

  useEffect(() => {
    if (!debouncedPincode) return;

    const fetchLatLng = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || "pk.1234567890abcdef";
        const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&postalcode=${encodeURIComponent(
          debouncedPincode
        )}&country=India&format=json`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        if (data && data.length > 0) {
          setLatLng({
            lat: data[0].lat,
            lng: data[0].lon,
            addr: data[0].display_name || "Unknown address",
          });
        } else {
          setError("Pincode not found");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLatLng();
  }, [debouncedPincode]);

  return { latLng, loading, error };
}
