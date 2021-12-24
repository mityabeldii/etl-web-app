/*eslint-disable*/
import _ from "lodash";
import { useEffect } from "react";

import ModalsHelper from "../utils/modals-helper";

import { putStorage, useStorageListener } from "./useStorage";

const useModal = (name, options) => {
    const { onOpen = () => {}, onClose = () => {} } = options ?? {};

    const modal = useStorageListener((state) => _.get(state, `modals.${name}`) ?? {});
    const { isOpened = false, preventClosing = false, state = {} } = modal;

    useEffect(() => {
        if (isOpened) {
            onOpen?.(state);
        } else {
            onClose?.();
        }
    }, [isOpened]);

    const handlers = {
        open: () => ModalsHelper.showModal(name),
        close: () => !preventClosing && ModalsHelper.hideModal(name),
        setPreventClosing: (newValue) => putStorage(`modals.${name}.preventClosing`, newValue),
    };

    return { name, ...modal, ...handlers };
};

export default useModal;
/*eslint-enable*/
