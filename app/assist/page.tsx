"use client";
import * as React from "react";
import { useState } from "react";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { MdOutlineMessage, MdAddCall } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

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
  name: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  location: { latitude: number; longitude: number };
};

export default function Assist() {
  const { user, setUser } = useUser();
  const [services, setServices] = useState<RescueService[]>([]);
  const [filters, setFilters] = useState<Filters>({
    roadAssist: true,
    mechanic: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<RescueService | null>(
    null
  );
  const [userLocation, setuserLocation] = useState<boolean>(false);
  const [selectedRadius, setSelectedRadius] = useState<string>("10");
  const mapRef = React.useRef<any>(null); // Create a reference for the map

  const handleSelectService = (service: RescueService) => {
    setSelectedService(service);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [service.location.longitude, service.location.latitude],
        zoom: 14, // Adjust zoom level as needed
        essential: true, // Ensures smooth animation
      });
    }
  };

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
            `/api/rescue-services?lat=${user.location.latitude}&lng=${user.location.longitude}&radius=${selectedRadius}`
          );
          const data = await response.json();

          // Ensure data is an array
          const AvailableServices = Array.isArray(data) ? data : [];

          // Transform location format
          const formattedData = AvailableServices.map((service: any) => ({
            ...service,
            location: {
              latitude: service.location.coordinates[1],
              longitude: service.location.coordinates[0],
            },
          }));
          setServices(formattedData);
          console.log("Available Services:", formattedData);
        }
      } catch (error) {
        console.error("Operation failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    updateAndFetch();
  }, [user.location, selectedRadius]);

  const filteredServices = services.filter((service) => {
    if (filters.roadAssist && service.role === "Road Assist") return true;
    if (filters.mechanic && service.role === "Mechanic") return true;
    return false;
  });

  const handleFilterChange = (type: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  if (isLoading || !user?.location.latitude || !user?.location.longitude)
    return (
      <div className="flex items-center justify-center h-screen bg-primary text-white text-2xl">
        <FaSpinner className="animate-spin text-4xl mb-3 text-accent" />
      </div>
    );

  return (
    <section className="w-full mt-8 flex flex-col lg:flex-row gap-4 items-center">
      {/* Map */}
      <div id="map_container" className="w-[95%] xl:w-1/2">
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: user?.location?.latitude,
            longitude: user?.location?.longitude,
            zoom: 14,
          }}
          style={{ width: "100%", height: 460 }}
          mapStyle="https://api.maptiler.com/maps/f0924eda-983d-4a8a-beb5-379d645f17ac/style.json?key=LGnmlQYoNtKqhtbjpL2X"
        >
          {filteredServices.map((service, index) => (
            <Marker
              key={index}
              latitude={Number(service.location.latitude)}
              longitude={Number(service.location.longitude)}
              color={
                ["Road Assist", "Mechanic"].includes(service.role)
                  ? "green"
                  : "blue"
              }
              onClick={(e) => {
                e.originalEvent.stopPropagation(); // Prevent event bubbling
                setSelectedService(service);
              }}
            />
          ))}
          {selectedService && selectedService.location && (
            <Popup
              latitude={Number(selectedService.location.latitude)}
              longitude={Number(selectedService.location.longitude)}
              onClose={() => setSelectedService(null)} // Close popup on click
              closeOnClick
            >
              <div className="p-2 bg-primary rounded shadow-md text-center">
                <h3 className="text-base font-semibold text-accent">
                  {selectedService.name}
                </h3>
                <p className="text-base text-white/60">
                  {selectedService.role}
                </p>
                <p className="text-base text-white/60">
                  {" "}
                  {selectedService.phone}
                </p>
              </div>
            </Popup>
          )}
          <Marker
            latitude={Number(user?.location.latitude)}
            longitude={Number(user?.location.longitude)}
            color="red"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setuserLocation(!userLocation);
            }}
          />
          {user?.location && userLocation && (
            <Popup
              latitude={Number(user?.location.latitude)}
              longitude={Number(user?.location.longitude)}
              onClose={() => setSelectedService(null)} // Close popup on click
              closeOnClick
            >
              <div className="p-2 bg-primary rounded shadow-md text-center">
                <h3 className="text-base font-semibold text-accent">
                  Your Location
                </h3>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* RIGHT: List of Cards */}
      <section className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="flex flex-col gap-4 ">
          <h1 className="text-3xl text-accent font-semibold text-left">
            Assist Nearby:
          </h1>
          <div className="flex items-center gap-4">
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

            <select
              className="input w-[100px] border-accent border-[1px]"
              onChange={(e) => setSelectedRadius(e.target.value)}
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
        </div>

        <ScrollArea className="h-[450px]">
          <ul id="cards-wrapper" className="grid grid-cols-1 gap-[20px]">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div
                  key={index}
                  className="shadow-sm shadow-accent flex flex-col gap-3 px-2 xl:px-4 py-3 rounded-md font-semibold text-sm xl:text-base"
                  onClick={() => handleSelectService(service)}
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
