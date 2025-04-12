import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Component, Fragment } from "preact";
import { Conf } from "../../lib/interfaces/IConfigJson";
import { ConfigService } from "../../lib/services/config-service";
import { HardwareService } from "../../lib/services/hardware-service";
import Input from "../../lib/components/Input/Input";
import Loader from "../../lib/components/Loader/Loader";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";
import NetworkSetup from "../LumenatorApp/NetworkSetup/NetworkSetup";
class LumenatorSetup extends Component {
    constructor() {
        super();
        this.hardwareService = new HardwareService();
        this.configService = new ConfigService();
        this.init = async () => {
            try {
                const data = await this.configService.loadConfigJson();
                if (data) {
                    this.setState({ originalConfig: { ...data }, config: { ...data } });
                }
                if (!data[Conf.ACCESS_POINT_PASS]) {
                    this.setState({ accessGranted: true });
                }
            }
            catch (error) {
                debugger;
            }
        };
        this.login = () => {
            if (this.state.originalConfig) {
                if (this.state.originalConfig[Conf.ACCESS_POINT_PASS] == this.state.password) {
                    this.setState({ accessGranted: true });
                }
                else {
                    this.setState({ errorText: "Invalid password" });
                }
            }
        };
        this.state = { accessGranted: false, errorText: "" };
        this.renderActionSection = this.renderActionSection.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    renderActionSection() {
        return this.configService.hasUnsavedChanges(this.state.originalConfig, this.state.config) ? (_jsx("section", { class: "action-section no-margin", children: _jsxs("div", { children: [_jsx("button", { onClick: () => {
                            this.setState({
                                config: { ...this.state.originalConfig },
                            });
                        }, children: "Start Over" }), _jsx("button", { class: "primary", onClick: () => {
                            if (this.state.config) {
                                this.setState({ loading: true });
                                this.configService
                                    .saveConfigJson(this.state.config)
                                    .then((result) => {
                                    if (result === true) {
                                        this.setState({
                                            originalConfig: {
                                                ...this.state.config,
                                            },
                                        });
                                        this.hardwareService.restart();
                                    }
                                });
                            }
                        }, children: "Save and Restart" })] }) })) : (_jsx(Fragment, {}));
    }
    render() {
        return (_jsxs("div", { id: "lumenator-web-app", children: [this.state.loading && _jsx(Loader, {}), _jsx("header", { children: _jsx("div", { class: "header-container", children: _jsx("div", { class: "header-items", children: _jsx("h2", { children: "Lumenator" }) }) }) }), _jsx(NavMenu, { minimized: true, activeId: 1, renderActionSection: this.renderActionSection, children: _jsx(NavMenuTab, { id: 1, title: "Setup", children: (!this.state.accessGranted && (_jsxs("section", { style: { maxWidth: "400px" }, children: [_jsxs("div", { class: "form-group no-margin", children: [_jsx("label", { children: "Setup Password" }), _jsxs("div", { className: "flex-stretch", children: [_jsx("div", { class: "flex-grow", children: _jsx(Input, { onEnter: this.login, onChange: (value) => {
                                                            this.setState({ password: value });
                                                        }, type: "password" }) }), _jsx("button", { class: "primary ml-small", onClick: this.login, children: "Go" })] })] }), _jsx("div", { class: "error-text", children: this.state.errorText })] }))) || (_jsxs(Fragment, { children: [_jsxs("section", { children: [_jsx("h4", { children: "Welcome!" }), _jsx("p", { children: "To get started, fill out the network configuration form below, then click \"Save and Restart\". Once configured, Lumenator will try to connect to your wireless network. If unsuccessful, this access point will become available again for configuration." })] }), _jsx(NetworkSetup, { page: "setup", config: this.state.config, onConfigUpdate: (config) => {
                                        this.setState({ config: { ...config } });
                                    } })] })) }) })] }));
    }
}
export default LumenatorSetup;
