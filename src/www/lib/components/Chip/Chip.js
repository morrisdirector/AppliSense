import { jsx as _jsx } from "preact/jsx-runtime";
const Chip = ({ variant = "primary", margin = false, ...props }) => {
    return (_jsx("div", { class: `lum-Chip ${variant}${margin ? " margin-small" : ""}`, children: props.text || props.children }));
};
export default Chip;
