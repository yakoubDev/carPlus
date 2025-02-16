import './globals.css'
import {JetBrains_Mono} from "next/font/google";

// components
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Provider from '@/components/SessionProvider';
import { UserProvider } from './context/userContext';



const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800"],
  variable: '--font-jetbrainsMono',
})

export const metadata = {
  title: "Car+ | Find Nearby Mechanics and Roadside Assistance",
  description: "Car+ helps drivers find nearby mechanics and roadside assistance quickly using an interactive map. Get the help you need for car breakdowns and emergencies with ease.",
};



export default  function RootLayout({ children }) {
  return (
          <html lang="en">
            <body
                className={jetbrainsMono.variable}
              >
              <Provider>
                <UserProvider> 
                <Nav/>
                  {children}
                <Footer/>
                </UserProvider>
              </Provider>
            </body>
          </html>
  );
}
