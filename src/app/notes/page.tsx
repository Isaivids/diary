"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Card from '../components/Card';
import { useSelector } from 'react-redux';
import { apiCall } from '@/utils/axios';
import Loader from '../components/Loader';

const Notes = () => {
  const user = useSelector((state:any) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall.get("/note/view")
      if (!response.data.error) {
        setData(response.data.data);
      }else{
        // router.push('/');
      }
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
      // router.push('/');
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);
  
  return (
    <>
    {loading && <Loader />}
    <div className="p-2">
      <div className="flex gap-3 w-full mb-2">
        <input
          type="text"
          placeholder="Search"
          className="rounded-md w-4/5 p-2 bg-slate-200 outline-0 border-0 text-gray-900 shadow-sm"
        />
        <button className="w-1/5 bg-indigo-600 text-white px-3 rounded-md">Search</button>
      </div>
      <Card data={data}/>
    </div>
    </>
  );
};

export default Notes;
