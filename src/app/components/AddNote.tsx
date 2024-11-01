"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { apiCall } from "@/utils/axios";
import Notification from "./Notification";
import { TbProgressCheck } from "react-icons/tb";
import { useParams, useRouter } from "next/navigation";


const AddNote = () => {
  const user = useSelector((state:any) => state.user);
  const [loading, setLoading] = useState(false);
  const router:any = useRouter();
  const params = useParams();
  const [message, setMessage] = useState("")
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const { person, dateOfTransaction, transactionAmount, description, typeOfTransaction } = formData;
    if (!person || !dateOfTransaction || !transactionAmount || !description || typeOfTransaction === undefined) {
      setLoading(false);
      setMessage("Please fill in all required fields.");
      return;
    }
    setMessage('');
    setLoading(true);
    const payload:any = {
      person : person,
      userId: user.data._id,
      dateoftransaction : dateOfTransaction,
      transactionamount : Number(transactionAmount),
      description : description,
      settled : false,
      typeoftransaction : Number(typeOfTransaction)
    }
    if(params.id){
      payload['id'] = params.id
    }
    try {
      const response = await apiCall.post('/note/add',payload)
      if (!response.data.data.error) {
        router.push("/notes");
        setMessage('');
      }else{
        setMessage(response.data.data.message || "Unable to process this now");
      }
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
    }finally {
      setLoading(false);
    }
  };

  const getNoteDetails = useCallback(async (id:any) => {
    try {
      setLoading(true);
      const response = await apiCall.post("/note/getone",{noteId : id});
      if (!response.data.error) {
        const {person, dateoftransaction, transactionamount, typeoftransaction, description} = response.data.data;
        setFormData({
          person: person,
          dateOfTransaction: dateoftransaction.substring(0,10),
          transactionAmount: transactionamount,
          typeOfTransaction: typeoftransaction.toString(),
          description: description
        })
      }
    } catch (error: any) {
      // router.push('/');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(params.id){
      getNoteDetails(params.id)
    }
  }, [getNoteDetails, params.id])
  

  return (
    <>
    {loading && <Loader />}
    {message && <Notification data={message}/>}
    <form onSubmit={handleSubmit} className="m-3">
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex flex-col min-w-56 w-full md:min-w-60 md:w-60">
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
        <div className="flex flex-col min-w-56 w-full md:min-w-60 md:w-60">
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
        <div className="flex flex-col min-w-56 w-full md:min-w-60 md:w-60">
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
        <div className="flex flex-col min-w-56 w-full md:min-w-60 md:w-60">
          <label>Type of Transaction<small>*</small></label>
          <div className="flex items-center h-full justify-start mt-2">
            <input
              type="radio"
              name="typeOfTransaction"
              value={1}
              checked={formData.typeOfTransaction === "1"}
              onChange={handleChange}
              className="me-3 radio radio-primary"
            /> To Receive
            <input
              type="radio"
              name="typeOfTransaction"
              value={2}
              checked={formData.typeOfTransaction === "2"}
              onChange={handleChange}
              className="mx-3 radio radio-primary"
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
        <button type="submit" className="btn btn-primary w-full md:w-64 font-semibold text-white">
          <TbProgressCheck />{params.id ? "Update Note" : "Add Note"}
        </button>
      </div>
    </form>
    </>
  );
};

export default AddNote;
