import Image from "next/image";
import React from "react";

const process = [
  {
    number: "1",
    title: "Request Assistance",
    description: "Quickly request assistance from our network of mechanics and roadside assistants with just a few clicks, anytime and anywhere.",
    img: "/assets/support.svg",
  },
  {
    number: "2",
    title: "Recieve Real-Time Offers",
    description: "Get real-time offers from nearby mechanics and roadside assistants, and stay informed every step of the way.",
    img: "/assets/real-time.svg",
  },
  {
    number: "3",
    title: "Confirm And Relax",
    description: "Once you’ve selected your preferred provider, simply confirm the service and relax. Help is on the way.",
    img: "/assets/road_assist.svg",
  },
];

const Process = () => {
  return (
    <section id="process" className="flex flex-col gap-16 w-full py-12 mt-8 ">
      <h1 className="text-center text-6xl text-accent font-semibold uppercase">Process</h1>
      {process.map((process, index) => (
        <div id="wrapper" key={index} className="w-full flex flex-col xl:flex-row items-center gap-4 ">
          {/* LEFT */}
          <div className="flex flex-col gap-2  w-2/3">
              {/* TITLE */}
              <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-2xl font-semibold text-black">{process.number}</span>
                    </div>
                    <span className="text-2xl font-semibold ">{process.title}</span>
              </div>
              {/* DESCRIPTION */}
              <p className="text-white/60 max-w-full xl:max-w-[500px]">{process.description}</p>
          </div>
          {/* IMAGE */}
          <div> 
            <Image src={process.img} width={300} height={300} alt=""></Image>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Process;
