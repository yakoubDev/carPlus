// app/loading.tsx
import { FaSpinner } from "react-icons/fa";
export default function Loading() {
    return (
      <div className="flex items-center justify-center h-screen bg-primary text-white text-2xl">
         <FaSpinner className="animate-spin text-4xl mb-3 text-accent" />
      </div>
    );
  }
  
