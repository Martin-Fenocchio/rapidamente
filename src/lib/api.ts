// Temporary same-origin bridge to the existing NestJS API. No production fallback.
export const API_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/legacy`;
