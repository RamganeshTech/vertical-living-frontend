// useDriverLocationSender.ts
import { useEffect } from 'react';
import { useUpdateDriverLocation } from '../../../apiList/Department Api/Logistics Api/logisticsApi';

export const useDriverLocationSender = (shipmentId: string, enabled: boolean, onFirstSuccess?: () => void) => {
    const { mutate: updateLocation, isPending, data } = useUpdateDriverLocation();

    useEffect(() => {
        if (!enabled || !shipmentId) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                updateLocation({
                    shipmentId,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                    {
                        // This only triggers when the server responds with 200 OK
                        onSuccess: (res) => {
                            if (res.ok && onFirstSuccess) {
                                onFirstSuccess();
                            }
                        },
                    }
                );
            },
            (error) => console.error("GPS Error:", error),
            // { enableHighAccuracy: true, maximumAge: 30000 }
            {
                enableHighAccuracy: true,
                maximumAge: 0, // Force fresh data, no cache
                timeout: 5000  // Fail fast if GPS isn't responding
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [shipmentId, enabled, updateLocation]);

    // Return the loading state so the button can use it
    return { isUpdating: isPending, data };
};