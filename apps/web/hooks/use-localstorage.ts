"use client";
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, value?: T) {
    const [data, setData] = useState<T>(value as T);

    useEffect(() => {
        try {
            const item = localStorage.getItem(key)
            if (item) {
                setData(JSON.parse(item))
            } else if (typeof value === 'function') {
                setData(value())
            }
        } catch (error) {
            console.error("Error reading localStorage key:", key, error);
        }
    }, [key])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(key)!);
        if (data) {
            setData(data);
        }
    }, [key]);

    useEffect(() => {
        if (data !== undefined) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }, [data, key]);

    const removeItem = (key: string) => {
        try {
            localStorage.removeItem(key)
            setData(undefined as T)
        } catch (error) {
            console.error("Error removing localStorage key:", key, error);
        }
    }

    return [data, setData, removeItem] as const;
}

