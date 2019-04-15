import axios from 'axios';
import { TokenService } from '@/services/TokenService';
import store from '@/store';

const ApiService = {

    init(baseURL: string) {
        axios.defaults.baseURL = baseURL;
    },

    setHeader() {
        axios.defaults.headers.common.Authorization = `Bearer ${TokenService.getToken()}`;
    },

    removeHeader() {
        axios.defaults.headers.common = {};
    },

    get(resource: string) {
        return axios.get(resource);
    },

    post(resource: string, data: object) {
        return axios.post(resource, data);
    },

    put(resource: string, data: object) {
        return axios.put(resource, data);
    },

    delete(resource: string) {
        return axios.delete(resource);
    },

    /**
     * Perform a custom Axios request.
     *
     * data is an object containing the following properties:
     *  - method
     *  - url
     *  - data ... request payload
     *  - auth (optional)
     *    - username
     *    - password
     *
     */
    customRequest(data: object) {
        return axios(data);
    },
    _401interceptor: null as unknown as number,

    mount401Interceptor() {
        this._401interceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.request.status === 401) {
                    if (error.config.url.includes('/token')) {
                        // Refresh token has failed. Logout the user
                        await store.dispatch('auth/logout');

                        throw error;
                    } else {
                        // Refresh the access token
                        try {
                            await store.dispatch('auth/refreshToken');
                            // Retry the original request
                            return this.customRequest({
                                method: error.config.method,
                                url: error.config.url,
                                data: error.config.data,
                            });
                        } catch (e) {
                            // Refresh has failed - reject the original request
                            throw error;
                        }
                    }
                }

                // If error was not 401 just reject as is
                throw error;
            },
        );
    },

    unmount401Interceptor() {
        // Eject the interceptor
        axios.interceptors.response.eject(this._401interceptor);
    },
};

export default ApiService;
