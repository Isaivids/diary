import React from "react";
import { CgDanger } from "react-icons/cg";

const Notification = ({ data }: any) => {
  return (
    <div className="m-1">
      <div role="alert" className="alert alert-error p-2">
        <CgDanger />
        <span className="font-medium text-sm text-white">{data}</span>
      </div>
    </div>
  );
};

export default Notification;
