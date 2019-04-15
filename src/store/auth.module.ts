import {TokenService} from '@/services/TokenService';
import UserService from '@/services/UserService';
import router from '@/router';
import AuthenticationError from '@/exceptions/AuthentocationError';

const baseState =  {
    authenticating: false,
    accessToken: TokenService.getToken(),
    authenticationErrorCode: 0,
    authenticationError: '',
    refreshTokenPromise: null,
};

const getters = {
    loggedIn: (state: any) => {
        return !!state.accessToken;
    },

    authenticationErrorCode: (state: any) => {
        return state.authenticationErrorCode;
    },

    authenticationError: (state: any) => {
        return state.authenticationError;
    },

    authenticating: (state: any) => {
        return state.authenticating;
    },
};

const actions = {
    async login({ commit }: any, {email, password}: {email: string, password: string}) {
        commit('loginRequest');

        try {
            const token = await UserService.login(email, password);
            commit('loginSuccess', token);

            // Redirect the user to the page he first tried to visit or to the home view
            // @ts-ignore
            router.push(router.history.current.query.redirect || '/');

            return true;
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('loginError', {errorCode: e.errorCode, errorMessage: e.message});
            }

            return false;
        }
    },

    logout({ commit }: {commit: any}) {
        UserService.logout();
        commit('logoutSuccess');
        router.push('/login');
    },

    refreshToken({ commit, state }: {commit: any, state: any}) {
        // If this is the first time the refreshToken has been called, make a request
        // otherwise return the same promise to the caller
        if (!state.refreshTokenPromise) {
            const p = UserService.refreshToken();
            commit('refreshTokenPromise', p);

            // Wait for the UserService.refreshToken() to resolve. On success set the token and clear promise
            // Clear the promise on error as well.
            p.then(
                (response) => {
                    commit('refreshTokenPromise', null);
                    commit('loginSuccess', response);
                },
                (error) => {
                    commit('refreshTokenPromise', null);
                },
            );
        }

        return state.refreshTokenPromise;
    },
};

const mutations = {
    loginRequest(state: any) {
        state.authenticating = true;
        state.authenticationError = '';
        state.authenticationErrorCode = 0;
    },

    loginSuccess(state: any, accessToken: string) {
        state.accessToken = accessToken;
        state.authenticating = false;
    },

    loginError(state: any, {errorCode, errorMessage}: {errorCode: number, errorMessage: string}) {
        state.authenticating = false;
        state.authenticationErrorCode = errorCode;
        state.authenticationError = errorMessage;
    },

    logoutSuccess(state: any) {
        state.accessToken = '';
    },
    refreshTokenPromise(parameters: { state: any, promise: any }) {
        const {state, promise} = parameters;
        state.refreshTokenPromise = promise;
    },
};

export const auth = {
    namespaced: true,
    baseState,
    getters,
    actions,
    mutations,
};
