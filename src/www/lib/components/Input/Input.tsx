import { FunctionalComponent, h } from "preact";

import { IInputProps } from "./IInputProps";
import { strValToNumber } from "../../utils/utils";

const Input: FunctionalComponent<IInputProps> = (props) => {
  const getEventValue = (event: Event): number | string | undefined => {
    const strValue = (event.target as HTMLInputElement).value;
    return props.type === "number"
      ? strValToNumber(strValue)
      : (strValue as string).slice(0, props.maxLength || 500);
  };

  const handleChange = (event: Event): void => {
    const val = getEventValue(event);
    if (typeof props.onChange === "function") {
      props.onChange(val);
    }
  };

  const handleBlur = (event: Event): void => {
    const val = getEventValue(event);
    if (typeof props.onBlur === "function") {
      props.onBlur(val);
    }
  };

  const handleKeypress = (event: KeyboardEvent): void => {
    if (event.key === "Enter" && typeof props.onEnter === "function") {
      props.onEnter(getEventValue(event));
    }
  };

  return (
    <div class={`lum-Input${props.disabled ? " disabled" : ""}`}>
      <input
        disabled={props.disabled}
        type={props.type}
        class="lum-Input-input"
        value={props.value}
        onInput={handleChange}
        onBlur={handleBlur}
        onKeyPress={handleKeypress}
      />
      {props.children}
    </div>
  );
};

export default Input;
