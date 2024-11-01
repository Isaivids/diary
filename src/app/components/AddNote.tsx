"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { apiCall } from "@/utils/axios";


const AddNote = () => {
  const user = useSelector((state:any) => state.user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = sessionStorage.getItem("idToken") || "";
  // State to manage form values
  const [formData, setFormData] = useState({
    person: "",
    dateOfTransaction: "",
    transactionAmount: 0,
    typeOfTransaction: "1",
    description: ""
  });

  // Handle input changes
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    console.log(name,value)
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log("Form Data:", formData,user);
    setLoading(true);
    const payload = {
      person : formData.person,
      userId: user.data._id,
      dateoftransaction : formData.dateOfTransaction,
      transactionamount : Number(formData.transactionAmount),
      description : formData.description,
      settled : false,
      typeoftransaction : Number(formData.typeOfTransaction)
    }
    try {
      const response = await apiCall.post('/note/add',payload)
      if (!response.data.data.error) {
        router.push("/notes");
      }
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loader />}
    <form onSubmit={handleSubmit} className="m-3">
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex flex-col">
          <label htmlFor="person">
            Name of the person<small>*</small>
          </label>
          <input
            id="person"
            name="person"
            type="text"
            value={formData.person}
            onChange={handleChange}
            className="input input-bordered min-w-56 w-full md:min-w-60 md:w-60 mt-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dateOfTransaction">
            Date of Transaction<small>*</small>
          </label>
          <input
            id="dateOfTransaction"
            name="dateOfTransaction"
            type="date"
            value={formData.dateOfTransaction}
            onChange={handleChange}
            className="input input-bordered min-w-56 w-full md:min-w-60 md:w-60 mt-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="transactionAmount">
            Transaction Amount<small>*</small>
          </label>
          <input
            id="transactionAmount"
            name="transactionAmount"
            type="number"
            value={formData.transactionAmount}
            onChange={handleChange}
            className="input input-bordered min-w-56 w-full md:min-w-60 md:w-60 mt-2"
          />
        </div>
        <div className="flex flex-col">
          <label>Type of Transaction<small>*</small></label>
          <div className="flex items-center h-full justify-center">
            <input
              type="radio"
              name="typeOfTransaction"
              value={1}
              checked={formData.typeOfTransaction === "1"}
              onChange={handleChange}
              className="radio radio-primary"
            /> To Receive
            <input
              type="radio"
              name="typeOfTransaction"
              value={2}
              checked={formData.typeOfTransaction === "2"}
              onChange={handleChange}
              className="ms-3 radio radio-primary"
            /> To Send
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center items-center w-full mt-3">
        <div className="flex flex-col w-full md:w-3/4">
          <label htmlFor="description">
            Description<small>*</small>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full min-w-full"
            placeholder="Type Description Here"
          ></textarea>
        </div>
      </div>
      <div className="flex gap-3 justify-center items-center w-full mt-3">
        <button type="submit" className="btn btn-info w-full md:w-32">
          Submit
        </button>
      </div>
    </form>
    </>
  );
};

export default AddNote;
