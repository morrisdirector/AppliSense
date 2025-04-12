export var ControlMode;
(function (ControlMode) {
    ControlMode[ControlMode["STANDBY"] = 0] = "STANDBY";
    ControlMode[ControlMode["RGB"] = 1] = "RGB";
    ControlMode[ControlMode["WHITE"] = 2] = "WHITE";
    ControlMode[ControlMode["WARM_WHITE"] = 3] = "WARM_WHITE";
    ControlMode[ControlMode["TEMP"] = 4] = "TEMP";
    ControlMode[ControlMode["E131"] = 5] = "E131";
    ControlMode[ControlMode["GPIO_R"] = 10] = "GPIO_R";
    ControlMode[ControlMode["GPIO_G"] = 11] = "GPIO_G";
    ControlMode[ControlMode["GPIO_B"] = 12] = "GPIO_B";
    ControlMode[ControlMode["GPIO_W"] = 13] = "GPIO_W";
    ControlMode[ControlMode["GPIO_WW"] = 14] = "GPIO_WW";
})(ControlMode || (ControlMode = {}));
