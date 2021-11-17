/*eslint-disable*/
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { QSToObject, objectToQS, linkTo } from "../utils/common-helper";

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
    return { params, setParams, clearParams, setByKey };
};

export default useQueryParams;
/*eslint-enable*/
