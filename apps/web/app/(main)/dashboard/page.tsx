import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Dashboard = async () => {
  const user = await currentUser()
  const { id, emailAddresses } = user!;

  return (
    <div>
      <div>Dashboard page</div>
      <p>User: {id}</p>
      <p>Email: {emailAddresses[0]?.emailAddress}</p>
    </div>
  );
};

export default Dashboard;
