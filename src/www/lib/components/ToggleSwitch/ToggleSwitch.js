import { jsx as _jsx } from "preact/jsx-runtime";
const ToggleSwitch = (props) => {
    const renderStateClass = () => {
        if (props.on !== undefined) {
            return !!props.on ? "ON" : "OFF";
        }
        return "OFF";
    };
    return (_jsx("div", { class: "lum-ToggleSwitch " +
            renderStateClass() +
            (props.disabled ? " disabled" : ""), 
        // ontouchstart="return true;"
        onClick: () => {
            if (typeof props.onClick === "function" && !props.disabled) {
                props.onClick(!props.on);
            }
        }, children: _jsx("div", { class: "circle" }) }));
};
export default ToggleSwitch;
