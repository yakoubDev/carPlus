"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaCheck, FaTimes, FaBell } from "react-icons/fa";

import { motion } from "motion/react";
import { toast } from "sonner";
import Image from "next/image";
import Email from "next-auth/providers/email";
import { useRouter } from "next/navigation";

const Nav = () => {
  type Notification = {
    id: string;
    driverName: string;
    driverPhone: string;
    driverEmail: string;
    rescuerEmail: string;
    rescuerName: string;
    location: {
      latitude: number;
      longitude: number;
    };
    status: "pending" | "accepted" | "rejected";
    message: string;
  };

  const pathname = usePathname();
  const router = useRouter();
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
          const response = await fetch(
            `/api/get-notifications?email=${session.user.email}`
          );
          const data = await response.json();
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

    const interval = setInterval(getNotifications, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, [status, session?.user?.email]);

  const filteredNotifications = notifications.filter((notif) => {
    const email = session?.user.email;
    if (!email) return false;

    return (
      (notif.status === "pending" && notif.rescuerEmail === email) ||
      ((notif.status === "accepted" || notif.status === "rejected") &&
        notif.driverEmail === email)
    );
  });

  const notificationCount = filteredNotifications.length;

  const acceptRequest = async (note: Notification, index: number) => {
    try {
      const response = await fetch("/api/accept-request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverName: note.driverName,
          driverEmail: note.driverEmail,
          rescuerEmail: note.rescuerEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setNotifications((prev) => prev.filter((_, i) => i !== index));

        const userLocation = {
          latitude: note.location.latitude,
          longitude: note.location.longitude,
        };
        const userInfo = {
          name: note.driverName,
          phone: note.driverPhone,
        };

        // Navigate to the assist page, passing user location in query params
        router.push(
          `/assist?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&name=${userInfo.name}&phone=${userInfo.phone}`
        );
        setShowNotifications(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async (note: Notification, index: number) => {
    try {
      const response = await fetch("/api/reject-request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverName: note.driverName,
          driverEmail: note.driverEmail,
          rescuerEmail: note.rescuerEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setNotifications((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch("/api/clear-notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session?.user?.email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.status === "pending"));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.8, duration: 0.6, ease: "easeIn" },
      }}
    >
      <nav className="fixed top-0 left-0 w-full px-4 xl:px-8 py-3 bg-primary z-50 flex justify-between items-center">
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
                  onClick={async () => {
                    await fetch("/api/disconnect", { method: "POST" });
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Logout
                </button>

                <div className="relative flex">
                  <FaBell
                    className="text-[24px] cursor-pointer hover:text-accent"
                    onClick={() => setShowNotifications((prev) => !prev)}
                  />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {notificationCount}
                    </span>
                  )}

                  {showNotifications && (
                    <div className="absolute top-10 right-0 bg-primary shadow-lg border rounded-md w-[400px] max-h-[400px] overflow-y-auto z-50 p-2">
                      <div className="flex justify-between items-center w-full">
                        <h1 className="text-lg font-semibold px-2 text-white">
                          Notifications
                        </h1>
                        <p
                          className="text-sm text-white px-2 cursor-pointer underline-offset-1 underline opacity-60 hover:opacity-90"
                          onClick={() => clearNotifications()}
                        >
                          Clear
                        </p>
                      </div>
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((note, index) => (
                          <div
                            key={index}
                            className={`text-sm py-4 px-2 opacity-85 hover:opacity-100 text-white hover:bg-white/10 cursor-pointer flex justify-between items-center ${
                              filteredNotifications[index] ===
                              filteredNotifications[
                                filteredNotifications.length - 1
                              ]
                                ? ""
                                : "border-b-[1px] border-white/60"
                            }`}
                          >
                            {note.status === "pending" ? (
                              <>
                                <div>
                                  <p>
                                    <span className="text-accent">
                                      {note.driverName}
                                    </span>{" "}
                                    needs your help!
                                  </p>
                                  <p>
                                    <span className="text-red-500 font-semibold">
                                      Problem:
                                    </span>{" "}
                                    {note.message}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    aria-label="Accept Request"
                                    className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                                    onClick={() => acceptRequest(note, index)}
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    aria-label="Reject Request"
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                    onClick={() => rejectRequest(note, index)}
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <p
                                className={`${
                                  note.status === "accepted"
                                    ? "text-accent"
                                    : "text-red-500"
                                } text-left`}
                              >
                                {note.status === "accepted"
                                  ? `✅ ${note.rescuerName} accepted your request!`
                                  : `❌ ${note.rescuerName} rejected your request!`}
                              </p>
                            )}
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
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/",
                    prompt: "select_account", // 👈 This forces the account chooser
                  })
                }
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex xl:hidden gap-4 items-center">
          {session?.user && (
            <div className="relative">
              <FaBell
                className="text-[24px] cursor-pointer hover:text-accent"
                onClick={() => setShowNotifications((prev) => !prev)}
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
              {showNotifications && (
                <div className="absolute top-10 right-[-120px] bg-primary shadow-lg border rounded-md w-[360px] max-h-[400px] overflow-y-auto z-50 p-2">
                  <div className="flex justify-between items-center w-full">
                    <h1 className="text-lg font-semibold px-2 text-white">
                      Notifications
                    </h1>
                    <p
                      className="text-sm text-white px-2 cursor-pointer underline-offset-1 underline opacity-60 hover:opacity-90"
                      onClick={() => clearNotifications()}
                    >
                      Clear
                    </p>
                  </div>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((note, index) => (
                      <div
                        key={index}
                        className={`text-sm py-4 px-2 opacity-85 hover:opacity-100 text-white hover:bg-white/10 cursor-pointer flex justify-between items-center ${
                          filteredNotifications[index] ===
                          filteredNotifications[
                            filteredNotifications.length - 1
                          ]
                            ? ""
                            : "border-b-[1px] border-white/60"
                        }`}
                      >
                        {note.status === "pending" ? (
                          <>
                            <div>
                              <p>
                                <span className="text-accent">
                                  {note.driverName}
                                </span>{" "}
                                needs your help!
                              </p>
                              <p>
                                <span className="text-red-500 font-semibold">
                                  Problem:
                                </span>{" "}
                                {note.message}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                aria-label="Accept Request"
                                className="bg-green-500 text-white px-2 py-2 rounded"
                                onClick={() => acceptRequest(note, index)}
                              >
                                <FaCheck />
                              </button>
                              <button
                                aria-label="Reject Request"
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded"
                                onClick={() => rejectRequest(note, index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </>
                        ) : (
                          <p
                            className={`${
                              note.status === "accepted"
                                ? "text-accent"
                                : "text-red-500"
                            } text-left`}
                          >
                            {note.status === "accepted"
                              ? `✅ ${note.rescuerName} accepted your request!`
                              : `❌ ${note.rescuerName} rejected your request!`}
                          </p>
                        )}
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

          {toggleMenu ? (
            <IoMdClose
              className="text-[32px] text-accent"
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          ) : (
            <CiMenuFries
              className="text-[32px] text-accent"
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          )}
        </div>

        {toggleMenu && (
          <div className="bg-primary w-[60%] py-4 fixed right-0 top-0 flex flex-col gap-8 justify-center items-center rounded-md slide-in-right z-40">
            <div className="flex justify-end items-center w-full px-4">
              <IoMdClose
                className="text-[32px] text-accent"
                onClick={() => setToggleMenu(false)}
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
                onClick={async () => {
                  await fetch("/api/disconnect", { method: "POST" });
                  signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className="button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/",
                    prompt: "select_account", // 👈 This forces the account chooser
                  })
                }
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
