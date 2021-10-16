/*eslint-disable*/
import axios from "axios";

import { handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI } from "../utils/common-helper";

const HomeAPI = {
    async getHomePageData(name) {
        return loadingCounterWrapper(async () => {
            try {
                const options = POSTOptions(name);
                objectPut(
                    POSTOptions(name),
                    `params.query.filter.showComplete`,
                    getStorage((state) => state?.temp?.showComplete ?? false)
                );
                const response = (await axios.get(`${API_URL}/api/${CaseHalper.toPascal(name)}/get-some-sorted-and-filtered-info`, options)).data;
                mergeStorage(`tables.${name}`, {
                    rows: response?.items ?? [],
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async bulkExcel(name, ids = []) {
        return loadingCounterWrapper(async () => {
            try {
                const { fileName } = (
                    await axios.get(`${API_URL}/api/${CaseHalper.toPascal(name)}/excel`, { params: { ids: JSON.stringify(ids.map((i) => `${i}`)) } })
                ).data;
                downloadURI(fileName);
                return fileName;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async bulkNotify(ids = []) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`${API_URL}/api/Tasks/notify`, ids)).data;
                // TODO: Move this alert text to backend
                handleSuccess({ message: `Success` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async bulkUpdateStatuses(status, ids = []) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`${API_URL}/api/Tasks/update-status`, { ids: ids?.map?.((i) => `${i}`), status })).data;
                await HomeAPI.getHomePageData(`tasks`);
                // TODO: Move this alert text to backend
                handleSuccess({ message: `Success` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async bulkDownloadForms(ids = []) {
        return loadingCounterWrapper(async () => {
            try {
                const { fileName } = (
                    await axios.get(`${API_URL}/api/Tasks/download-forms`, { params: { ids: JSON.stringify(ids) } })
                ).data;
                downloadURI(fileName);
                return fileName;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
};

export default HomeAPI;

/*eslint-enable*/
