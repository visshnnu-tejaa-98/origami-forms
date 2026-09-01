import { useEffect, useState } from "react";

type DeviceInfo = {
    browser: string;
    device: string;
};

function getBrowserName(userAgent: string): string {
    if (/Edg\//i.test(userAgent)) return "Edge"
    if (/SamsungBrowser/i.test(userAgent)) return "Samsung Internet";
    if (/OPR\//i.test(userAgent)) return "Opera";
    if (/Firefox\//i.test(userAgent)) return "Firefox";
    if (/CriOS\//i.test(userAgent)) return "Chrome";
    if (/Chrome\//i.test(userAgent)) return "Chrome";
    if (/Safari\//i.test(userAgent) && !/Chrome|CriOS|Android/i.test(userAgent)) return "Safari";
    return "Unknown Browser";
}

function getDeviceName(userAgent: string): string {
    if (/iPhone/i.test(userAgent)) return "iPhone";
    if (/iPad/i.test(userAgent)) return "iPad";
    if (/Macintosh/i.test(userAgent)) return "Mac";
    if (/Windows/i.test(userAgent)) return "Windows PC";
    if (/Linux/i.test(userAgent)) return "Linux PC";
    if (/Android/i.test(userAgent)) {
        const androidMatch =
            /Android.*?;\s*(?:[a-z]{2}-[a-z]{2};\s*)?([^;)]+?)(?:\s+Build\/.*)?[;)]/i.exec(userAgent);
        return androidMatch?.[1]?.trim() || "Android Device";
    }
    return "Unknown Device";
}

export function useDeviceInfo() {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

    useEffect(() => {
        const userAgent = navigator.userAgent;

        const browser = getBrowserName(userAgent);
        const device = getDeviceName(userAgent);

        setDeviceInfo({
            browser,
            device,
        });
    }, []);

    return { ...deviceInfo };
}
