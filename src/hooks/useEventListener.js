/*eslint-disable*/
import { useEffect } from 'react';

const useEventListener = (key, handler, options) => {
    useEffect(() => {
        window.addEventListener(key, handler, options);
        return () => {
            window.removeEventListener(key, handler, options);
        };
    });
};

export const eventDispatch = (key, detail) => {
    window.dispatchEvent(new CustomEvent(key, { detail }));
};

export default useEventListener;
/*eslint-enable*/
