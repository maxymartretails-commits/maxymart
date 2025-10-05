"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { setLocationData } from "@/lib/slices/userLocationSlice";

export default function ClientGeoLocation() {
    const dispatch = useAppDispatch();
    const userLocation = useAppSelector((state) => state.userLocation);
    const { addressByPincode } = userLocation;

    const {
        latitude,
        longitude,
        pinCode,
        address,
        isLoading: locationLoading,
        error: locationError,
        getCurrentLocation,
        hasLocation,
    } = useGeolocation();

    useEffect(() => {
        if (latitude || address || pinCode || longitude && !addressByPincode) {
            dispatch(
                setLocationData({
                    address: String(address),
                    pincode: String(pinCode),
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    hasLocation,
                    error: String(locationError),
                    loading: locationLoading,
                    addressByPincode: false
                })
            );
        }
    }, [address, latitude, longitude, pinCode, addressByPincode]);

    useEffect(() => {
        if (!addressByPincode) {
            getCurrentLocation();
        }
    }, [addressByPincode]);

    return null;
}
