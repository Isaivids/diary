import Link from "next/link";
import React from "react";
import { MdAttachMoney, MdDelete, MdModeEditOutline } from "react-icons/md";

const Card = ({data}:any) => {
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {data.length && data.map((x: any) => {
        return (
          <div key={x?._id} className="my-1 rounded-md overflow-hidden shadow-md bg-white w-full md:w-2/4 lg:w-1/4">
            <div className="flex justify-between p-2 bg-indigo-600 text-white font-medium">
              <span>{x?.person}</span>
              <span>{x?.dateoftransaction}</span>
            </div>
            <div className="flex flex-col align-middle justify-center text-center">
              <span>{x?.description}</span>
              <span className="font-bold text-2xl">$ {x?.transactionamount}</span>
              <span>Type : {x?.typeoftransaction}</span>
              <span>Status : {x?.settled}</span>
            </div>
            <div className="flex gap-1 p-2 justify-center">
                <button className="btn bg-red-600 w-1/4 p-0 min-h-3 h-8 text-white"><MdDelete />Delete</button>
                <button className="btn bg-sky-400 w-1/4 p-0 min-h-3 h-8 text-white"><MdAttachMoney />Close</button>
                <Link href={`notes/${x?._id}`} className="btn btn-success w-1/4 p-0 min-h-3 h-8 text-white"><MdModeEditOutline />Edit</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
