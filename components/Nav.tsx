"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

import { motion } from "motion/react";
import Image from "next/image";

  const Nav = () => {
    type Notification = {
      id: string;
      driverName: string;
      driverPhone: string;
      driverEmail: string;
      rescuerEmail: string;
      location: {
        latitude: number;
        longitude: number;
      };
      status: "pending" | "accepted" | "declined";
    };
    
  const pathname = usePathname();
  const links = [
    { name: "Home", path: "/" },
    { name: "Process", path: `${pathname === "/" ? "#process" : "/#process"}` },
    { name: "Assist", path: "/assist" },
  ];

  const { data: session, status } = useSession();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/get-notifications?email=${session?.user.email}`);
          const data = await response.json();

          console.log(data);
          console.log(notifications);

          if (response.ok) {
            setNotifications(data.notifications);
          } else {
            console.error("Failed to fetch notifications", data.message);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
  
    getNotifications();
  }, [status, session?.user?.email]);
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.8, duration: 0.6, ease: "easeIn" },
      }}
    >
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-4xl inline-flex gap-1">
          <span>Car</span>
          <span className="text-accent">+</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex gap-8 items-center">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              className={`${
                link.path === pathname && "text-accent border-b-2 border-accent"
              } font-medium hover:text-accent transition-all`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex gap-4 items-center ml-8 relative">
            {session?.user ? (
              <>
                <button
                  className="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </button>

                {/* 🔔 Notifications */}
                <div className="relative flex">
                  <FaBell
                    className="text-[24px] cursor-pointer hover:text-accent"
                    onClick={() => setShowNotifications((prev) => !prev)}
                  />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {notifications.length}
                    </span>
                  )}

                  {/* Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-10 right-0 bg-primary shadow-lg border rounded-md w-[500px] z-50 p-2">
                      {notifications.length > 0 ? (
                        notifications.map((note,index) => (
                          <div
                            key={index}
                            className="text-sm py-4 px-2 hover:bg-gray-200 text-white hover:text-black cursor-pointer flex justify-between   items-center"
                          >
                            <p>New Request from {note.driverName}</p>
                            <div className="flex gap-2">
                              <button className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition">
                                <FaCheck />
                              </button>
                              <button className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition">
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 px-2 py-2">
                          No new notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile */}
                <Link href={"/complete-profile"}>
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <CgProfile className="text-[40px] hover:text-accent transition-all" />
                  )}
                </Link>
              </>
            ) : (
              <button
                className="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex xl:hidden gap-8">
          {session?.user && (
            <Link href={"/complete-profile"}>
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <CgProfile className="text-[34px] hover:text-accent transition-all" />
              )}
            </Link>
          )}

          {/* 🔔 Notifications */}
          {session?.user && (
            <div className="relative flex items-center justify-center xl:hidden">
              <FaBell
                className="text-[24px] cursor-pointer hover:text-accent"
                onClick={() => setShowNotifications((prev) => !prev)}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute top-10 right-[-70px] bg-primary shadow-lg border rounded-md w-[360px] z-50 p-2">
                  {notifications.length > 0 ? (
                    notifications.map((note,index) => (
                      <div
                        key={index}
                        className="text-xs py-4 px-2 hover:bg-gray-200 text-white hover:text-black cursor-pointer flex justify-between items-center"
                      >
                        <p>New Request from {note.driverName}</p>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition">
                            <FaCheck />
                          </button>
                          <button className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 px-2 py-2">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {toggleMenu ? (
            <IoMdClose
              className="text-[32px] text-accent"
              onClick={() => setToggleMenu((prev) => !prev)}
            />
          ) : (
            <CiMenuFries
              className="text-[32px] text-accent"
              onClick={() => setToggleMenu((prev) => !prev)}
            />
          )}
        </div>

        {toggleMenu && (
          <div className="bg-primary w-[60%] py-4 fixed right-0 top-0 flex flex-col gap-8 justify-center items-center rounded-md slide-in-right z-40">
            <div className="flex justify-end items-center w-full px-4">
              <IoMdClose
                className="text-[32px] text-accent flex flex-end"
                onClick={() => setToggleMenu((prev) => !prev)}
              />
            </div>

            <Link
              href="/"
              className="text-4xl inline-flex gap-1"
              onClick={() => setToggleMenu(false)}
            >
              <span>Car</span>
              <span className="text-accent">+ </span>
            </Link>

            {links.map((link, index) => (
              <Link
                href={link.path}
                key={index}
                onClick={() => setToggleMenu(false)}
                className={`${
                  link.path === pathname &&
                  "text-accent border-b-2 border-accent"
                } font-medium hover:text-accent transition-all`}
              >
                {link.name}
              </Link>
            ))}

            {session?.user ? (
              <button
                className="button"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            ) : (
              <button
                className="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>
    </motion.div>
  );
};

export default Nav;
