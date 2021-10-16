/*eslint-disable*/
import { useState, useEffect } from "react";

const useComponentSize = (ref) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        setSize({ width: ref?.current?.scrollWidth ?? 0, height: ref?.current?.scrollHeight ?? 0 });
    }, [ref]);
    return size;
};

export default useComponentSize;
/*eslint-enable*/
