/*eslint-disable*/
import axios from 'axios'

import { API_URL } from '../constants/config';

import { handleError, loadingCounterWrapper } from '../utils/api-helper';

import { putStorage, clearStorage } from '../hooks/useStorage'

const PropertyAPI = {

    async getPropertyOwners(size, offset) {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/propertyowner/${size}/${offset}`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getPOCount() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/propertyowner/count`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getProperties() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/Property/properties/${size}/${offset}`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getPropertyCount() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/Property/properties/count`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getTasks() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/Tasks/part/${size}/${offset}`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getTasksCount() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/Tasks/count`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getTasksWithoutCompleted() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/Tasks/withoutcompleted/${size}/${offset}`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getTasksWithoutCompletedCount() {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.get(`${API_URL}/api/Tasks/withoutcompleted/count`)).data;
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getPropertyOwnerData(options = {}) {
        try {
            let response = (await axios.post(`${API_URL}/api/PropertyOwner/get-some-sorted-and-filtered-info`, options)).data;
            putStorage(`data.property-owner`, response?.items)
            putStorage(`pagination.property-owner`, response?._meta)
            return response;
        } catch (error) {
            throw handleError(error)
        }
    },

    async getPropertyData(options = {}) {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.post(`${API_URL}/api/Property/get-some-sorted-and-filtered-info`, options)).data;
                putStorage(`data.property`, response?.items)
                putStorage(`pagination.property`, response?._meta)
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

    async getTasksData(options = {}) {
        await loadingCounterWrapper(async () => {
            try {
                let response = (await axios.post(`${API_URL}/api/Tasks/get-some-sorted-and-filtered-info`, options)).data;
                putStorage(`data.tasks`, response?.items)
                putStorage(`pagination.tasks`, response?._meta)
                return response;
            } catch (error) {
                throw handleError(error)
            }
        })
    },

};

export default PropertyAPI;
/*eslint-enable*/