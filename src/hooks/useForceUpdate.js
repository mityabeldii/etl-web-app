/*eslint-disable*/
import { useState } from "react";

const useForceUpdate = () => {
    const [updateTimestamp, setUpdateTimestamp] = useState(0);
    return () => {
        setUpdateTimestamp(+new Date());
    };
};

export default useForceUpdate;
/*eslint-enable*/