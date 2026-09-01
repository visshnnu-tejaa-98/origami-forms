import { useEffect, useState } from "react";

type LocationType = {
    city: string,
    state: string,
    country: string,
    countryCode: string,
}

export function useLocation() {
    const [location, setLocation] = useState<LocationType | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                console.log("Coordinates: ", latitude, longitude)

                setLoading(true)
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
                        headers: {
                            "User-Agent": "origami-forms/1.0"
                        }
                    })

                    if (!response.ok) throw new Error("Network response was not ok")

                    const data = await response.json()

                    console.log("Data: ", data)
                    const addr = data.address || {}

                    setLocation({
                        city: addr.city || addr.town || addr.village || addr.suburb || "N/A",
                        state: addr.state || addr.state_district || "N/A",
                        country: addr.country || "N/A",
                        countryCode: addr.country_code ? addr.country_code.toUpperCase() : "N/A"
                    })

                } catch (error) {
                    console.error("❌ Failed to parse region details from OSM:", error);
                } finally {
                    setLoading(false)
                }
            },
            (error) => console.error("⚠️ Geolocation access blocked by user:", error.message),
            { enableHighAccuracy: true }
        )
    }, [])

    return {
        location,
        loading
    }
}