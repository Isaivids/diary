"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../store/userSlice";
import Notification from "./Notification";

type LoginProps = {
  type: number;
};

const Login = ({ type }: LoginProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state:any) => state.user.data);
  const [message, setMessage] = useState('');

  const validateForm = (username: string | undefined, password: string | undefined, retypePassword?: string) => {
    // Check if username is present and has a max length of 10
    if (!username || username.length > 10) {
      return "Username must be 10 characters or less.";
    }

    // Check if username and password are the same
    if (username === password) {
      return "Username and password cannot be the same.";
    }

    // Validate password for special character, number, uppercase, and lowercase
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{1,}$/;
    if (!password || !passwordPattern.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    // If type is 2 (register), check if passwords match
    if (type === 2 && password !== retypePassword) {
      return "Passwords do not match. Please try again.";
    }

    return null;
  };

  const navigateToNotes = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const retypePassword = formData.get("retypepassword")?.toString();

    const payload = { username, password };
    if(type === 1){
      callLogin(payload);
    } else {
      const errorMessage = validateForm(username, password, retypePassword);
      if (errorMessage) {
        setMessage(errorMessage);
        return;
      }
      callRegister(payload);
    }
  };

  const callRegister = async (payload: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/user/register', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.data.error) {
        router.push("/");
      } else {
        setMessage(response.data.message);
      }
    } catch (error: any) {
      console.error("Error registering:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  const callLogin = async (payload: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/user/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.data.error) {
        sessionStorage.setItem('idToken', response.data.data.token);
        dispatch(setUserData(response.data.data));
        router.push("/notes");
      } else {
        setMessage(response.data.message || "Please try again");
      }
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col justify-center bg-white m-2 p-4 rounded-md shadow-sm w-4/5 md:w-1/4 ">
        {message && <Notification data={message} />}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {type === 1 ? "Sign in to your account" : "Create your account"}
          </h2>
        </div>
        <div className="mt-4">
          <form
            onSubmit={navigateToNotes}
            method="POST"
            className="flex flex-col gap-3"
          >
            <div>
              <label
                htmlFor="d-username"
                className="text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <br />
              <input
                type="text"
                id="d-username"
                name="username"
                autoComplete="off"
                className="input input-bordered w-full bg-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="d-password"
                className="text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <br />
              <input
                id="d-password"
                name="password"
                type="password"
                autoComplete="off"
                className="input input-bordered w-full bg-slate-100"
              />
            </div>
            {type === 2 && (
              <div>
                <label
                  htmlFor="retypepassword"
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  Re-type password
                </label>
                <input
                  id="retypepassword"
                  name="retypepassword"
                  type="password"
                  autoComplete="off"
                  className="input input-bordered w-full bg-slate-100"
                />
                <br />
              </div>
            )}
            <button type="submit" className="btn btn-success text-red-50">
              {type === 1 ? "Sign in" : "Register"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm/6 text-gray-500">
            {type === 1 ? "New User?" : "Already an user"}
            <Link
              href={type === 1 ? "/register" : "/"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {" "}{type === 1 ? "Create an account" : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
