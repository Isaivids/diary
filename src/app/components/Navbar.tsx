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
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link href="/notes">Diary</Link>
        </div>
        <div className="hidden md:flex gap-3">
          <Link href="/notes/new" className="btn btn-secondary px-3 py-2 rounded">
            New Note
          </Link>
          <div
            className="avatar placeholder"
            onClick={() => setMenuVisible(!menuVisible)}
          >
            <div className="bg-white text-indigo-600 font-bold w-12 rounded-full cursor-pointer">
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
        <div className="md:hidden flex justify-center mt-3">
          <div className="bg-indigo-600">
            <Link
              href="/notes/new"
              className="text-white hover:bg-indigo-300 px-3 py-2 rounded"
            >
              New Note
            </Link>
          </div>
        </div>
      )}
      {menuVisible && (
        <ul className="menu bg-base-200 rounded-box w-56">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
