/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep } from "../utils/common-helper";

const ProcessesAPI = {
    async getProcesses() {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/process`)).data;
                putStorage(`tables.${TABLES.PROCESSES_LIST}`, {
                    rows: response,
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async createProcess(data) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`${base_url}/process`, _.omit(data, [`id`]))).data;
                await ProcessesAPI.getProcesses();
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async updateProcess(data) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`${base_url}/process/${data?.id}`, data)).data;
                await ProcessesAPI.getProcesses();
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async deleteProcess(id) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.delete(`${base_url}/process/${id}`)).data;
                await ProcessesAPI.getProcesses();
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
};

export default ProcessesAPI;

/*eslint-enable*/
