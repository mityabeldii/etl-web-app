/*eslint-disable*/
import { useLocation } from "react-router-dom";
import { QSToObject } from "../utils/common-helper";

const useQueryParams = () => {
    const { search } = useLocation();
    const params = QSToObject(search);
    return params;
};

export default useQueryParams;
/*eslint-enable*/
