/*eslint-disable*/
import _ from "lodash";

import { getStorage, putStorage } from "../hooks/useStorage";

const ModalsHelper = {
    showModal: (name, state) => {
        putStorage(`modals.${name}.shouldMount`, true);
        putStorage(`modals.${name}.state`, state);
        setTimeout(() => {
            putStorage(`modals.${name}.isOpened`, true);
        }, 0);
    },
    hideModal: (name) => {
        const preventClosing = getStorage((state) => _.get(state, `modals.${name}.preventClosing`));
        if (!preventClosing) {
            putStorage(`modals.${name}.isOpened`, false);
            setTimeout(() => {
                putStorage(`modals.${name}.shouldMount`, false);
            }, 200);
        }
    },
    getModalData: (name) => {
        getStorage((state) => _.get(state, `modals.${name}`));
    },
    hideAllModals: () => {
        const modals = getStorage((state) => _.keys(_.get(state, "modals")) ?? []);
        Object.keys(modals).forEach((key) => {
            ModalsHelper.hideModal(key);
        });
    },
};

export default ModalsHelper;
/*eslint-enable*/
