import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Convert a relative upload path to use the static file API route
 * This is necessary for Next.js standalone mode where public folder access doesn't work
 * @param url - The image URL, could be /uploads/filename or a full URL
 * @returns The corrected URL using API route if needed
 */
export function getStaticUrl(url: string | undefined): string {
    if (!url) return '';

    // Convert /uploads/ paths to use API route
    if (url.startsWith('/uploads/')) {
        return `/api/static${url}`;
    }

    // Return as-is for external URLs or other paths
    return url;
}
