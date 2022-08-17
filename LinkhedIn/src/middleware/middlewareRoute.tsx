import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar/navbar";
import { useUserAuth } from "../hooks/userContext";
import Home from "../page/home/home";
import Network from "../page/network/network";
import Profile from "../page/profile/profile";
import Search from "../page/search/search";

export default function MiddlewareRoutes() {
  const { getUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (getUser) {
      const user = getUser();
      if (
        user === undefined ||
        user === null ||
        user === false ||
        Object.keys(user).length == 0
      ) {
        navigate("/login");
      }
    }
  }, [getUser]);

  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/network" element={<Network />}></Route>
        <Route path="/search/:query" element={<Search />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
      </Routes>
    </>
  );
}