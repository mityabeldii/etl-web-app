/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { handleError, loadingCounterWrapper } from "../utils/api-helper";

import { putStorage } from "../hooks/useStorage";

const UserAPI = {
    getContexts(token) {
        return loadingCounterWrapper(async () => {
            try {
                const { contexts } = (
                    await axios.get(`https://dev.sciencenet.ru/platform-security/settings/users/current-user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ).data;
                putStorage(`user.contexts`, contexts);
                return contexts;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },
};

export default UserAPI;
/*eslint-enable*/
