import ApiService from '@/services/ApiService';
import {TokenService} from '@/services/TokenService';
import AuthenticationError from '@/exceptions/AuthentocationError';

class UserService {

    public static async login(email: string, password: string): Promise<string> {
        const requestData = {
            method: 'post',
            url: '/login',
            data: {
                grant_type: 'password',
                username: email,
                password,
            },
            auth: {
                username: process.env.VUE_APP_CLIENT_ID,
                password: process.env.VUE_APP_CLIENT_SECRET,
            },
        };

        try {
            const response = await ApiService.customRequest(requestData);

            TokenService.saveToken(response.data.access_token);
            TokenService.saveRefreshToken(response.data.refresh_token);
            ApiService.setHeader();

            ApiService.mount401Interceptor();

            return response.data.access_token;
        } catch (e) {
            throw new AuthenticationError(e.response.status, e.response.data.detail);
        }
    }

    public static async refreshToken(): Promise<void> {
        const refreshToken = TokenService.getRefreshToken();

        const requestData = {
            method: 'post',
            url: '/token',
            data: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            auth: {
                username: process.env.VUE_APP_CLIENT_ID,
                password: process.env.VUE_APP_CLIENT_SECRET,
            },
        };

        try {
            const response = await ApiService.customRequest(requestData);

            TokenService.saveToken(response.data.access_token);
            TokenService.saveRefreshToken(response.data.refresh_token);
            // Update the header in ApiService
            ApiService.setHeader();

            return response.data.access_token;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail);
        }
    }

    public static logout(): void {
        TokenService.removeToken();
        TokenService.removeRefreshToken();
        ApiService.removeHeader();

        ApiService.unmount401Interceptor();
    }
}

export default UserService;
