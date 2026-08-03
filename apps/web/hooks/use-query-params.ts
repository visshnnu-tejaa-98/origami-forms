"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ParamValue = string | number | null | undefined;

/**
 * Thin wrapper over the URL search params so filter state is shareable,
 * survives a refresh, and works with the browser's back button.
 *
 * NOTE: any component using this must sit under a <Suspense> boundary.
 */
export function useQueryParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /** read a param, falling back to a default when absent */
    const getParam = useCallback(
        <T extends string>(key: string, fallback: T, allowed?: readonly T[]): T => {
            const value = searchParams.get(key) as T | null;
            if (!value) return fallback;
            if (allowed && !allowed.includes(value)) return fallback;
            return value;
        },
        [searchParams],
    );

    /**
     * Write several params at once. Passing null/undefined/"" removes a param,
     * which keeps default values out of the URL.
     */
    const setParams = useCallback(
        (updates: Record<string, ParamValue>) => {
            const next = new URLSearchParams(searchParams.toString());

            console.log({ searchParams: searchParams.toString(), next });

            for (const [key, value] of Object.entries(updates)) {
                if (value === null || value === undefined || value === "") {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            }

            const queryString = next.toString();
            router.push(queryString ? `${pathname}?${queryString}` : pathname);
        },
        [router, pathname, searchParams],
    );

    return { searchParams, getParam, setParams };
}
