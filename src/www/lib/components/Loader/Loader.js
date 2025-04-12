import { jsx as _jsx } from "preact/jsx-runtime";
const Loader = ({ variant = "page", ...props }) => {
    return (_jsx("div", { id: "lum-loader", class: `lum-loader ${variant}`, children: _jsx("div", { id: "loader", class: "loader", children: "Loading..." }) }));
};
export default Loader;
