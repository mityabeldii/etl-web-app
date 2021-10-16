/*eslint-disable*/
import axios from 'axios'

import { API_URL } from '../constants/config';

import { handleError, handleSuccess, loadingCounterWrapper } from '../utils/api-helper';

import { putStorage, clearStorage, getStorage } from '../hooks/useStorage'
import { linkTo, sleep } from '../utils/common-helper';

const UserAPI = {

    async getCurrentUser() {
        await loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${API_URL}/api/Authenticate/get-userinfo-bytoken`)).data;
                putStorage(`user`, response);
                return response;
            } catch (error) {
                localStorage.removeItem(`auth_token_gnx`)
                clearStorage()
            } finally {
                putStorage(`temp.initialized`, true)
            }
        })
    },

    async login(email, password) {
        await loadingCounterWrapper(async () => {
            try {
                let { token } = (await axios.post(`${API_URL}/api/Authenticate/login`, { email, password }))?.data;
                if (token) {
                    if (getStorage(state => state?.temp?.remember_me === true)) {
                        localStorage.setItem(`prev_gnx_session`, JSON.stringify({ email, token }))
                    } else {
                        localStorage.removeItem(`prev_gnx_session`)
                    }
                    localStorage.setItem(`auth_token_gnx`, token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    localStorage.removeItem(`auth_token_gnx`)
                    throw new Error(`There is no auth token in login endpoint response`)
                }
                await UserAPI.getCurrentUser();
                return token;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async logout() {
        await loadingCounterWrapper(async () => {
            try {
                localStorage.removeItem(`auth_token_gnx`);
                clearStorage()
                putStorage(`temp.initialized`, true)
                delete axios.defaults.headers.common['Authorization'];
                linkTo(`/`)
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async changePassword(credentials) {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.put(`${API_URL}/api/Authenticate/change-userinfo`, {}, { params: { id: credentials?.id, password: credentials?.newPassword } }));
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async restoreSession(email, token) {
        await loadingCounterWrapper(async () => {
            try {
                if (getStorage(state => state?.temp?.remember_me === true)) {
                    localStorage.setItem(`prev_gnx_session`, JSON.stringify({ email, token }))
                } else {
                    localStorage.removeItem(`prev_gnx_session`)
                }
                localStorage.setItem(`auth_token_gnx`, token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await UserAPI.getCurrentUser();
            } catch (error) {

            }
        })
    },

    async sendRecoverPasswordEmail(email) {
        await loadingCounterWrapper(async () => {
            try {
                // const response = (await axios.post(`${API_URL}/api/Authenticate/send-recover-password-email`, { email })).data;
                // handleSuccess(response);
                const response = await sleep(1000);
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async recoverPasswordByCode(code, password) {
        await loadingCounterWrapper(async () => {
            try {
                // const response = (await axios.post(`${API_URL}/api/Authenticate/recover-password-by-code`, { code, password })).data;
                // handleSuccess(response);
                const response = await sleep(1000);
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

};

export default UserAPI;
/*eslint-enable*/