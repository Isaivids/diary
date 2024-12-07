"use client";
import { apiCall } from "@/utils/axios";
import {
  checkSettledStatus,
  checkType,
  formatDateToDDMMMYYYY,
} from "@/utils/commonFunction";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdAttachMoney, MdDelete, MdModeEditOutline } from "react-icons/md";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { IoMdDoneAll } from "react-icons/io";
import { FaCaretDown, FaCaretUp, FaCircleNotch } from "react-icons/fa";
import Notification from "./Notification";

const Card = ({ data: initialData, getTotals }: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const user = useSelector((state: any) => state.user);
  const [message, setMessage] = useState('');

  const callAction = async (data2: any) => {
    setLoading(true);
    try {
      const payload: any = {
        person: data2.person,
        id: data2._id,
        dateoftransaction: data2.dateoftransaction,
        transactionamount: Number(data2.transactionamount),
        description: data2.description,
        settled: data2.settled ? false : true,
        typeoftransaction: Number(data2.typeoftransaction),
        userId: user.data._id,
      };
      const response = await apiCall.post("/note/add", payload);
      if (!response.data.error) {
        const updatedArray = data.map((item: any) =>
          item._id === data2._id ? response.data.data : item
        );
        setMessage('');
        setData(updatedArray); // Update the state here
      }else{
        setMessage(response.data.message || "Please try again");
      }
    } catch (error: any) {
      setMessage(error.response?.data || error.message);
    } finally {
      setLoading(false);
      getTotals();
    }
  };

  const callDelete = async (id: any) => {
    setLoading(true);
    try {
      const payload = { noteId: id };
      const response = await apiCall.delete("/note/deletenote", {
        data: payload,
      });
      if (!response.data.error) {
        const newArray = data.filter((item: any) => item._id !== id);
        setMessage('');
        setData(newArray);
      }else{
        setMessage(response.data.message || "Please try again");
      }
    } catch (error: any) {
      setMessage(error.response?.data || error.message);
    } finally {
      setLoading(false);
      getTotals();
    }
  };

  // If initialData changes, update local data
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <>
      {loading && <Loader />}
      {message && <Notification data={message} />}
      <div className="flex flex-wrap gap-1 justify-center">
        {data.length &&
          data.map((x: any) => {
            return (
              <div
                key={x?._id}
                className="my-1 rounded-md overflow-hidden shadow-md bg-white w-full md:w-[300px] lg:w-[400px]"
              >
                <div className="flex justify-between p-2 bg-d-green text-white font-medium">
                  <span>{x?.person}</span>
                  <span>{formatDateToDDMMMYYYY(x?.dateoftransaction)}</span>
                </div>
                <div className="flex flex-col align-middle justify-center text-center">
                  <span>{x?.description}</span>
                  <span className="font-bold text-2xl">
                  ₹ {x?.transactionamount}
                  </span>
                  <span className="flex text-center justify-center items-center gap-3">
                    Type : {checkType(Number(x?.typeoftransaction))}{" "}
                    {x?.typeoftransaction === 1 ? (
                      <FaCaretUp className="text-d-green" />
                    ) : (
                      <FaCaretDown className="text-red-500" />
                    )}
                  </span>
                  <span className="flex text-center justify-center items-center gap-3">
                    Status : {checkSettledStatus(x?.settled)}{" "}
                    {x?.settled ? (
                      <IoMdDoneAll className="text-d-green" />
                    ) : (
                      <FaCircleNotch className="text-red-500" />
                    )}
                  </span>
                </div>
                <div className="flex gap-1 p-2 justify-center">
                  <button
                    className="btn bg-red-600 w-1/4 p-0 min-h-3 h-8 text-white"
                    onClick={() => callDelete(x._id)}
                  >
                    <MdDelete />
                    Delete
                  </button>
                  <button
                    onClick={() => callAction(x)}
                    className="btn bg-d-black w-1/4 p-0 min-h-3 h-8 text-white"
                  >
                    <MdAttachMoney />
                    {x.settled ? "Reopen" : "Close"}
                  </button>
                  <Link
                    href={`notes/${x?._id}`}
                    className={`btn btn-success w-1/4 p-0 min-h-3 h-8 text-white ${x?.settled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => x?.settled && e.preventDefault()}
                  >
                    <MdModeEditOutline />
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Card;
