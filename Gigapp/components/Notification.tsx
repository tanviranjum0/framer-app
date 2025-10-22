"use client";
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// import { imageToBase64 } from "@/utils/base64toImage";

interface PathProps extends React.ComponentProps<typeof motion.path> {}

const Path: React.FC<PathProps> = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const CloseButton = ({ close }: { close: () => void }) => (
  <button
    onClick={close}
    className="absolute top-3.5 right-2.5  bg-white border-none"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path d="M 3 16.5 L 17 2.5" />
      <Path d="M 3 2.5 L 17 16.346" />
    </svg>
  </button>
);
let addNewNotification: ({
  message,
  type,
}: {
  message: string;
  type: string;
}) => void;
const Notification = () => {
  const [notifications, setNotifications] = useState<
    { message: string; type: string }[]
  >([]);
  addNewNotification = ({
    message,
    type,
  }: {
    message: string;
    type: string;
  }) => {
    setNotifications((prev) => {
      if (!prev) {
        return [
          {
            message: message,
            type: type,
          },
        ];
      } else {
        return [...prev, { message, type }];
      }
    });
  };
  const remove = (index: number) => {
    const newArr = notifications.filter((_, i) => i !== index);
    setNotifications(newArr);
  };
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col">
      <ul className="fixed right-0 top-0  bottom-0 flex flex-col list-none justify-end">
        <AnimatePresence initial={false} mode="popLayout">
          {notifications?.map((noti, index) => {
            return (
              <MicroNotification
                key={noti.message + index}
                message={noti.message}
                type={noti.type}
                index={index}
                remove={remove}
                setNotifications={setNotifications}
              />
            );
          })}
        </AnimatePresence>
      </ul>
      {/* <button
        className="outline-none appearance-none cursor-pointer fixed bottom-2.5 left-2.5 w-16 h-16 rounded-[50%] text-2xl border-none flex bg-black justify-center items-center"
        onClick={() =>
          addNewNotification({ message: "Notification Hello", type: "error" })
        }
      >
        +
      </button> */}
    </div>
  );
};

const MicroNotification = ({
  message,
  type,
  index,
  remove,
}: {
  message: string;
  type: string;
  index: number;
  remove: (index: number) => void;
  setNotifications: React.Dispatch<
    React.SetStateAction<{ message: string; type: string }[]>
  >;
}) => {
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      remove(index);
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [index, remove]);
  return (
    <div>
      <motion.li
        layout
        className="w-[300px] bg-white m-2.5 relative rounded-xl grow-0 shrink-0 basis-24"
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
      >
        <div
          className={`text-black p-5 font-bold ${
            type === "error" && "text-red-500"
          }  ${type === "info" && "text-blue-500"} ${
            type === "success" && "text-green-700"
          }`}
        >
          {message}
        </div>
        <CloseButton close={() => remove(index)} />
      </motion.li>
    </div>
  );
};

export { addNewNotification };

export default Notification;
