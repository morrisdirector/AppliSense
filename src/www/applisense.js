import { jsx as _jsx } from "preact/jsx-runtime";
import { render } from "preact";
import AppliSenseApp from "./App/AppliSenseApp/AppliSenseApp";
import AppliSenseSetup from "./App/Setup/AppliSenseSetup";
const PAGE = document.body.id === "applisense-setup" ? "setup" : "app";
if (PAGE === "setup") {
    render(_jsx(AppliSenseSetup, {}), document.body);
}
else {
    render(_jsx(AppliSenseApp, {}), document.body);
}
