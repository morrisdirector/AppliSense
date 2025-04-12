import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { BannerService, } from "../../lib/services/banner-service";
import { Component } from "preact";
import { Conf } from "../../lib/interfaces/IConfigJson";
import AlertWarning from "../../lib/components/AlertWarning/AlertWarning";
import { AlertWarningIcon } from "../../lib/components/AlertWarning/IAlertWarningProps";
import Chip from "../../lib/components/Chip/Chip";
import { ConfigService } from "../../lib/services/config-service";
import { ControlMode } from "../../lib/enums/ControlMode";
import DeviceSetup from "./DeviceSetup/DeviceSetup";
import E131Setup from "./E131Setup/E131Setup";
import { FIRMWARE_VERSION } from "../../version";
import { HardwareService } from "../../lib/services/hardware-service";
import Loader from "../../lib/components/Loader/Loader";
import MQTTSetup from "./MQTTSetup/MQTTSetup";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";
import NetworkSetup from "./NetworkSetup/NetworkSetup";
import { OnOff } from "../../lib/enums/OnOff";
import { WebsocketService } from "../../lib/services/websocket-service";
class LumenatorApp extends Component {
    constructor() {
        super();
        this.configService = new ConfigService();
        this.websocketService = new WebsocketService();
        this.hardwareService = new HardwareService();
        this.bannerService = new BannerService((newState) => {
            this.forceUpdate();
            if (newState) {
                this.setState(newState);
            }
        });
        this.init = async () => {
            try {
                const data = await this.configService.loadConfigJson();
                if (data) {
                    this.setState({
                        originalConfig: { ...data },
                        config: { ...data },
                        loading: false,
                    });
                }
            }
            catch (error) {
                console.error(error);
                this.setState({ loading: false });
            }
        };
        this.isGpioMode = (mode) => {
            return (mode === ControlMode.GPIO_B ||
                mode === ControlMode.GPIO_G ||
                mode === ControlMode.GPIO_R ||
                mode === ControlMode.GPIO_W ||
                mode === ControlMode.GPIO_WW);
        };
        this.handleControlModeToggle = (newMode) => {
            if (this.isGpioMode(this.state.controlMode)) {
                // Turn off the old GPIO
                this.websocketService.send(`gpio:${this.state.controlMode}:${OnOff.OFF}`);
            }
            if (this.isGpioMode(newMode)) {
                // Turn on the new GPIO
                this.websocketService.send(`gpio:${newMode}:${OnOff.ON}`);
            }
            if (newMode === ControlMode.STANDBY) {
                this.websocketService.send(`standby`);
            }
            this.setState({ controlMode: newMode });
        };
        this.handleColorSet = (data) => {
            if (data.type === "rgb") {
                this.setState({ rgbColor: data.color });
            }
            if (data.type === "white") {
                this.setState({ whiteColor: data.color });
            }
            if (data.type === "whiteValue") {
                this.setState({ whiteValueColor: data.color });
            }
        };
        this.state = {
            controlMode: ControlMode.STANDBY,
            loading: true,
        };
        this.saveChangesDialog = {
            id: "saveChanges",
            warningText: "Unsaved Changes",
            warningIcon: AlertWarningIcon.ALERT,
            okText: "Save Configuration",
            onOk: () => {
                this.saveConfiguration();
            },
            onCancel: () => {
                this.setState({
                    config: { ...this.state.originalConfig },
                });
                this.bannerService.clear();
            },
        };
        this.saveConfiguration = this.saveConfiguration.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        if ((!this.bannerService.dialogConfig ||
            this.bannerService.dialogConfig.id !== this.saveChangesDialog.id) &&
            this.configService.hasUnsavedChanges(this.state.originalConfig, this.state.config)) {
            this.bannerService.newDialog(this.saveChangesDialog);
        }
    }
    saveConfiguration() {
        this.setState({ loading: true });
        if (this.state.config) {
            this.configService.saveConfigJson(this.state.config).then((result) => {
                if (result === true) {
                    setTimeout(() => {
                        this.setState({
                            originalConfig: {
                                ...this.state.config,
                            },
                            loading: false,
                        });
                        this.bannerService.clear();
                        this.bannerService.addMessage(_jsx(AlertWarning, { text: "Configuration saved successfully", closable: true, autoClose: true }));
                    }, 1000);
                }
            });
        }
    }
    render() {
        return (_jsxs("div", { id: "lumenator-web-app", children: [this.state.loading && _jsx(Loader, {}), _jsx("header", { children: _jsx("div", { class: "header-container", children: _jsxs("div", { class: "header-items", children: [_jsx("h2", { children: "Lumenator" }), this.state.originalConfig &&
                                    this.state.originalConfig[Conf.DEVICE_NAME] && (_jsx(Chip, { text: this.state.originalConfig[Conf.DEVICE_NAME] })), _jsxs("div", { class: "version", children: ["v", FIRMWARE_VERSION] })] }) }) }), _jsxs(NavMenu, { activeId: 1, renderActionSection: () => {
                        return this.bannerService.renderActionSection();
                    }, children: [_jsx(NavMenuTab, { id: 1, title: "Device", children: _jsx(DeviceSetup, { config: this.state.config, bannerService: this.bannerService, hardwareService: this.hardwareService, websocketService: this.websocketService, configService: this.configService, onConfigUpdate: (config) => {
                                    this.setState({
                                        config: {
                                            ...config,
                                        },
                                    });
                                }, onLoading: (loading) => {
                                    this.setState({ loading });
                                }, controlMode: this.state.controlMode, onControlModeToggle: this.handleControlModeToggle }) }), _jsx(NavMenuTab, { id: 2, title: "Network", children: _jsx(NetworkSetup, { config: this.state.config, onConfigUpdate: (config) => {
                                    this.setState({
                                        config: {
                                            ...config,
                                        },
                                    });
                                } }) }), _jsx(NavMenuTab, { id: 3, title: "MQTT", children: _jsx(MQTTSetup, { config: this.state.config, onConfigUpdate: (config) => {
                                    this.setState({
                                        config: {
                                            ...config,
                                        },
                                    });
                                } }) }), _jsx(NavMenuTab, { id: 4, title: "E131", children: _jsx(E131Setup, { config: this.state.config, onConfigUpdate: (config) => {
                                    this.setState({
                                        config: {
                                            ...config,
                                        },
                                    });
                                } }) })] })] }));
    }
}
export default LumenatorApp;
