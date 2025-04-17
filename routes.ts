/**
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
    "/",
];


/**
 * An array of routes that are used for authentication
 * these routes will redirect logged in users to /settings
 * @type {string[]} 
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
]


/**
 * the prefix for API authentication routes
 * Routes that start with this prefix are used for API
 * authentication purposed
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";


/**
 * The default redirect path after logining in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";

