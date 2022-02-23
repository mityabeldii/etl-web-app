/*eslint-disable*/
import _ from "lodash";

import { getStorage, putStorage } from "hooks/useStorage";

const ModalsService = {
    // TODO: Add all modal names to EModals enum and remove "string" from name types
    showModal: (name: string | EModals, state?: any) => {
        putStorage(`modals.${name}.shouldMount`, true);
        putStorage(`modals.${name}.state`, state);
        setTimeout(() => {
            putStorage(`modals.${name}.isOpened`, true);
        }, 0);
    },
    hideModal: (name: string | EModals) => {
        const preventClosing = getStorage((state: any) => _.get(state, `modals.${name}.preventClosing`));
        if (!preventClosing) {
            putStorage(`modals.${name}.isOpened`, false);
            setTimeout(() => {
                putStorage(`modals.${name}.shouldMount`, false);
            }, 200);
        }
    },
    getModalData: (name: string | EModals) => {
        getStorage((state: any) => _.get(state, `modals.${name}`));
    },
    hideAllModals: () => {
        const modals = getStorage((state: any) => _.keys(_.get(state, "modals")) ?? []);
        Object.keys(modals).forEach((key) => {
            ModalsService.hideModal(key);
        });
    },
};

export enum EModals {}

export default ModalsService;
/*eslint-enable*/
