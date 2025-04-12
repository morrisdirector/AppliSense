import { render } from "preact";

import AppliSenseApp from "./App/AppliSenseApp/AppliSenseApp";
import AppliSenseSetup from "./App/Setup/AppliSenseSetup";

const PAGE = document.body.id === "applisense-setup" ? "setup" : "app";

if (PAGE === "setup") {
  render(<AppliSenseSetup />, document.body);
} else {
  render(<AppliSenseApp />, document.body);
}