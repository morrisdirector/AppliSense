import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Fragment, createRef } from "preact";
import { useEffect, useState } from "preact/hooks";
const NavMenu = (props) => {
    const pushDownContainer = createRef();
    const [activeTabId, setActiveTabId] = useState(props.activeId || 0);
    const [pushDownHeight, setPushDownHeight] = useState(0);
    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            if (entry.contentBoxSize) {
                // Firefox implements `contentBoxSize` as a single content rect, rather than an array
                const contentBoxSize = Array.isArray(entry.contentBoxSize)
                    ? entry.contentBoxSize[0]
                    : entry.contentBoxSize;
                if (contentBoxSize.blockSize != pushDownHeight) {
                    setPushDownHeight(contentBoxSize.blockSize);
                }
            }
            else if (entry.contentRect) {
                // Safari:
                if (entry.contentRect.height != pushDownHeight) {
                    setPushDownHeight(entry.contentRect.height);
                }
            }
            else {
                setPushDownHeight(0);
            }
        }
    });
    useEffect(() => {
        if (pushDownContainer.current) {
            resizeObserver.observe(pushDownContainer.current);
        }
    }, [pushDownContainer]);
    const renderTabs = () => {
        if (props.minimized) {
            return _jsx("div", {});
        }
        else if (Array.isArray(props.children)) {
            return props.children.map((child) => {
                const props = child.props;
                const active = child.props.id === activeTabId;
                return (_jsx("li", { class: "tab" + (active ? " active" : ""), onClick: () => {
                        setActiveTabId(child.props.id);
                    }, children: props.title }));
            });
        }
        else if (props.children.props) {
            return (_jsx("li", { class: "tab active", children: props.children.props.title }));
        }
    };
    const renderTabContent = () => {
        if (Array.isArray(props.children)) {
            return props.children.find((child) => child.props.id === activeTabId);
        }
        else if (props.children.props) {
            return props.children;
        }
    };
    return (_jsxs(Fragment, { children: [_jsx("div", { class: `lum-Nav${props.minimized ? " minimized" : ""}`, children: _jsx("ul", { class: "lum-NavMenu", children: renderTabs() }) }), pushDownHeight, _jsx("div", { class: `lum-Nav-pushDown${props.minimized ? " minimized" : ""}`, style: { visibility: !pushDownHeight ? "hidden" : "visible" }, children: _jsxs("div", { class: "lum-Nav-pushDown-content", ref: pushDownContainer, children: [typeof props.renderMessages === "function" && props.renderMessages(), typeof props.renderActionSection === "function" &&
                            props.renderActionSection()] }) }), _jsxs("main", { children: [_jsx("div", { class: "pushDown-spacer", style: {
                            height: pushDownHeight,
                            marginBottom: props.minimized ? "0" : "10px",
                        } }), renderTabContent()] })] }));
};
export default NavMenu;
