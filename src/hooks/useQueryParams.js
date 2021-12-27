/*eslint-disable*/
import { useEffect } from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { QSToObject, objectToQS, linkTo } from "../utils/common-helper";

// ETL-ONLY
import { PROCESS_STATUSES } from "../constants/config"; 
export const etlOnlyParams = (params) => {
    if (params?.code?.split?.(`.`)?.length === 3) {
        params = _.omit(params, [`code`, `session_state`]);
        if (!_.keys(PROCESS_STATUSES)?.includes(params.state)) {
            params = _.omit(params, [`state`]);
        }
    }
    return params;
};

const useQueryParams = () => {
    const { search, pathname } = useLocation();
    const params = QSToObject(search);
    const setParams = (newParams) => {
        linkTo(`${pathname}${objectToQS(_.pickBy(newParams, _.identity))}`);
    };
    const clearParams = () => {
        linkTo(`${pathname}`);
    };
    const setByKey = (key, value) => {
        linkTo(`${pathname}${objectToQS(_.pickBy({ ...params, [key]: value }, _.identity))}`);
    };
    const removeParam = (key) => {
        linkTo(`${pathname}${objectToQS(_.omit(params, key))}`);
    };
    useEffect(() => {
        setParams(etlOnlyParams(params));
    }, [params])
    return { params, setParams, clearParams, setByKey, removeParam };
};

export default useQueryParams;
/*eslint-enable*/
