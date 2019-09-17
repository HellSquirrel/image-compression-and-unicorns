import React from "react";
import classNames from "classnames/bind";
import cs from "./Controls.module.css";
const cx = classNames.bind(cs);

const Controls = ({ children }) => {
  return <div className={cx("controls")}>{children}</div>;
};
export default Controls;
