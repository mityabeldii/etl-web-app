/*eslint-disable*/
import _ from "lodash";
import { useEffect } from "react";

import ModalsService, { EModals } from "services/modals-service";

import { putStorage, useStorageListener } from "hooks/useStorage";

const useModal = (name: string | EModals, options?: any) => {
    const { onOpen = () => {}, onClose = () => {} } = options ?? {};

    const modal = useStorageListener((state: any) => _.get(state, `modals.${name}`) ?? {});
    const { isOpened = false, preventClosing = false, state = {} } = modal;

    useEffect(() => {
        if (isOpened) {
            onOpen?.(state);
        } else {
            onClose?.();
        }
    }, [isOpened]);

    const handlers = {
        open: () => ModalsService.showModal(name),
        close: () => !preventClosing && ModalsService.hideModal(name),
        setPreventClosing: (newValue: boolean) => putStorage(`modals.${name}.preventClosing`, newValue),
    };

    return { name, ...modal, ...handlers };
};

export default useModal;
/*eslint-enable*/
