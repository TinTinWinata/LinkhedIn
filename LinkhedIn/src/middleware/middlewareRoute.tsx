import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "../component/Footer/footer";
import Navbar from "../component/Navbar/navbar";
import { useUserAuth } from "../hooks/userContext";
import CreateJob from "../page/create-job/createJob";
import Game from "../page/games/game";
import Home from "../page/home/home";
import Job from "../page/job/job";
import Message from "../page/message/message";
import Network from "../page/network/network";
import Notification from "../page/notification/notification";
import Post from "../page/post/post";
import Profile from "../page/profile/profile";
import Information from "../page/register/information/information";
import CreateRoom from "../page/room/createRoom";
import { MyRoom } from "../page/room/myRoom";
import { Room } from "../page/room/room";
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
      {/* <div className="inside-bg">
        <div className="inside-container"> */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* <Route path="/*" element={<Home />}></Route> */}
        <Route path="/network" element={<Network />}></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/search/:query" element={<Search />}></Route>
        <Route path="/job" element={<Job />}></Route>
        <Route path="/notification" element={<Notification />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
        <Route path="/create-job" element={<CreateJob />}></Route>
        <Route
          path="/information/:id"
          element={<Information mode={"google"} />}
        ></Route>
        <Route path="/post/:id" element={<Post />}></Route>
        <Route
          path="/room-create/:id/:time"
          element={<Room mode={"create"} callId={""} />}
        ></Route>
        <Route
          path="/room-create/:id"
          element={<Room mode={"create"} callId={""} />}
        ></Route>
        <Route
          path="/room/:id"
          element={<Room mode={"join"} callId={""} />}
        ></Route>
        <Route path="/server/:id" element={<MyRoom />}></Route>

        <Route path="/create-room" element={<CreateRoom />}></Route>
        <Route path="/*" element={<Game></Game>}></Route>
      </Routes>
      {/* </div>
      </div>
      <Footer></Footer> */}
    </>
  );
}
