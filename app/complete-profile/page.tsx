"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useRouter } from "next/navigation";

const CompleteProfile = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(()=>{
    if(user?.role || user?.phone){
      router.push('/');
    }
  },[])
  


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user.role || !user.phone) {
      setError("Please fill the fields.");
      return;
    }

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSuccess("You're registered welcome !");
        setTimeout(()=>{
          router.push('/')
        },1000)
      }
    } catch (error) {
      setError("Something went wrong ...");
      console.log(error);
    }
  };

  return (
    <section className=" mx-auto container flex justify-center items-center h-[60vh] mt-10 ">
      <div className=" flex flex-col justify-center items-center p-8  bg-black/30 w-[650px] rounded-md">
        <h1 className="text-accent text-4xl font-semibold mb-4">Complete your profile!</h1>
       
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full  mx-auto  p-4 text-white mt-4"
        >
          <select
            name=""
            required
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            className="input"
          >
            <option value="">Select your account type</option>
            <option value="driver">Driver</option>
            <option value="mechanic">Mechanic</option>
            <option value="road_assist">Road Assist</option>
          </select>
          <input
            type="phone"
            placeholder="Phone Number"
            className="input"
            required
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
          <button className="button" type="submit">Submit</button>
        </form>
          {success && <div className="text-green-500 text-xl">{success}</div>}
          {error && <div className="text-red-500 text-xl">{error}</div>}
      </div>
    </section>
  );
};

export default CompleteProfile;
