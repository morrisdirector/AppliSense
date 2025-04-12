import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { AlertWarningType } from "./IAlertWarningProps";
import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
const AlertWarning = ({ closable = false, autoClose = false, type = AlertWarningType.INFO, icon, margin, text, autoCloseDuration = 5, ...props }) => {
    const [closed, setClosed] = useState(false);
    const [autoCloseTimer, setAutoCloseTimer] = useState(null);
    useEffect(() => {
        if (autoClose && !autoCloseTimer) {
            setAutoCloseTimer(setTimeout(() => {
                setClosed(true);
            }, autoCloseDuration * 1000));
        }
    }, [autoClose, autoCloseDuration]);
    return (_jsx(Fragment, { children: !closed && (_jsx("div", { class: `lum-AlertWarning${icon && icon.length ? " icon" : ""}${margin && margin.length ? ` margin-${margin}` : ""}${autoClose ? ` autoClose` : ""}`, children: _jsxs("div", { id: "message", class: type, children: [autoClose && (_jsx("div", { class: "timeout-indicator", style: { animationDuration: autoCloseDuration + "s" } })), icon && icon.length && (_jsx("span", { class: `icon ${icon}`, children: _jsx("span", {}) })), _jsx("span", { class: "text", children: text }), closable && (_jsx("button", { class: "close", onClick: () => {
                            setClosed(true);
                        }, children: "x" }))] }) })) }));
};
export default AlertWarning;
