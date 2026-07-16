"use client"
// import { api } from "~/trpc/server";
import { trpc } from "~/trpc/client";

export default function Home() {
  // const { status } = await api.health.getHealth.query();
  // const { message } = await api.chaicode.query({ email: "visshnnutejaa@gmail.com" })
  const { data } = trpc.chaicode.useQuery({ email: "vt@gmail.com" })
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2>Server Status: {status}</h2>
        <p>Message: {data?.message}</p>
      </div>
    </main>
  );
}
