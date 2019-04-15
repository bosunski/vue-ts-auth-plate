const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Manage the how Access Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instance.
 *
 */
const TokenService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    saveToken(accessToken: string): void {
        localStorage.setItem(TOKEN_KEY, accessToken);
    },

    removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    },

    getRefreshToken(): string|null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    saveRefreshToken(refreshToken: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    removeRefreshToken(): void {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};

export { TokenService };
