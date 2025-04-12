import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Conf } from "../../../lib/interfaces/IConfigJson";
import { Fragment } from "preact";
import { getIPConfigObject, getIPStringFromValues, isIPAddress, } from "../../../lib/utils/utils";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useState } from "preact/hooks";
const NetworkSetup = ({ page = "app", config = {}, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showAPPassword, setShowAPPassword] = useState(false);
    const handleIpChange = (value, blur = false, key = "IP") => {
        if (typeof props.onConfigUpdate === "function") {
            if (isIPAddress(value)) {
                const ipObj = getIPConfigObject(value);
                if (ipObj) {
                    props.onConfigUpdate({
                        ...config,
                        //@ts-ignore
                        [Conf[`NETWORK_${key}1`]]: ipObj.a,
                        //@ts-ignore
                        [Conf[`NETWORK_${key}2`]]: ipObj.b,
                        //@ts-ignore
                        [Conf[`NETWORK_${key}3`]]: ipObj.c,
                        //@ts-ignore
                        [Conf[`NETWORK_${key}4`]]: ipObj.d,
                    });
                }
            }
            else if (blur) {
                props.onConfigUpdate({
                    ...config,
                });
            }
        }
    };
    const handleDhcpToggle = () => {
        if (typeof props.onConfigUpdate === "function") {
            props.onConfigUpdate({
                ...config,
                [Conf.NETWORK_DHCP]: !config[Conf.NETWORK_DHCP],
            });
        }
    };
    return (_jsxs(Fragment, { children: [_jsx("section", { children: _jsxs("div", { class: "grid-large", children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "ssid", children: "Network SSID" }), _jsx(Input, { id: "ssid", value: config[Conf.NETWORK_SSID] || undefined, maxLength: 40, onChange: (value) => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.NETWORK_SSID]: value,
                                            });
                                        }
                                    } }), _jsx("div", { class: "helper-text", children: "Max 40 characters" })] }), _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "password", children: "Network Password" }), _jsxs("div", { class: "flex-stretch", children: [_jsxs("div", { class: "flex-grow", children: [_jsx(Input, { id: "password", type: !showPassword && page === "app" ? "password" : "string", value: config[Conf.NETWORK_PASS] || undefined, maxLength: 20, onChange: (value) => {
                                                        if (typeof props.onConfigUpdate === "function") {
                                                            props.onConfigUpdate({
                                                                ...config,
                                                                [Conf.NETWORK_PASS]: value,
                                                            });
                                                        }
                                                    } }), _jsx("div", { class: "helper-text", children: "Max 20 characters" })] }), page === "app" && (_jsx("button", { type: "button", class: "ml-small", onClick: () => {
                                                setShowPassword(!showPassword);
                                            }, children: showPassword ? "Hide" : "Show" }))] })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "ip", children: "Static IP" }), _jsx(Input, { disabled: config[Conf.NETWORK_DHCP], value: getIPStringFromValues(config[Conf.NETWORK_IP1], config[Conf.NETWORK_IP2], config[Conf.NETWORK_IP3], config[Conf.NETWORK_IP4]) || "", onChange: handleIpChange, onBlur: (value) => {
                                        handleIpChange(value, true);
                                    } }), _jsx("div", { class: "helper-text", children: "Static IPv4 address on the local network." })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "ip", children: "Use DHCP" }), _jsx(ToggleSwitch, { onClick: handleDhcpToggle, on: config[Conf.NETWORK_DHCP] })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "ip", children: "Gateway" }), _jsx(Input, { disabled: config[Conf.NETWORK_DHCP], value: getIPStringFromValues(config[Conf.NETWORK_GATEWAY1], config[Conf.NETWORK_GATEWAY2], config[Conf.NETWORK_GATEWAY3], config[Conf.NETWORK_GATEWAY4]) || "", onChange: (value) => {
                                        handleIpChange(value, false, "GATEWAY");
                                    }, onBlur: (value) => {
                                        handleIpChange(value, true, "GATEWAY");
                                    } })] }), _jsx("div", {}), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "ip", children: "Subnet" }), _jsx(Input, { disabled: config[Conf.NETWORK_DHCP], value: getIPStringFromValues(config[Conf.NETWORK_SUBNET1], config[Conf.NETWORK_SUBNET2], config[Conf.NETWORK_SUBNET3], config[Conf.NETWORK_SUBNET4]) || "", onChange: (value) => {
                                        handleIpChange(value, false, "SUBNET");
                                    }, onBlur: (value) => {
                                        handleIpChange(value, true, "SUBNET");
                                    } })] })] }) }), _jsx("section", { children: _jsx("div", { class: "grid-large", children: _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "ssid", children: "Access Point Security Password" }), _jsxs("div", { class: "flex-stretch", children: [_jsxs("div", { class: "flex-grow", children: [_jsx(Input, { id: "apPass", maxLength: 20, type: !showAPPassword && page === "app" ? "password" : "string", value: config[Conf.ACCESS_POINT_PASS] || undefined, onChange: (value) => {
                                                    if (typeof props.onConfigUpdate === "function") {
                                                        props.onConfigUpdate({
                                                            ...config,
                                                            [Conf.ACCESS_POINT_PASS]: value,
                                                        });
                                                    }
                                                } }), _jsx("div", { class: "helper-text", children: "Max 20 characters" })] }), page === "app" && (_jsx("button", { type: "button", class: "ml-small", onClick: () => {
                                            setShowAPPassword(!showAPPassword);
                                        }, children: showAPPassword ? "Hide" : "Show" }))] }), _jsxs("div", { class: "helper-text", children: ["Password for the setup access point", page === "setup" ? " (this page) " : " ", "when Lumenator cannot connect to the network."] })] }) }) })] }));
};
export default NetworkSetup;
