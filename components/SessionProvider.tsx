'use client'
import { SessionProvider} from "next-auth/react"

interface ProviderProps {
    children : React.ReactNode;
}


const Provider = ({children}:ProviderProps) =>{
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default Provider