/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { GETOptions, handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep, objectToQS } from "../utils/common-helper";
import DatasourceAPI from "./datasource-api";

const EventLogAPI = {
    getEvents: () => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/event-log`, GETOptions(`EVENT_LOG`))).data;
                const { data = [], offset = 0, limit = 10, totalCount = 0 } = response;
                mergeStorage(`tables.${TABLES.EVENT_LOG}`, {
                    rows: data,
                    pagination: {
                        currentPage: offset / limit,
                        perPage: limit,
                        totalCount,
                    },
                });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },
};

export default EventLogAPI;
/*eslint-enable*/
