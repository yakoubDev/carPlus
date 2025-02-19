"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useUser } from "./context/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Process from "@/components/Process";

import {motion} from 'motion/react'

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, setUser } = useUser();

  useEffect(() => {
    console.log("session", session?.user);
    console.log("user:", user);
    if (!session?.user) {
      router.push("/");
    } else if (!user?.role && !user?.phone) {
      router.push("/complete-profile");
    }
  }, [user]);

  return (
    <motion.div
    initial={{opacity:0}}
    animate = {{
      opacity:1,
      transition:{delay:0.8, duration:0.6, ease: "easeIn"}
    }}>
    <div className="flex flex-col items-center justify-center gap-12 xl:flex-row xl:justify-between pt-12">
      <div className="flex flex-col gap-4 w-full xl:w-2/3 text-center xl:text-left items-center xl:items-start">
        <h1 className="text-4xl md:text-7xl font-semibold">
          <span className="text-accent">Fast Assistance</span> When You Need It
          Most
        </h1>
        <p className="text-base md:text-xl max-w-full xl:max-w-[700px] text-white/60">
          Whether you’re on the road or at home, quickly connect with reliable
          roadside assistance and trusted mechanics, ready to help whenever you
          need them.
        </p>

        <div className="flex gap-4">
      
            <button
              onClick={() =>
                session?.user ? router.push('/assist') :  signIn("google", { callbackUrl: "/" }
                 )}
              className="button"
            >
              Get Assistance Now !
            </button>
          
        </div>
      </div>

      <div className="bg-contain">
        <Image
          width={500}
          height={500}
          src="/assets/car-repair.svg"
          alt="Learning"
        />
      </div>
    </div>

    <Process/>
    </motion.div>
  );
};

export default Home;
