"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useRouter } from "next/navigation";

import { FaPhoneAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

import Image from "next/image";

import { motion } from "motion/react";

const CompleteProfile = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!user.phone?.trim() || !user.role?.trim()) {
        throw new Error("Please fill all required fields");
      }

      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile");
      }
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/"), 1000);

    } catch (error: any) {
      setError(error.message || "Something went wrong...");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto flex justify-between items-center h-[80vh]  my-10">
      <motion.div
        initial={{ opacity: 0, translateX: -200 }}
        whileInView={{
          opacity: 1,
          translateX: 0,
          transition: { delay: 0.3, duration: 0.6, ease: "easeIn" },
        }}
        className="bg-contain hidden md:block"
      >
        <Image
          src={"/assets/profile.svg"}
          width={380}
          height={380}
          alt="Complete Profile"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 0.5, duration: 0.6, ease: "easeIn" },
        }}
        className="flex flex-col justify-center items-center py-2 xl:p-8 bg-black/10 w-full xl:w-[650px] rounded-md shadow-md shadow-accent"
      >
        <h1 className="text-accent text-3xl xl:text-4xl font-semibold mt-2 text-center  w-[95%]">
          Complete your profile!
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full mx-auto p-4 text-white mt-4"
        >
          {/* Custom Input */}
          {/* Username */}
          <div className="input-pic">
            <MdOutlineDriveFileRenameOutline className="text-2xl text-accent font-bold" />
            <input
              type="text"
              placeholder="Full Name"
              className="input w-full border-none"
              required
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="input-pic">
            <FaPhoneAlt className="text-xl text-accent font-bold" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input w-full border-none"
              required
              pattern="0[0-9]{9}"
              value={user?.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

          <div className="input-pic">
            <CgProfile className="text-2xl text-accent font-bold" />
            <select
              required
              value={user?.role || ""}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="input w-full border-none"
            >
              <option value="">Select Role...</option>
              <option value="Driver">Driver</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Road Assist">Road Assist</option>
            </select>
          </div>

          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </form>

        {true && <div className="text-green-500 text-center ">{success}</div>}
        {error && <div className="text-red-500 text-center ">{error}</div>}
      </motion.div>
    </section>
  );
};

export default CompleteProfile;
