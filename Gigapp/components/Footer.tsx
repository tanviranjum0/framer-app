"use client";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { addNewNotification } from "./Notification";
import { imageToBase64 } from "@/utils/base64toImage";
const Footer = () => {
  const [service, setService] = useState<string>("Consulting");
  const [budget, setBudget] = useState("0k");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>("");
  const mainContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainContainer,
    offset: ["start end", "end start"],
  });
  const margin = useTransform(scrollYProgress, [0, 1], [80, 160]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const name = document.getElementById("name") as HTMLInputElement;
      const email = document.getElementById("email") as HTMLInputElement;
      const message = document.getElementById("message") as HTMLInputElement;
      const image = document.getElementById("dropzone-file")
        ?.files[0] as HTMLInputElement;

      if (!name.value || !email.value || !message.value) {
        return addNewNotification({
          message: "Please fill all required fields.",
          type: "error",
        });
      }
      if (!/\S+@\S+\.\S+/.test(email.value)) {
        return addNewNotification({
          message: "Please enter a valid email address.",
          type: "error",
        });
      }
      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("service", service);
      formData.append("budget", budget);
      formData.append("email", email.value);
      formData.append("message", message.value);

      if (!image) {
        formData.append("isValidImage", "false");
      } else {
        // cast to any (or to the exact expected param shape) so TypeScript matches the util signature
        imageToBase64({
          file: image,
          setSelectedImageBase64: setSelectedImageBase64,
        } as any);
        formData.append("image", selectedImageBase64);
        formData.append("isValidImage", "true");
      }
      const apiCall = async () => {
        const res = await fetch("/api/message", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          return addNewNotification({
            message: "Message Sent! Thanks.",
            type: "success",
          });
        } else {
          return addNewNotification({
            message: "There was a problem sending message",
            type: "error",
          });
        }
      };
      apiCall();
    } catch {
      addNewNotification({
        message: "Something Went Wrong",
        type: "error",
      });
    }
  };
  return (
    <div className=" bg-image-footer">
      <div className="h-[85vh] text-white -z-10 box-border w-full  flex justify-center items-center">
        <motion.div
          ref={mainContainer}
          style={{
            margin,
          }}
          className="h-full w-full opacity-100 bg-linear-to-r/oklch from-teal-500 to-black rounded-4xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="px-20 py-10 flex flex-col h-[85vh] gap-20 justify-between">
              <div className="">
                <div className="text-5xl pb-10">Tell me about your project</div>
                <div className="flex flex-col gap-2">
                  <div className="text-xl gap-2 flex items-center">
                    <IoShieldCheckmarkSharp />
                    <span>I will respond you within 12 hours</span>
                  </div>
                  <div className="text-xl gap-2 flex items-center">
                    <IoShieldCheckmarkSharp />
                    <span>I will sign an NDA if requested</span>
                  </div>
                  <div className="text-xl gap-2 flex items-center">
                    <IoShieldCheckmarkSharp />
                    <span>Access to dedicated consultant specialist</span>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col gap-5">
                <div
                  onClick={() =>
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&to=roksanakhanamseo@gmail.com&su=Framer%20motion%20business%20discussion&body=Type%20your%20message%20here!",
                      "_blank"
                    )
                  }
                  className="my-2 underline cursor-pointer"
                >
                  tanviranjum010@gmail.com
                </div>
                <div className="text-xl">
                  Always busy and want to book an exact time to call?
                </div>
                <div
                  onClick={() =>
                    addNewNotification({
                      message: "Booking feature coming soon!",
                      type: "info",
                    })
                  }
                  className="rounded-full select-none cursor-pointer w-52 text-center font-bold p-3 bg-cyan-800"
                >
                  Book a call for free
                </div>
              </div>
            </div>
            <div className="px-20 py-10 select-none flex flex-col h-[85vh] justify-between">
              <div className="">
                <div className="">
                  <div className="text-2xl">Service</div>
                  <div className="flex gap-2">
                    <span
                      onClick={() => setService("Consulting")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Consulting" && "bg-lime-800"
                      }`}
                    >
                      Consulting
                    </span>
                    <span
                      onClick={() => setService("Website")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Website" && "bg-lime-800"
                      }`}
                    >
                      Website
                    </span>
                    <span
                      onClick={() => setService("Animation")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Animation" && "bg-lime-800"
                      }`}
                    >
                      Animation
                    </span>
                    <span
                      onClick={() => setService("Backend")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Backend" && "bg-lime-800"
                      }`}
                    >
                      Backend
                    </span>
                  </div>
                </div>
                <div className="">
                  <div className="text-2xl">Budget</div>
                  <div className="flex gap-2">
                    <span
                      onClick={() => setBudget("0k")}
                      className={`footerBtn py-1 px-1.5 ${
                        budget == "0k" && "bg-lime-800"
                      }`}
                    >
                      Less than $10k
                    </span>
                    <span
                      onClick={() => setBudget("10k")}
                      className={`footerBtn py-1 px-1.5 ${
                        budget == "10k" && "bg-lime-800"
                      }`}
                    >
                      $10k to $50k
                    </span>
                    <span
                      onClick={() => setBudget("50k")}
                      className={`footerBtn py-1 px-1.5 ${
                        budget == "50k" && "bg-lime-800"
                      }`}
                    >
                      More than $50k
                    </span>
                  </div>
                </div>
              </div>
              <form autoComplete="on" className="mx-auto w-full">
                <div className="flex gap-3">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="name"
                      className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Full Name*
                    </label>
                  </div>
                  <div className="relative z-0 w-full group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                      placeholder=""
                      required
                    />
                    <label
                      htmlFor="email"
                      className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email*
                    </label>
                  </div>
                </div>
                <div className="relative z-0 w-full mt-3 group">
                  <input
                    type="text"
                    name="message"
                    id="message"
                    className="block py-2.5 px-0 w-full  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="message"
                    className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Message*
                  </label>
                </div>
                <div className="flex flex-col ">
                  <div className="text-2xl my-3">Attach a file(optional)</div>
                  <div className="flex items-center mb-4 justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full  border-2 border-gray-100 rounded-lg cursor-pointer bg-gray-900 "
                    >
                      <div className="flex flex-col  items-center justify-center py-3">
                        <svg
                          className="w-4 h-4  text-gray-100"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="text-sm text-gray-300">
                          <span id="fileSelectStatus" className="font-semibold">
                            {selectedFile
                              ? selectedFile.name
                              : "Click to upload"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-300">
                          PNG, JPG or JPEG (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        onChange={(e) => handleFileChange(e)}
                        id="dropzone-file"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="rounded-full cursor-pointer min-w-max sm:w-full border-2  border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px]  hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
