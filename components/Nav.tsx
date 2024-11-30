"use client";

import {signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Process",
    path: "#process",
  },
  {
    name: "Assist",
    path: "/assist",
  },
];

const Nav = () => {
  const pathname = usePathname();
  const {data: session} = useSession();
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
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

        <div className="flex gap-4 items-center ml-8">
          {session?.user ? (
            <button className="button" onClick={()=> signOut({callbackUrl: '/'})}>
              Logout
            </button>
          ) :
              <button className="button" onClick={()=> signIn('google', {callbackUrl: '/'},)}>
                Login
              </button>
          }
        
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="block xl:hidden">
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
        <div className="bg-primary w-[60%] py-4  fixed right-0 top-16 flex flex-col gap-8 justify-center items-center rounded-md slide-in-right z-40">
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
              onClick={() => setToggleMenu(false)} // Close menu on link click
              className={`${
                link.path === pathname && "text-accent border-b-2 border-accent"
              } font-medium hover:text-accent transition-all`}
            >
              {link.name}
            </Link>
          ))}
         {session?.user ? (
            <button className="button" onClick={()=> signOut({callbackUrl: '/'})}>
              Logout
            </button>
          ) :
              <button className="button" onClick={()=> signIn('google', {callbackUrl: '/'},)}>
                Login
              </button>
          }
        </div>
      )}
    </nav>
  );
};

export default Nav;
