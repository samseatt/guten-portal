// One browser API root. NEXT_PUBLIC_* settings are public and embedded by Next.js.
// Keep the older /api/guten setting compatible during local configuration migration.
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL
  || process.env.NEXT_PUBLIC_GUTEN_CRUST_URL?.replace(/\/guten\/?$/, "")
  || "http://localhost:8000/api").replace(/\/$/, "");
