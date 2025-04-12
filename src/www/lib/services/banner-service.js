import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { AlertWarningType, } from "../components/AlertWarning/IAlertWarningProps";
import { Fragment } from "preact";
import AlertWarning from "../components/AlertWarning/AlertWarning";
import { getUniqueId } from "../utils/utils";
export class BannerService {
    constructor(reRender) {
        this.reRender = reRender;
        this._messages = [];
        this.renderActionSection = this.renderActionSection.bind(this);
        this.newDialog = this.newDialog.bind(this);
    }
    get dialogConfig() {
        return this._dialogConfig;
    }
    set dialogConfig(config) {
        this._dialogConfig = config;
        this.reRender();
    }
    get messages() {
        return this._messages;
    }
    set messages(messages) {
        this._messages = messages;
        this.reRender();
    }
    renderActionSection() {
        return (_jsxs(Fragment, { children: [this.messages && !!this.messages.length && (_jsx("div", { class: `lum-messages${this.dialogConfig ? " mb-small" : ""}`, children: this.messages.map((msg) => msg) })), this.dialogConfig && (_jsxs("section", { class: "action-section no-margin", children: [this.dialogConfig.warningText && (_jsx("div", { children: _jsx(AlertWarning, { icon: this.dialogConfig.warningIcon, type: AlertWarningType.BASIC_BORDERLESS, text: this.dialogConfig.warningText }) })), _jsxs("div", { children: [_jsx("button", { onClick: () => {
                                        if (this.dialogConfig &&
                                            typeof this.dialogConfig.onCancel === "function") {
                                            this.dialogConfig.onCancel();
                                        }
                                        else {
                                            this.dialogConfig = null;
                                        }
                                    }, children: this.dialogConfig.cancelText }), _jsx("button", { class: this.dialogConfig.okClass || "primary", onClick: () => {
                                        if (this.dialogConfig &&
                                            typeof this.dialogConfig.onOk === "function") {
                                            this.dialogConfig.onOk();
                                        }
                                        else {
                                            this.dialogConfig = null;
                                        }
                                    }, children: this.dialogConfig.okText })] })] }))] }));
    }
    newDialog(config) {
        if (!this.dialogConfig || this.dialogConfig.id !== config.id) {
            this.dialogConfig = { cancelText: "Cancel", okText: "Ok", ...config };
            this.reRender();
        }
    }
    clear() {
        this.dialogConfig = null;
        this.messages = [];
        this.reRender();
    }
    addMessage(msg) {
        this.messages = [...this.messages, _jsx("div", { children: msg }, getUniqueId())];
    }
}
