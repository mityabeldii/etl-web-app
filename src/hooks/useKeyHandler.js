/*eslint-disable*/
import { useEffect } from "react";

const useKeyHandler = (key, handlerFunction) => {
    useEffect(() => {
        const handler = (e) => {
            if (document?.activeElement?.tagName?.toLowerCase?.() !== `input`) {
                if (e?.code === key) {
                    e?.preventDefault?.();
                    handlerFunction?.();
                }
            }
        };
        window.addEventListener(`keydown`, handler);
        return () => {
            window.removeEventListener(`keydown`, handler);
        };
    });
};

export default useKeyHandler;
/*eslint-enable*/
