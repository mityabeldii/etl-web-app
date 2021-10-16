/*eslint-disable*/
import axios from "axios";

import { API_URL, ROLES, TABLES } from "../constants/config";

import { handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";

import { putStorage, clearStorage, getStorage, mergeStorage } from "../hooks/useStorage";
import { createId, linkTo, sleep } from "../utils/common-helper";
import CaseHalper from "../utils/case-helper";

const UsersAPI = {
    async getUsers(size, offset) {
        try {
            const response = (await axios.get(`${API_URL}/api/Authenticate/users/${size}/${offset}`)).data;
            // putStorage(`users`, response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    async getUsersCount() {
        try {
            const response = (await axios.get(`${API_URL}/api/Authenticate/users/count`)).data;
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    async deleteUser(userName) {
        try {
            const response = (await axios.delete(`${API_URL}/api/Authenticate/delete/userbyname`, { params: { userName } })).data;
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    async getUsersPageData() {
        return loadingCounterWrapper(async () => {
            try {
                const options = POSTOptions(TABLES.USERS);
                const response = (await axios.get(`${API_URL}/api/${CaseHalper.toPascal(TABLES.USERS)}/get-some-sorted-and-filtered-info`, options)).data;
                mergeStorage(`tables.${TABLES.USERS}`, {
                    rows: response?.items ?? [],
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
};

export default UsersAPI;
/*eslint-enable*/
