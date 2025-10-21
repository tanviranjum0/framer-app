import Gigapp from "@/Gigapp/Gigapp";
import React from "react";
import Notification from "@/Gigapp/components/Notification";
const page = () => {
  return (
    <div className="h-[100vh] w-[100vw]">
      <Gigapp />
      <Notification />
    </div>
  );
};

export default page;
