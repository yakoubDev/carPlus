'use client'
import Image from "next/image";
import Link from "next/link"; 
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Process",
      path:  `${pathname === '/' ? '#process' : '/#process'}`,
    },
    {
      name: "Assist",
      path: "/assist",
    },
  ];
  return (
    <footer className="flex flex-col gap-6 mt-4 py-2 md:px-8">
        {/* Upper Section */}
      <section className="flex flex-col md:flex-row  gap-12 md:justify-between items-center">
        {/* Logo And Socials */}
        <div className="flex flex-row items-center justify-between md:items-start md:flex-col md:w-1/3  md:gap-4  w-full ">
          <Link href="/" className="text-3xl md:text-4xl inline-flex gap-1 font-semibold">
            <span>Car</span>
            <span className="text-accent">+</span>
          </Link>

          {/* Socials */}
          <div className="flex gap-2">

                <Link href='https://www.twitter.com/'  target='_blank' className='border-[1.5px] border-white/60 p-2 rounded-full hover:border-accent group *:duration-300 *:cursor-pointer transition-all '>
                  <Image src='/assets/socials/twitter.svg' alt='socials' width={17} height={17} className='group-hover:scale-[1.17]'/>
                </Link>

                <Link href='https://www.instagram.com/yakoub.dev/'  target='_blank' className='border-[1.5px] border-white/60 p-2 rounded-full hover:border-accent group *:duration-300 *:cursor-pointer transition-all '>
                  <Image src='/assets/socials/instagram.svg' alt='socials' width={17} height={17} className='group-hover:scale-[1.17]'/>
                </Link>

                <Link href='https://www.facebook.com/yakoub62/'  target='_blank' className='border-[1.5px] border-white/60 p-2 rounded-full hover:border-accent group *:duration-300 *:cursor-pointer transition-all '>
                  <Image src='/assets/socials/facebook.svg' alt='socials' width={17} height={17} className='group-hover:scale-[1.17]'/>
                </Link>
          </div>
        </div>


        <div className="flex flex-row justify-between md:justify-between items-center w-full xl:w-2/3">
            {/* Links */}
          <div className="flex flex-col gap-3 text-sm md:text-base ">
            <span className="font-bold text-accent ">Links:</span>
            {links.map((link,index) => (
              <Link key={index} href={link.path} className=" hover:text-accent transition-all">{link.name}</Link>
            ))}
          </div>
            
            {/* Contact */}
            <div className='flex flex-col gap-3 text-sm md:text-base'>
              <span className='font-bold text-accent'>Contact:</span>

              <div className='flex gap-1 items-center'>
              <Image src='/assets/socials/email.svg' height={20} width={20} alt='email' className='font-bold'/>
              <span>: carplus@gmail.com</span>
              </div>


              <div className='flex gap-1 items-center'>
              <Image src='/assets/socials/phone.svg' height={20} width={20} alt='email' className='font-bold'/>
              <span>: +(213) 551 15 44 02</span>
              </div>

              <div className='flex gap-1 items-center'>
              <Image src='/assets/socials/address.svg' height={20} width={20} alt='email' className='font-bold'/>
              <span>: Chui Guivera 192.</span>
              </div>
            </div>
        </div>
        
      </section>

      <div className="w-full h-[1px] bg-white/50">{/* divider */}</div>

          {/* Bottom Section */}
      <section className="text-center">
        <span className="m-auto">©Copyright. All rights reserved.</span>
      </section>
    </footer>
  );
};

export default Footer;
