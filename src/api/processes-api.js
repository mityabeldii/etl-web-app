/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { GETOptions, handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";

import { TABLES } from "../constants/config";
import { mergeStorage, putStorage } from "../hooks/useStorage";

const ProcessesAPI = {
    async getProcesses() {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/process/filter`, GETOptions(`PROCESSES_LIST`))).data;
                const { data = [], offset = 0, limit = 10, totalCount = 0 } = response;
                mergeStorage(`tables.${TABLES.PROCESSES_LIST}`, {
                    rows: data,
                    pagination: {
                        currentPage: offset / limit,
                        perPage: limit,
                        totalCount,
                    },
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
                const response = (await axios.post(`/process`, _.omit(data, [`id`]))).data;
                await ProcessesAPI.getProcesses();
                handleSuccess({ message: `Процесс успешно сохранен` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async updateProcess(data) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`/process/${data?.id}`, data)).data;
                await ProcessesAPI.getProcesses();
                handleSuccess({ message: `Процесс успешно обновлен` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async deleteProcess(id) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.delete(`/process/${id}`)).data;
                await ProcessesAPI.getProcesses();
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async getProcessById(id) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/process/${id}`)).data;
                mergeStorage(`processes.${id}`, response);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async getProcessTasks(processId) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/process/${processId}/tasks`)).data;
                putStorage(`processes.${processId}.tasks`, response?.sort?.((a, b) => a?.taskQueue - b?.taskQueue) ?? []);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async createTask(processId, data) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`/process/${processId}/tasks`, _.omit(data, [`id`]))).data;
                await ProcessesAPI.getProcessTasks(processId);
                handleSuccess({ message: `Задача успешно сохранена` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async updateTask(processId, data) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`/process/${processId}/tasks/${data?.id}`, _.omit(data, [`id`]))).data;
                await ProcessesAPI.getProcessTasks(processId);
                handleSuccess({ message: `Задача успешно обновленна` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async deleteTask(processId, taskId) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.delete(`/process/${processId}/tasks/${taskId}`)).data;
                await ProcessesAPI.getProcessTasks(processId);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async manualStart(processId) {
        handleSuccess({ message: `Процесс с id ${processId} запущен` });
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`/process/${processId}/process-runs`)).data;
                await ProcessesAPI.getProcessTasks(processId);
                // handleSuccess([response]);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
    async getProcessesForFilter() {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/process/process-names`)).data;
                putStorage(`temp.processesToFilter`, response);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
};

export default ProcessesAPI;

/*eslint-enable*/
