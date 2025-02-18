import Image from "next/image";
import React from "react";

import { motion } from "motion/react";

const process = [
  {
    number: "1",
    title: "Request Assistance",
    description:
      "Quickly request assistance from our network of mechanics and roadside assistants with just a few clicks, anytime and anywhere.",
    img: "/assets/support.svg",
  },
  {
    number: "2",
    title: "Recieve Real-Time Offers",
    description:
      "Get real-time offers from nearby mechanics and roadside assistants, and stay informed every step of the way.",
    img: "/assets/real-time.svg",
  },
  {
    number: "3",
    title: "Confirm And Relax",
    description:
      "Once you’ve selected your preferred provider, simply confirm the service and relax. Help is on the way.",
    img: "/assets/road_assist.svg",
  },
];

const Process = () => {
  return (
    <section id="process" className="flex flex-col gap-16 w-full py-12 mt-8 ">
      <h1 className="text-center text-6xl text-accent font-semibold uppercase">
        Process
      </h1>
      {process.map((process, index) => (
        <motion.div
          initial={{opacity:0, translateX:-200}}
          whileInView={{
            opacity: 1,
            translateX: 0,
            transition: { delay: 0.3, duration: 0.6, ease: "easeIn" },
          }}
          
          id="wrapper"
          key={index}
          className="group w-full flex flex-col xl:flex-row items-center justify-center gap-4 shadow-md shadow-accent text-center xl:text-start rounded-md py-4"
        >
          {/* LEFT */}
          <div className="flex flex-col gap-2  w-2/3">
            {/* TITLE */}
            <div className="flex justify-center xl:justify-start gap-4 items-center">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                <span className="text-2xl font-semibold text-black">
                  {process.number}
                </span>
              </div>
              <span className="text-2xl font-semibold transition-all  group-hover:tracking-wider ">
                {process.title}
              </span>
            </div>
            {/* DESCRIPTION */}
            <p className="text-white/60 max-w-full xl:max-w-[500px]">
              {process.description}
            </p>
          </div>
          {/* IMAGE */}
          <div>
            <Image
              src={process.img}
              width={300}
              height={300}
              alt=""
              className="group-hover:scale-105 transition-all "
            ></Image>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Process;
