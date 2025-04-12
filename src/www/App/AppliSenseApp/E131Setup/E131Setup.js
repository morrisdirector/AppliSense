import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Conf } from "../../../lib/interfaces/IConfigJson";
import { Fragment } from "preact";
import Chip from "../../../lib/components/Chip/Chip";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
const E131Setup = ({ config = {}, ...props }) => {
    const handleE131Enable = () => {
        if (typeof props.onConfigUpdate === "function") {
            props.onConfigUpdate({
                ...config,
                [Conf.E131_ENABLED]: !config[Conf.E131_ENABLED],
            });
        }
    };
    const renderRow = (mapping, offset = 0, firstRow = false, universe) => {
        return (_jsxs("tr", { class: `table-row${firstRow ? " first-row" : ""}`, children: [_jsx("td", { children: universe && _jsx(Chip, { text: `${config[Conf.E131_UNIVERSE]}` }) }), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${(config[Conf.E131_START_CHAN] || 0) + offset - 1}` }) }), _jsx("td", { children: mapping })] }));
    };
    const renderMapping = () => {
        let mappedSections = [];
        if (config[Conf.E131_MANUAL]) {
            // First Rows:
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) {
                mappedSections = [
                    ...mappedSections,
                    _jsxs("tr", { class: "table-row first-row", children: [_jsx("td", { children: config[Conf.E131_UNIVERSE] && (_jsx(Chip, { text: `${config[Conf.E131_UNIVERSE] || "None"}` })) }), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${config[Conf.E131_START_CHAN] || "None"}` }) }), _jsx("td", { children: "Red" })] }),
                ];
            }
            else if (config[Conf.DEVICE_TYPE] === DeviceType.W ||
                config[Conf.DEVICE_TYPE] === DeviceType.WW) {
                mappedSections = [
                    ...mappedSections,
                    _jsxs("tr", { class: "table-row first-row", children: [_jsx("td", { children: config[Conf.E131_UNIVERSE] && (_jsx(Chip, { text: `${config[Conf.E131_UNIVERSE] || "None"}` })) }), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${config[Conf.E131_START_CHAN] || "None"}` }) }), _jsx("td", { children: "Cold White" })] }),
                ];
            }
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) {
                mappedSections = [
                    ...mappedSections,
                    _jsxs("tr", { class: "table-row", children: [_jsx("td", {}), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${config[Conf.E131_G_CHAN] || "None"}` }) }), _jsx("td", { children: "Green" })] }),
                    _jsxs("tr", { class: "table-row", children: [_jsx("td", {}), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${config[Conf.E131_B_CHAN] || "None"}` }) }), _jsx("td", { children: "Blue" })] }),
                ];
            }
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) {
                mappedSections = [
                    ...mappedSections,
                    _jsxs("tr", { class: "table-row", children: [_jsx("td", {}), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${config[Conf.E131_W_CHAN] || "None"}` }) }), _jsx("td", { children: "Cold White" })] }),
                ];
            }
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                config[Conf.DEVICE_TYPE] === DeviceType.WW) {
                mappedSections = [
                    ...mappedSections,
                    _jsxs("tr", { class: "table-row", children: [_jsx("td", {}), _jsx("td", { children: _jsx(Chip, { variant: "basic", text: `${config[Conf.E131_WW_CHAN] || "None"}` }) }), _jsx("td", { children: "Warm White" })] }),
                ];
            }
        }
        else {
            let id = 1;
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) {
                mappedSections = [
                    ...mappedSections,
                    renderRow("Red", id, true, config[Conf.E131_UNIVERSE]),
                    renderRow("Green", id + 1),
                    renderRow("Blue", id + 2),
                ];
                id = id + 3;
            }
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                config[Conf.DEVICE_TYPE] === DeviceType.W ||
                config[Conf.DEVICE_TYPE] === DeviceType.WW) {
                mappedSections = [
                    ...mappedSections,
                    renderRow("Cold White", id, id == 1, id == 1 ? config[Conf.E131_UNIVERSE] : null),
                ];
                id = id + 1;
            }
            if (config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                config[Conf.DEVICE_TYPE] === DeviceType.WW) {
                mappedSections = [...mappedSections, renderRow("Warm White", id)];
            }
        }
        return mappedSections;
    };
    return (_jsxs(Fragment, { children: [_jsxs("div", { class: "section-action", children: [_jsx(ToggleSwitch, { onClick: handleE131Enable, on: config[Conf.E131_ENABLED] }), _jsx("label", { children: "Enable E131 Streaming" })] }), _jsx("section", { children: _jsxs("div", { class: "grid-large", children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "universe", children: "Universe" }), _jsx(Input, { id: "universe", type: "number", disabled: !config[Conf.E131_ENABLED], value: config[Conf.E131_UNIVERSE] || undefined, maxLength: 4, onChange: (value) => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.E131_UNIVERSE]: value,
                                            });
                                        }
                                    } }), _jsx("div", { class: "helper-text", children: "The universe to listen for." })] }), _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "name", children: "Mixing Strategy" }), _jsxs(DropdownMenu, { type: "number", disabled: !config[Conf.E131_ENABLED], placeholder: "Set a mixing strategy", value: config[Conf.E131_MIXING_STRATEGY] || undefined, onSelect: (value) => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.E131_MIXING_STRATEGY]: value,
                                            });
                                        }
                                    }, children: [_jsx("option", { value: "1", children: "Limited - RGB and whites cannot be mixed" }), _jsx("option", { value: "2", children: "All - RGB and whites can be mixed" })] }), _jsx("div", { class: "helper-text", children: "As a potential safety measure, it's recommended to only allow limited mixing to prevent overloading the internal power supplies of the hardware. Limited mode will prioritize RGB data over white." })] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "channel", children: config[Conf.E131_MANUAL]
                                        ? config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                                            config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                                            config[Conf.DEVICE_TYPE] === DeviceType.RGBWW
                                            ? "Red"
                                            : "Cold White"
                                        : "Start Channel" }), _jsx(Input, { id: "channel", type: "number", disabled: !config[Conf.E131_ENABLED], value: config[Conf.E131_START_CHAN] || undefined, maxLength: 4, onChange: (value) => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.E131_START_CHAN]: value,
                                            });
                                        }
                                    } }), !config[Conf.E131_MANUAL] && (_jsx("div", { class: "helper-text", children: "The starting channel assigned to Lumenator." }))] }), _jsxs("div", { class: "form-group", children: [_jsx("label", { children: "Manual Mapping" }), _jsx(ToggleSwitch, { disabled: !config[Conf.E131_ENABLED], onClick: () => {
                                        if (typeof props.onConfigUpdate === "function") {
                                            props.onConfigUpdate({
                                                ...config,
                                                [Conf.E131_MANUAL]: !config[Conf.E131_MANUAL],
                                            });
                                        }
                                    }, on: config[Conf.E131_MANUAL] })] }), config[Conf.E131_MANUAL] && (_jsxs(Fragment, { children: [(config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                                    config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                                    config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) && (_jsxs(Fragment, { children: [_jsxs("div", { class: "form-group", children: [_jsx("label", { for: "green", children: "Green" }), _jsx(Input, { id: "green", type: "number", disabled: !config[Conf.E131_ENABLED], value: config[Conf.E131_G_CHAN] || undefined, maxLength: 4, onChange: (value) => {
                                                        if (typeof props.onConfigUpdate === "function") {
                                                            props.onConfigUpdate({
                                                                ...config,
                                                                [Conf.E131_G_CHAN]: value,
                                                            });
                                                        }
                                                    } })] }), _jsx("div", {}), _jsxs("div", { class: "form-group", children: [_jsx("label", { for: "blue", children: "Blue" }), _jsx(Input, { id: "blue", type: "number", disabled: !config[Conf.E131_ENABLED], value: config[Conf.E131_B_CHAN] || undefined, maxLength: 4, onChange: (value) => {
                                                        if (typeof props.onConfigUpdate === "function") {
                                                            props.onConfigUpdate({
                                                                ...config,
                                                                [Conf.E131_B_CHAN]: value,
                                                            });
                                                        }
                                                    } })] }), _jsx("div", {})] })), (config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                                    config[Conf.DEVICE_TYPE] === DeviceType.RGBW) && (_jsxs(Fragment, { children: [_jsxs("div", { class: "form-group", children: [_jsx("label", { for: "w", children: "Cold White" }), _jsx(Input, { id: "w", type: "number", disabled: !config[Conf.E131_ENABLED], value: config[Conf.E131_W_CHAN] || undefined, maxLength: 4, onChange: (value) => {
                                                        if (typeof props.onConfigUpdate === "function") {
                                                            props.onConfigUpdate({
                                                                ...config,
                                                                [Conf.E131_W_CHAN]: value,
                                                            });
                                                        }
                                                    } })] }), _jsx("div", {})] })), (config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                                    config[Conf.DEVICE_TYPE] === DeviceType.WW) && (_jsxs("div", { class: "form-group", children: [_jsx("label", { for: "WW", children: "Warm White" }), _jsx(Input, { id: "WW", type: "number", disabled: !config[Conf.E131_ENABLED], value: config[Conf.E131_WW_CHAN] || undefined, maxLength: 4, onChange: (value) => {
                                                if (typeof props.onConfigUpdate === "function") {
                                                    props.onConfigUpdate({
                                                        ...config,
                                                        [Conf.E131_WW_CHAN]: value,
                                                    });
                                                }
                                            } })] }))] }))] }) }), config[Conf.E131_ENABLED] &&
                (config[Conf.E131_UNIVERSE] || 0) > 0 &&
                (config[Conf.E131_START_CHAN] || 0) > 0 && (_jsx("section", { children: _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { children: "Channel Mapping" }), _jsxs("table", { children: [_jsxs("tr", { class: "header-row", children: [_jsx("th", { children: "Universe" }), _jsx("th", { children: "Channel" }), _jsx("th", { width: "100%", children: "Mapping" })] }), renderMapping()] })] }) }))] }));
};
export default E131Setup;
