"use client";
import * as React from "react";
import { Map, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MdOutlineMessage, MdAddCall } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "../context/userContext";

type RescueService = {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: {
    latitude: number;
    longitude: number;
  };
};


type Filters = {
  roadAssist: boolean;
  mechanic: boolean;
};

type User = {
  name:string;
  email: string;
  phone: string;
  role:string;
  image:string;
  location: { latitude: number; longitude: number };
};

export default function Assist() {
  const { user, setUser } = useUser();
  const [services, setServices] = React.useState<RescueService[]>([]);
  const [filters, setFilters] = React.useState<Filters>({
    roadAssist: true,
    mechanic: true,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  // Get geolocation and update context
  React.useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUser((prev: User) => ({
              ...prev,
              location: { latitude, longitude },
            }));
            // console.log("Location updated");
          },
          (error) => {
            console.error("Geolocation error:", error);
            setIsLoading(false);
          }
        );
      } else {
        console.error("Geolocation not supported");
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, [setUser]);

  // Update location in DB and fetch services
  React.useEffect(() => {
    const updateAndFetch = async () => {
      try {
        // Update location
        if (user?.email && user?.location) {
          await fetch("/api/update-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              location: user.location,
            }),
          });
        }

        // Fetch services
        if (user?.location?.latitude && user?.location?.longitude) {
          const response = await fetch(
            `/api/rescue-services?lat=${user.location.latitude}&lng=${user.location.longitude}&radius=10`
          );
          const AvailableServices = await response.json();

          // Transform location format
          const formattedData = AvailableServices.map((service: any) => ({
            ...service,
            location: {
              latitude: service.location.coordinates[1],
              longitude: service.location.coordinates[0],
            },
          }));
          setServices(formattedData);
          // console.log("Available Services:", formattedData);
        }
      } catch (error) {
        console.error("Operation failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    updateAndFetch();
  }, [user.location]);

  const filteredServices = services.filter((service) => {
    if (filters.roadAssist && service.role === "Road Assist") return true;
    if (filters.mechanic && service.role === "Mechanic") return true;
    return false;
  });

  const handleFilterChange = (type: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  

  if (isLoading)
    return <div className="text-white p-4">Loading services...</div>;

  return (
    <section className="w-full mt-8 flex flex-col lg:flex-row gap-4 items-center">
      {/* Map */}
      <Map
        initialViewState={{
          latitude: user?.location?.latitude || 36.26,
          longitude: user?.location?.longitude || 7.94,
          zoom: 14,
        }}
        style={{ width: 550, height: 480 }}
        mapStyle="https://api.maptiler.com/maps/f0924eda-983d-4a8a-beb5-379d645f17ac/style.json?key=LGnmlQYoNtKqhtbjpL2X"
      >
        {filteredServices
          .map((service, index) => (
            <Marker
              key={index}
              latitude={Number(service.location.latitude)}
              longitude={Number(service.location.longitude)}
              color={service.role === "Road Assist" || service.role === "Mechanic" ? "green" : "blue"}

            />
          ))}
      </Map>

      {/* RIGHT: List of Cards */}
      <section className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl text-accent font-semibold text-left">
            Assist Nearby:
          </h1>
          <div className="flex items-center gap-3">
            <label>
              <input
                type="checkbox"
                checked={filters.roadAssist}
                onChange={() => handleFilterChange("roadAssist")}
                className="mr-2 w-3 h-3"
              />
              Road Assist
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.mechanic}
                onChange={() => handleFilterChange("mechanic")}
                className="mr-2 w-3 h-3"
              />
              Mechanic
            </label>
          </div>
        </div>

        <ScrollArea className="h-[450px]">
          <ul id="cards-wrapper" className="grid grid-cols-1 gap-[20px]">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div
                  key={index}
                  className="shadow-sm shadow-accent flex flex-col gap-3 px-4 py-3 rounded-md font-semibold"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-accent">
                      Name: <span className="text-white">{service.name}</span>
                    </span>
                    <span className="text-accent">
                      Phone: <span className="text-white">{service.phone}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-accent">
                      Type: <span className="text-white">{service.role}</span>
                    </span>
                    <div className="flex gap-2">
                      <button className="button">
                        <MdOutlineMessage className="text-xl text-black" />
                      </button>
                      <button className="button">
                        <MdAddCall className="text-xl text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white">No services available.</div>
            )}
          </ul>
        </ScrollArea>
      </section>
    </section>
  );
}
