import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Fragment } from "preact";
import { strValToNumber } from "../../utils/utils";
import { useState } from "preact/hooks";
const DropdownMenu = (props) => {
    const [selectedValue, setSelectedValue] = useState(props.value);
    return (_jsxs("div", { class: `lum-DropdownMenu${props.disabled ? " disabled" : ""}`, children: [_jsxs("select", { disabled: props.disabled, value: props.value, class: props.placeholder &&
                    props.value === undefined &&
                    selectedValue === undefined
                    ? "placeholder"
                    : "", onChange: (event) => {
                    const strValue = event.target.value;
                    const val = props.type === "number" ? strValToNumber(strValue) : strValue;
                    setSelectedValue(val);
                    if (typeof props.onSelect === "function") {
                        props.onSelect(val);
                    }
                }, children: [props.placeholder && (_jsxs(Fragment, { children: [_jsx("option", { value: "", disabled: true, selected: true, children: props.placeholder }), _jsx("option", { value: "", disabled: true, children: "---------------------------" })] })), props.children] }), _jsx("div", { class: "dropdown-indicator" })] }));
};
export default DropdownMenu;
