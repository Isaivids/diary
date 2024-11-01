import React from "react";
import { CgDanger } from "react-icons/cg";

const Notification = ({ data }: any) => {
  return (
    <div className="m-3">
      <div role="alert" className="alert alert-error">
        <CgDanger />
        <span className="font-semibold text-sm text-white">{data}</span>
      </div>
    </div>
  );
};

export default Notification;
