"use client";
import React, { useCallback, useEffect, useState } from "react";
import Card from "../components/Card";
import { apiCall } from "@/utils/axios";
import Loader from "../components/Loader";
import { LuFilter } from "react-icons/lu";
import { RiCloseLargeLine } from "react-icons/ri";

const Notes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  
  const [filters, setFilters] = useState({
    range: 25000,
    dateOfTransactionStart: lastYear.toISOString().split('T')[0],  // Format to YYYY-MM-DD
    dateOfTransactionEnd: today.toISOString().split('T')[0],       // Format to YYYY-MM-DD
    transactionType: {
      send: true,
      receive: true,
    },
    status: {
      done: true,
      pending: true,
    },
  });

  const handleRangeChange = (e: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      range: parseInt(e.target.value, 10),
    }));
  };

  const handleDateChange = (e: any, field: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: e.target.value,
    }));
  };

  const handleCheckboxChange = (category: any, field: any) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [field]: !prevFilters[category][field],
      },
    }));
  };

  const getUserDetails = useCallback(async (filter:any='') => {
    try {
      setLoading(true);
      const response = await apiCall.get(`/note/view${filter}`);
      if (!response.data.error) {
        setData(response.data.data);
      } else {
        // Handle error, e.g., redirect to another page
      }
    } catch (error: any) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setIsDrawerOpen(false)
    // Construct query parameters for API
    const queryParams = new URLSearchParams();
    if (search) {
      queryParams.append("search", search.toString());
    }
    if(filters.range >= 25000){

    }else if (filters.range) {
      queryParams.append("amountFrom", "0");
      queryParams.append("amountTo", filters.range.toString());
    }
    if (filters.dateOfTransactionStart) {
      queryParams.append("dateFrom", filters.dateOfTransactionStart);
    }
    if (filters.dateOfTransactionEnd) {
      queryParams.append("dateTo", filters.dateOfTransactionEnd);
    }
    // Transaction type filter
    if (filters.transactionType.send && filters.transactionType.receive) {
      // If both done and pending are true, we do not filter on settled, 
    } else if (filters.transactionType.send) {
      queryParams.append("transactionType", "2");
    } else if (filters.transactionType.receive) {
      queryParams.append("transactionType", "1");
    }

    // Status filter (settled)
    if (filters.status.done && filters.status.pending) {
      // If both done and pending are true, we do not filter on settled, 
    } else if (filters.status.done) {
      queryParams.append("settled", "true");
    } else if (filters.status.pending) {
      queryParams.append("settled", "false");
    }
    getUserDetails(`?${queryParams.toString()}`);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {loading && <Loader />}
      <form className="p-2" onSubmit={(e) => handleSearch(e)}>
        <div className="flex gap-3 w-full mb-2">
          <input
            type="text"
            value={search}
            placeholder="Search person name or description"
            onChange={(e: any) => setSearch(e.target.value)}
            className="rounded-md w-4/5 p-2 outline-0 border-0 shadow-sm"
          />
          <button className="w-1/5 btn bg-d-green text-white px-3 rounded-md">
            Search
          </button>
          <div
            onClick={toggleDrawer}
            className="btn bg-d-black flex items-center justify-center text-white rounded-md"
          >
            <LuFilter />
          </div>
        </div>
        {data.length ? <Card data={data} /> : "No data found"}
      </form>

      {/* Drawer Component */}
      <div
        className={`fixed z-40 top-0 left-0 h-full bg-d-white2 p-4 transition-transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "75%" }}
      >
        <form
          className="content flex flex-col"
          onSubmit={(e) => handleSearch(e)}
        >
          <button
            onClick={toggleDrawer}
            className="mb-4 btn bg-d-black hover:bg-d-green btn-circle text-white px-2"
          >
            <RiCloseLargeLine />
          </button>
          <div className="filters">
            <div className="flex flex-col gap-3">
              <span>
                Amount to search : 0 -{" "}
                {filters.range >= 25000 ? "25000+" : filters.range}
              </span>
              <input
                type="range"
                min={0}
                max={25000}
                value={filters.range}
                onChange={handleRangeChange}
                className="range"
              />
            </div>
            <div className="flex flex-col gap-3 mt-5">
              <label htmlFor="dateOfTransaction">Date of Transaction</label>
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <input
                  id="dateOfTransactionStart"
                  name="dateOfTransactionStart"
                  type="date"
                  value={filters.dateOfTransactionStart}
                  onChange={(e) =>
                    handleDateChange(e, "dateOfTransactionStart")
                  }
                  className="md:w-2/5"
                />
                <span>to</span>
                <input
                  id="dateOfTransactionEnd"
                  name="dateOfTransactionEnd"
                  type="date"
                  value={filters.dateOfTransactionEnd}
                  onChange={(e) => handleDateChange(e, "dateOfTransactionEnd")}
                  className="md:w-2/5"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-5">
              <label>Type of transaction</label>
              <div className="flex gap-5">
                <label
                  htmlFor="send"
                  className="flex items-center gap-2 md:w-1/5"
                >
                  <input
                    type="checkbox"
                    checked={filters.transactionType.send}
                    onChange={() =>
                      handleCheckboxChange("transactionType", "send")
                    }
                    className="checkbox"
                  />
                  To Send
                </label>
                <label
                  htmlFor="receive"
                  className="flex items-center gap-2 md:w-1/5"
                >
                  <input
                    type="checkbox"
                    checked={filters.transactionType.receive}
                    onChange={() =>
                      handleCheckboxChange("transactionType", "receive")
                    }
                    className="checkbox"
                  />
                  To Receive
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-5 flex-wrap">
              <label>Status</label>
              <div className="flex gap-5">
                <label
                  htmlFor="done"
                  className="flex items-center gap-2 md:w-1/5"
                >
                  <input
                    type="checkbox"
                    checked={filters.status.done}
                    onChange={() => handleCheckboxChange("status", "done")}
                    className="checkbox"
                  />
                  Done
                </label>
                <label
                  htmlFor="pending"
                  className="flex items-center gap-2 md:w-1/5"
                >
                  <input
                    type="checkbox"
                    checked={filters.status.pending}
                    onChange={() => handleCheckboxChange("status", "pending")}
                    className="checkbox"
                  />
                  Pending
                </label>
              </div>
            </div>
            <button className="mt-5 w-full btn bg-d-green border-none text-d-white hover:bg-d-black">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default Notes;
