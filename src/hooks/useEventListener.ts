/*eslint-disable*/
import { useEffect } from "react";

const useEventListener = (key: any, handler: any, options?: any) => {
    useEffect(() => {
        window.addEventListener(key, handler, options);
        return () => {
            window.removeEventListener(key, handler, options);
        };
    });
};

export const eventDispatch = (key: any, detail?: any) => {
    window.dispatchEvent(new CustomEvent(key, { detail }));
};

export default useEventListener;
/*eslint-enable*/
