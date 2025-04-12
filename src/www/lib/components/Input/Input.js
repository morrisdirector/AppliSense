import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { strValToNumber } from "../../utils/utils";
const Input = (props) => {
    const getEventValue = (event) => {
        const strValue = event.target.value;
        return props.type === "number"
            ? strValToNumber(strValue)
            : strValue.slice(0, props.maxLength || 500);
    };
    const handleChange = (event) => {
        const val = getEventValue(event);
        if (typeof props.onChange === "function") {
            props.onChange(val);
        }
    };
    const handleBlur = (event) => {
        const val = getEventValue(event);
        if (typeof props.onBlur === "function") {
            props.onBlur(val);
        }
    };
    const handleKeypress = (event) => {
        if (event.key === "Enter" && typeof props.onEnter === "function") {
            props.onEnter(getEventValue(event));
        }
    };
    return (_jsxs("div", { class: `lum-Input${props.disabled ? " disabled" : ""}`, children: [_jsx("input", { disabled: props.disabled, type: props.type, class: "lum-Input-input", value: props.value, onInput: handleChange, onBlur: handleBlur, onKeyPress: handleKeypress }), props.children] }));
};
export default Input;
