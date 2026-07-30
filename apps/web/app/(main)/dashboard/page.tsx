import React from "react";
import "./dashboard.css";
import Topbar from "./components/Topbar";
import Greeting from "./components/Greeting";
import Stats from "./components/Stats";
import SummaryInfo from "./components/SummaryInfo";

const Dashboard = () => {
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
