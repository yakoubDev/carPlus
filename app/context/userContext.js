'use client';
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext();

export const useUser = () => useContext(userContext);

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
    phone: session?.user.phone || "",
    role: session?.user.role || "",
    image: session?.user.image || "",
    location: session?.user.location || { type: "Point", coordinates: [0, 0] },
  });

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session?.user.name,
        email: session?.user.email,
        phone: session?.user.phone,
        role: session?.user.role,
        image: session?.user.image,
        location: session?.user.location || { type: "Point", coordinates: [0, 0] },
      });
    }
  }, [session]);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};
