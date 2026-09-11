"use client";

import React from "react";
import "./dashboard.css";
import Topbar from "./components/Topbar";
import Greeting from "./components/Greeting";
import Stats from "./components/Stats";
import SummaryInfo from "./components/SummaryInfo";
import { useFormStore } from "~/app/store/form-store";
import { useSocket } from "~/hooks/use-socket";

const Dashboard = () => {

  const liveResponses = useFormStore((s) => s.liveResponses);
  const pushLiveResponse = useFormStore((s) => s.pushLiveResponse);

  useSocket({ "response:created": pushLiveResponse });

  // if (liveResponses.length === 0) return null;
  return (
    <>
      <Topbar />
      <Greeting />
      <Stats />
      <SummaryInfo />
    </>
  );
};

export default Dashboard;
