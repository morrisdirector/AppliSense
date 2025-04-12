import { jsx as _jsx } from "preact/jsx-runtime";
const Progress = ({ progress = 0, ...props }) => {
    return (_jsx("div", { class: "lum-Progress", children: _jsx("div", { class: "progress-bar", style: { width: `${progress}%` } }) }));
};
export default Progress;
