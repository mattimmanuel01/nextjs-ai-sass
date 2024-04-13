import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import React from "react";
import { getApiLimitCount } from "@/lib/api-limit";
import AxiosInterceptor from "@/components/axioxInterceptor";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();

  return (
    <>
      <AxiosInterceptor></AxiosInterceptor>
      <div className="h-full relative">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0  bg-gray-900">
          <Sidebar apiLimitCount={apiLimitCount} />
        </div>
        <main className="md:pl-72">
          <Navbar apiLimitCount={apiLimitCount} />
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
