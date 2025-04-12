import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Conf } from "../../../lib/interfaces/IConfigJson";
import { Fragment } from "preact";
import { getIPConfigObject, getIPStringFromValues, isIPAddress, } from "../../../lib/utils/utils";
import Chip from "../../../lib/components/Chip/Chip";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useState } from "preact/hooks";
const MQTTSetup = ({ config = {}, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleMQTTEnable = () => {
        if (typeof props.onConfigUpdate === "function") {
            props.onConfigUpdate({
                ...config,
                [Conf.MQTT_ENABLED]: !config[Conf.MQTT_ENABLED],
            });
        }
    };
    const handleAutoDiscoveryEnable = () => {
        if (typeof props.onConfigUpdate === "function") {
            props.onConfigUpdate({
                ...config,
                [Conf.MQTT_AUTO_DISCOVERY]: !config[Conf.MQTT_AUTO_DISCOVERY],
            });
        }
    };
    const handleIpChange = (value, blur = false) => {
        if (typeof props.onConfigUpdate === "function") {
            if (isIPAddress(value)) {
                const ipObj = getIPConfigObject(value);
                if (ipObj) {
                    props.onConfigUpdate({
                        ...config,
                        [Conf.MQTT_IP1]: ipObj.a,
                        [Conf.MQTT_IP2]: ipObj.b,
                        [Conf.MQTT_IP3]: ipObj.c,
                        [Conf.MQTT_IP4]: ipObj.d,
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
    const isValidTopic = (str) => {
        if (!str) {
            return false;
        }
        return str.search(/^(?:[a-z0-9\_\-]*\/)*(?:[a-z0-9\_\-]+)+$/g) > -1;
    };
    const handleTopicChange = (value, blur = false) => {
        if (typeof props.onConfigUpdate === "function") {
            if (isValidTopic(value)) {
                props.onConfigUpdate({
                    ...config,
                    [Conf.MQTT_DEVICE_TOPIC]: value,
                });
            }
            else if (blur) {
                props.onConfigUpdate({
                    ...config,
                });
            }
        }
    };
    const isValidClientId = (str) => {
        if (!str) {
            return false;
        }
        return str.search(/^(?:[a-z0-9\_\-]*)$/g) > -1;
    };
    const handleClientIdChange = (value, blur = false) => {
        if (typeof props.onConfigUpdate === "function") {
            if (isValidClientId(value)) {
                props.onConfigUpdate({
                    ...config,
                    [Conf.MQTT_CLIENT_ID]: value,
                });
            }
            else if (blur) {
                props.onConfigUpdate({
                    ...config,
                });
            }
        }
    };
    return (_jsxs(Fragment, { children: [_jsxs("div", { class: "section-action", children: [_jsx(ToggleSwitch, { onClick: handleMQTTEnable, on: config[Conf.MQTT_ENABLED] }), _jsx("label", { children: "Enable MQTT" })] }), _jsx("section", { children: _jsxs("div", { class: "grid-large", children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "clientId", children: "Unique Client ID" }), _jsx(Input, { id: "clientId", disabled: !config[Conf.MQTT_ENABLED], value: config[Conf.MQTT_CLIENT_ID] || undefined, maxLength: 20, onChange: handleClientIdChange, onBlur: (value) => {
                                        handleClientIdChange(value, true);
                                    } }), _jsxs("div", { class: "helper-text", children: ["Max 20 characters. A unique ID for MQTT broker to identify the device. Alphanumeric characters, underscores, and dashes only. Example: ", _jsx("strong", { children: "bedroom_lamp1" })] })] }), _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "topic", children: "Home Assistant Auto Discovery" }), _jsx(ToggleSwitch, { disabled: !config[Conf.MQTT_ENABLED], onClick: handleAutoDiscoveryEnable, on: config[Conf.MQTT_AUTO_DISCOVERY] }), _jsxs("div", { class: "helper-text", children: ["Will add this device to your entites in Home Assistant automatically.", _jsx("br", {}), " See", " ", _jsx("a", { href: "https://www.home-assistant.io/docs/mqtt/discovery/", target: "_blank", children: "Home Assistant MQTT Discovery" }), " ", "for details."] })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "user", children: "User" }), _jsx(Input, { id: "user", disabled: !config[Conf.MQTT_ENABLED], maxLength: 40, value: config[Conf.MQTT_USER] || undefined, onChange: (value) => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.MQTT_USER]: value,
                                            });
                                        }
                                    } }), _jsx("div", { class: "helper-text", children: "Max 40 characters" })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "password", children: "Password" }), _jsxs("div", { class: "flex-stretch", children: [_jsxs("div", { class: "flex-grow", children: [_jsx(Input, { id: "password", maxLength: 20, disabled: !config[Conf.MQTT_ENABLED], type: !showPassword ? "password" : "string", value: config[Conf.MQTT_PASSWORD] || undefined, onChange: (value) => {
                                                        if (typeof props.onConfigUpdate === "function") {
                                                            props.onConfigUpdate({
                                                                ...config,
                                                                [Conf.MQTT_PASSWORD]: value,
                                                            });
                                                        }
                                                    } }), _jsx("div", { class: "helper-text", children: "Max 20 characters" })] }), _jsx("button", { type: "button", class: "ml-small", onClick: () => {
                                                setShowPassword(!showPassword);
                                            }, children: showPassword ? "Hide" : "Show" })] })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "ip", children: "MQTT Server IP" }), _jsx(Input, { disabled: !config[Conf.MQTT_ENABLED], value: getIPStringFromValues(config[Conf.MQTT_IP1], config[Conf.MQTT_IP2], config[Conf.MQTT_IP3], config[Conf.MQTT_IP4]) || "", onChange: handleIpChange, onBlur: (value) => {
                                        handleIpChange(value, true);
                                    } })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "port", children: "Port" }), _jsx(Input, { type: "number", disabled: !config[Conf.MQTT_ENABLED], value: config[Conf.MQTT_PORT] || undefined, onChange: (value) => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.MQTT_PORT]: value,
                                            });
                                        }
                                    } })] })] }) }), _jsx("section", { children: _jsxs("div", { class: "grid-large", children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "topic", children: "Device Base Topic" }), _jsx(Input, { id: "topic", maxLength: 40, disabled: !config[Conf.MQTT_ENABLED], value: config[Conf.MQTT_DEVICE_TOPIC] || undefined, onChange: handleTopicChange, onBlur: (value) => {
                                        handleTopicChange(value, true);
                                    } })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "topic" }), _jsxs("div", { class: "helper-text", children: ["Max 40 characters. The topic that all incoming and outgoing sub topics will be based on for this device. Example:", " ", _jsx("strong", { children: "upstairs/bedroom/lamp1" })] })] })] }) }), config[Conf.MQTT_DEVICE_TOPIC] && (_jsx("section", { children: _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { children: "MQTT Topics" }), _jsxs("table", { children: [_jsxs("tr", { class: "header-row", children: [_jsx("th", { children: "Topic" }), _jsx("th", { children: "Message" }), _jsx("th", { width: "100%", children: "Description" })] }), _jsxs("tr", { class: "first-row", children: [_jsx("td", { children: _jsx(Chip, { text: `${config[Conf.MQTT_DEVICE_TOPIC]}/avail` }) }), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: "online" }) }), _jsx("td", { children: "The birth message sent to the broker when Lumenator comes online." })] }), _jsxs("tr", { children: [_jsx("td", {}), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: "offline" }) }), _jsx("td", { children: "The message sent as the last will and testament." })] }), _jsxs("tr", { class: "new-group", children: [_jsx("td", { children: _jsx(Chip, { text: `${config[Conf.MQTT_DEVICE_TOPIC]}/state` }) }), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: "JSON" }) }), _jsxs("td", { children: ["This is the topic your broker should subscribe to for state updates. This follows the Home Assistant JSON schema for state.", _jsx("br", {}), _jsx("br", {}), " See", " ", _jsx("a", { href: "https://www.home-assistant.io/integrations/light.mqtt/#json-schema", target: "_blank", children: "MQTT Light - JSON Schema" }), " ", "for more details."] })] }), _jsxs("tr", { class: "new-group", children: [_jsx("td", { children: _jsx(Chip, { text: `${config[Conf.MQTT_DEVICE_TOPIC]}/set` }) }), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: "JSON" }) }), _jsxs("td", { children: ["This is the topic Lumenator is subscribed to for commands. This follows the Home Assistant JSON schema for sending commands.", _jsx("br", {}), _jsx("br", {}), " See", " ", _jsx("a", { href: "https://www.home-assistant.io/integrations/light.mqtt/#json-schema", target: "_blank", children: "MQTT Light - JSON Schema" }), " ", "for more details."] })] })] })] }) }))] }));
};
export default MQTTSetup;
