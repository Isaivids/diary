"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/userSlice";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/axios";
import Loader from "./Loader";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData]: any = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall.get("/user/getuser");
      if (!response.data.error) {
        dispatch(setUserData(response.data.data));
        setData(response.data.data);
      }else{
        router.push('/');
      }
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [dispatch, router]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  return (
    <>
    {loading && <Loader />}
    <nav className="bg-d-green p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-d-white font-bold text-lg">
          <Link href="/notes">Diary</Link>
        </div>
        <div className="hidden md:flex gap-3">
          <Link href="/notes/new" onClick={()=>setIsOpen(false)} className="btn no-animation bg-d-black border-opacity-0 text-d-white hover:bg-d-white hover:border-opacity-0 hover:text-d-black px-3 py-2 rounded">
            New Note
          </Link>
          <div
            className="avatar placeholder"
            onClick={() => setMenuVisible(!menuVisible)}
          >
            <div className="bg-white text-d-green font-bold w-12 rounded-full cursor-pointer">
              <span className="uppercase">
                {data?.username.substring(0, 2) || "U"}
              </span>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col justify-center mt-3 gap-3">
          <div className="flex w-full">
            <Link
              href="/notes/new"
              className="btn w-full bg-d-black border-opacity-0 text-d-white hover:bg-d-white hover:border-opacity-0 hover:text-d-black px-3 py-2 rounded"              onClick={()=>setIsOpen(false)}
            >
              New Note
            </Link>
          </div>
          <div
            className="avatar placeholder flex flex-row-reverse"
            onClick={() => setMenuVisible(!menuVisible)}
          >
            <div className="bg-white text-d-green font-bold w-12 rounded-full cursor-pointer">
              <span className="uppercase">
                {data?.username.substring(0, 2) || "U"}
              </span>
            </div>
            <div className="text-d-white font-bold mx-3">{data?.username || "Unknown"}</div>
          </div>
        </div>
      )}
      {menuVisible && (
        <ul className="menu bg-base-200 rounded-box w-56">
          <li>
            <a>Logout</a>
          </li>
        </ul>
      )}
    </nav>
    </>
  );
};

export default Navbar;
