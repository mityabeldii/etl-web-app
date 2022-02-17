/*eslint-disable*/
import { useState, useEffect, useRef } from "react";

import Input from "./input";

import mask from "../../utils/mask-helper";

const FormatedInput = (props) => {
    const { format = `DD.MM.YYYY`, pattern = /[\>]*/g, value: propsValue = ``, onChange = () => {} } = props;
    const [localValue, setLocalValue] = useState(propsValue ?? ``);
    useEffect(() => {
        if (mask.isFullFilled(localValue, mask.create(format)) || localValue === ``) {
            onChange({ target: { value: localValue } });
        }
    }, [localValue]);
    useEffect(() => {
        if (propsValue !== localValue) {
            setLocalValue(propsValue);
        }
    }, [propsValue]);
    return (
        <Input
            {...props}
            value={localValue ?? ``}
            onChange={(e) => {
                const afterPattern = e.target.value.replaceAll(pattern, ``);
                setLocalValue(mask.mask(afterPattern, mask.create(format)));
            }}
        />
    );
};

export default FormatedInput;
/*eslint-enable*/
