import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import * as SparkMD5 from "spark-md5";
import { AlertWarningIcon, AlertWarningType, } from "../../../lib/components/AlertWarning/IAlertWarningProps";
import { Fragment } from "preact";
import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { Conf } from "../../../lib/interfaces/IConfigJson";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import Input from "../../../lib/components/Input/Input";
import Progress from "../../../lib/components/Progress/Progress";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useState } from "preact/hooks";
const ManualControl = ({ config = {}, bannerService, hardwareService, websocketService, configService, ...props }) => {
    const [devicePage, setDevicePage] = useState("setup");
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState();
    const [otaSuccess, setOtaSuccess] = useState(false);
    const [otaError, setOtaError] = useState();
    const [otaProgress, setOtaProgress] = useState(0);
    const handleControlModeToggle = (modeSwitch) => {
        if (typeof props.onControlModeToggle === "function") {
            if (props.controlMode === modeSwitch) {
                // Toggling off:
                props.onControlModeToggle(ControlMode.STANDBY);
            }
            else {
                // Toggling on:
                props.onControlModeToggle(modeSwitch);
            }
        }
    };
    const fileMD5 = (file) => {
        return new Promise((resolve, reject) => {
            const blobSlice = File.prototype.slice ||
                //@ts-ignore
                File.prototype.mozSlice ||
                //@ts-ignore
                File.prototype.webkitSlice;
            const chunkSize = 2097152; // Read in chunks of 2MB
            const chunks = Math.ceil(file.size / chunkSize);
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();
            let currentChunk = 0;
            const loadNext = () => {
                const start = currentChunk * chunkSize;
                const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
            };
            fileReader.onload = (e) => {
                if (e.target) {
                    const target = e.target;
                    spark.append(target.result); // Append array buffer
                    currentChunk += 1;
                    if (currentChunk < chunks) {
                        loadNext();
                    }
                    else {
                        const md5 = spark.end();
                        resolve(md5);
                    }
                }
            };
            fileReader.onerror = (e) => {
                reject(e);
            };
            loadNext();
        });
    };
    const uploadOTA = () => {
        setUploading(true);
        const formData = new FormData();
        const request = new XMLHttpRequest();
        request.addEventListener("load", () => {
            // request.response will hold the response from the server
            if (request.status === 200) {
                setOtaSuccess(true);
            }
            else if (request.status !== 500) {
                setOtaError(`[HTTP ERROR] ${request.statusText}`);
            }
            else {
                setOtaError(request.responseText);
            }
            setUploading(false);
            setOtaProgress(0);
        });
        // Upload progress
        request.upload.addEventListener("progress", (e) => {
            setOtaProgress(Math.trunc((e.loaded / e.total) * 100));
        });
        request.withCredentials = true;
        if (file) {
            fileMD5(file)
                .then((md5) => {
                formData.append("MD5", md5);
                formData.append("firmware", file, "firmware");
                request.open("post", "/update");
                request.send(formData);
            })
                .catch(() => {
                setOtaError("Unknown error while upload, check the console for details.");
                setUploading(false);
                setOtaProgress(0);
            });
        }
    };
    const handleFirmwareSelection = (event) => {
        if (event !== null &&
            event.target &&
            event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setFile(file);
            }
        }
    };
    const goBack = () => {
        setFile(null);
        setOtaError(null);
        setOtaProgress(0);
        setDevicePage("setup");
    };
    return (_jsxs(Fragment, { children: [devicePage === "setup" && (_jsxs(Fragment, { children: [_jsx("section", { children: _jsxs("div", { class: "grid-large", children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "name", children: "Device Name" }), _jsx(Input, { value: config[Conf.DEVICE_NAME] || undefined, maxLength: 40, onChange: (value) => {
                                                if (typeof props.onConfigUpdate === "function") {
                                                    props.onConfigUpdate({
                                                        ...config,
                                                        [Conf.DEVICE_NAME]: value,
                                                    });
                                                }
                                            } }), _jsx("div", { class: "helper-text", children: "Max 40 characters" })] }), _jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "name", children: "Device Type" }), _jsxs(DropdownMenu, { type: "number", placeholder: "Select a device type", value: config[Conf.DEVICE_TYPE] || undefined, onSelect: (value) => {
                                                if (typeof props.onConfigUpdate === "function") {
                                                    props.onConfigUpdate({
                                                        ...config,
                                                        [Conf.DEVICE_TYPE]: value,
                                                    });
                                                }
                                            }, children: [_jsx("option", { value: "1", children: "RGBWW (RGB w/ Cool / Warm White)" }), _jsx("option", { value: "2", children: "RGBW (RGB w/ White)" }), _jsx("option", { value: "3", children: "RGB" }), _jsx("option", { value: "4", children: "WW (Cool / Warm White)" }), _jsx("option", { value: "5", children: "W (White w/o Temp Control)" })] })] })] }) }), _jsx("section", { children: _jsxs("div", { class: "grid-large", children: [_jsxs("div", { children: [_jsx("label", { class: "mb-small", children: "GPIO Mapping" }), _jsxs("table", { children: [_jsxs("tr", { class: "header-row", children: [_jsx("th", { children: "Channel" }), _jsx("th", { children: "GPIO" }), _jsx("th", { children: "Test" })] }), (config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                                                    config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                                                    config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) && (_jsxs(Fragment, { children: [_jsxs("tr", { children: [_jsx("td", { children: "Red" }), _jsx("td", { children: _jsx(Input, { value: config[Conf.GPIO_R] || undefined, type: "number", onChange: (value) => {
                                                                            if (typeof props.onConfigUpdate === "function") {
                                                                                props.onConfigUpdate({
                                                                                    ...config,
                                                                                    [Conf.GPIO_R]: value,
                                                                                });
                                                                            }
                                                                        } }) }), _jsx("td", { children: _jsx(ToggleSwitch, { on: props.controlMode === ControlMode.GPIO_R, onClick: () => {
                                                                            handleControlModeToggle(ControlMode.GPIO_R);
                                                                        } }) })] }), _jsxs("tr", { children: [_jsx("td", { children: "Green" }), _jsx("td", { children: _jsx(Input, { value: config[Conf.GPIO_G] || undefined, type: "number", onChange: (value) => {
                                                                            if (typeof props.onConfigUpdate === "function") {
                                                                                props.onConfigUpdate({
                                                                                    ...config,
                                                                                    [Conf.GPIO_G]: value,
                                                                                });
                                                                            }
                                                                        } }) }), _jsx("td", { children: _jsx(ToggleSwitch, { on: props.controlMode === ControlMode.GPIO_G, onClick: () => {
                                                                            handleControlModeToggle(ControlMode.GPIO_G);
                                                                        } }) })] }), _jsxs("tr", { children: [_jsx("td", { children: "Blue" }), _jsx("td", { children: _jsx(Input, { value: config[Conf.GPIO_B] || undefined, type: "number", onChange: (value) => {
                                                                            if (typeof props.onConfigUpdate === "function") {
                                                                                props.onConfigUpdate({
                                                                                    ...config,
                                                                                    [Conf.GPIO_B]: value,
                                                                                });
                                                                            }
                                                                        } }) }), _jsx("td", { children: _jsx(ToggleSwitch, { on: props.controlMode === ControlMode.GPIO_B, onClick: () => {
                                                                            handleControlModeToggle(ControlMode.GPIO_B);
                                                                        } }) })] })] })), config[Conf.DEVICE_TYPE] !== DeviceType.RGB && (_jsxs("tr", { children: [_jsx("td", { children: "White" }), _jsx("td", { children: _jsx(Input, { value: config[Conf.GPIO_W] || undefined, type: "number", onChange: (value) => {
                                                                    if (typeof props.onConfigUpdate === "function") {
                                                                        props.onConfigUpdate({
                                                                            ...config,
                                                                            [Conf.GPIO_W]: value,
                                                                        });
                                                                    }
                                                                } }) }), _jsx("td", { children: _jsx(ToggleSwitch, { on: props.controlMode === ControlMode.GPIO_W, onClick: () => {
                                                                    handleControlModeToggle(ControlMode.GPIO_W);
                                                                } }) })] })), (config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                                                    config[Conf.DEVICE_TYPE] === DeviceType.WW) && (_jsxs("tr", { children: [_jsx("td", { children: "Warm White" }), _jsx("td", { children: _jsx(Input, { value: config[Conf.GPIO_WW] || undefined, type: "number", onChange: (value) => {
                                                                    if (typeof props.onConfigUpdate === "function") {
                                                                        props.onConfigUpdate({
                                                                            ...config,
                                                                            [Conf.GPIO_WW]: value,
                                                                        });
                                                                    }
                                                                } }) }), _jsx("td", { children: _jsx(ToggleSwitch, { on: props.controlMode === ControlMode.GPIO_WW, onClick: () => {
                                                                    handleControlModeToggle(ControlMode.GPIO_WW);
                                                                } }) })] }))] }), (props.controlMode === ControlMode.GPIO_WW ||
                                            props.controlMode === ControlMode.GPIO_W ||
                                            props.controlMode === ControlMode.GPIO_R ||
                                            props.controlMode === ControlMode.GPIO_G ||
                                            props.controlMode === ControlMode.GPIO_B) && (_jsx(AlertWarning, { icon: AlertWarningIcon.INFO, text: "While GPIO testing is enabled, Lumenator will attempt to turn on the GPIO you are testing.  If Lumenator receives commands from other sources such as MQTT, the test will be overidden." }))] }), _jsxs("div", { children: [_jsx("label", { class: "mb-small", children: "System" }), _jsx("button", { class: "mb-small width-100", onClick: () => {
                                                if (bannerService) {
                                                    bannerService.newDialog({
                                                        warningText: "Are you sure?",
                                                        okText: "Restart",
                                                        okClass: "alert",
                                                        onOk: () => {
                                                            if (typeof props.onLoading === "function") {
                                                                props.onLoading(true);
                                                            }
                                                            if (hardwareService && websocketService) {
                                                                hardwareService.restart();
                                                                setTimeout(() => {
                                                                    websocketService.close();
                                                                    websocketService.reconnect().then((connected) => {
                                                                        if (connected) {
                                                                            bannerService.clear();
                                                                            bannerService.addMessage(_jsx(AlertWarning, { text: "Restarted successfully", autoClose: true, closable: true }));
                                                                            if (typeof props.onControlModeToggle ===
                                                                                "function") {
                                                                                props.onControlModeToggle(ControlMode.STANDBY);
                                                                            }
                                                                            if (typeof props.onLoading === "function") {
                                                                                props.onLoading(false);
                                                                            }
                                                                        }
                                                                    });
                                                                }, 1000);
                                                            }
                                                        },
                                                    });
                                                }
                                            }, children: "Restart" }), _jsx("button", { class: "mb-small width-100", onClick: () => {
                                                if (bannerService) {
                                                    bannerService.newDialog({
                                                        warningText: "Are you sure? This cannot be undone.",
                                                        okText: "Erase All",
                                                        okClass: "alert",
                                                        onOk: () => {
                                                            if (typeof props.onLoading === "function") {
                                                                props.onLoading(true);
                                                            }
                                                            if (hardwareService && websocketService) {
                                                                hardwareService.eraseAll();
                                                                setTimeout(() => {
                                                                    bannerService.clear();
                                                                    bannerService.addMessage(_jsx(AlertWarning, { text: "Erased configuration.  Restarting device...", autoCloseDuration: 10, autoClose: true, closable: true }));
                                                                    if (typeof props.onLoading === "function") {
                                                                        props.onLoading(false);
                                                                    }
                                                                    setTimeout(() => {
                                                                        bannerService.clear();
                                                                        bannerService.addMessage(_jsx(AlertWarning, { text: "Device has restarted in access point mode.  Connect to the device access point to set up Lumenator.", type: AlertWarningType.DANGER }));
                                                                        hardwareService.restart();
                                                                    }, 10000);
                                                                }, 1000);
                                                            }
                                                        },
                                                    });
                                                }
                                            }, children: "Erase Configuration" }), _jsx("button", { class: "mb-small width-100", onClick: () => {
                                                setDevicePage("update");
                                            }, children: "Update Firmware" })] })] }) })] })), devicePage === "update" && (_jsxs(Fragment, { children: [_jsx("div", { class: "section-action", children: _jsx("button", { disabled: uploading, onClick: goBack, children: "Go back" }) }), _jsxs("section", { children: [_jsxs("div", { class: "grid-large", children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { for: "name", class: "margin-bottom", children: "Update Firmware" }), _jsx("div", { children: _jsx("input", { disabled: uploading, class: "form-input file-input", type: "file", onChange: handleFirmwareSelection }) }), _jsx("div", { class: "helper-text margin-top", children: "Accepted file types are .bin and .bin.gz" })] }), _jsx("div", { class: "form-group no-margin" }), file && !uploading && (_jsxs("div", { class: "margin-top", children: [_jsx("button", { class: "primary", onClick: uploadOTA, children: "Upload" }), _jsx("button", { class: "ml-small", onClick: goBack, children: "Cancel" })] })), uploading && otaProgress !== undefined && (_jsx("div", { children: _jsx(Progress, { progress: otaProgress || 0 }) }))] }), !uploading && otaError && (_jsx("div", { class: "margin-top", children: _jsx(AlertWarning, { text: `ERROR: ${otaError}`, type: AlertWarningType.ALERT }) }))] }), _jsx(AlertWarning, { icon: AlertWarningIcon.ALERT, text: "WARNING: Make sure you upload the correct binary file.  Once the device receives the file, it will attempt to install it.  If firmware other than Lumenator is installed, you may not be able to update over the air again, unless the new firmware supports it.", type: AlertWarningType.DANGER })] }))] }));
};
export default ManualControl;
