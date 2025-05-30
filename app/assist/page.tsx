"use client";
import * as React from "react";
import { useState } from "react";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { toast } from "sonner";
import { FaCheck, FaSpinner } from "react-icons/fa";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "../context/userContext";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", {
        callbackUrl: "/assist",
        prompt: "select_account",
      });
    }
  }, [status]);
  
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
  const [requesting, setRequesting] = useState<string | null>(null);
  const mapRef = React.useRef<any>(null); // Create a reference for the map

  const [showModal, setShowModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [pendingService, setPendingService] = useState<RescueService | null>(
    null
  );

  const [mapLoaded, setMapLoaded] = useState(false);
  const searchParams = useSearchParams();
  const [DriverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [driverInfo, setDriverInfo] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [showDriverPopup, setShowDriverPopup] = useState<boolean>(true);

  React.useEffect(() => {
    const lat = searchParams.get("latitude");
    const lng = searchParams.get("longitude");
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");

    if (lat && lng) {
      setDriverLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }

    if (name && phone) {
      setDriverInfo({ name, phone });
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (mapRef.current && DriverLocation && mapLoaded) {
      mapRef.current.flyTo({
        center: [DriverLocation.lng, DriverLocation.lat],
        zoom: 14,
        essential: true,
      });
    }
  }, [DriverLocation, mapLoaded]);

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
          // console.log("Available Services:", formattedData);
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
    const isMatchingRole =
      (filters.roadAssist && service.role === "Road Assist") ||
      (filters.mechanic && service.role === "Mechanic");

    const isNotCurrentUser = service.email !== user?.email;

    return isMatchingRole && isNotCurrentUser;
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

  const handleServiceRequest = async (service: RescueService) => {
    if (requesting === service.email) return; // Prevent duplicate request to the same service
    const message =
      selectedEmergency === "Other" ? customMessage : selectedEmergency;

    if (!message) {
      toast.error("Please provide an emergency description.");
      return;
    }

    setRequesting(service.email); // Mark this service as being requested
    try {
      const response = await fetch("/api/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverName: user.name,
          driverPhone: user.phone,
          driverEmail: user.email,
          location: {
            latitude: user?.location.latitude,
            longitude: user?.location.longitude,
          },
          rescuerEmail: service.email,
          rescuerName: service.name,
          message: message,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`Request sent to ${service.name}`);
        setTimeout(() => {
          setRequesting(null);
        }, 5000);
      } else {
        toast.error(result.message || "Failed to send request.");
        setRequesting(null);
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Something went wrong while sending the request.");
      setRequesting(null);
    }
  };

  return (
    <section className="w-full mt-14 flex flex-col lg:flex-row gap-4 items-center lg:items-start">
      {/* Map */}
      <div id="map_container" className="w-[95%] xl:w-1/2">
        <Map
          ref={mapRef}
          onLoad={() => setMapLoaded(true)}
          initialViewState={{
            latitude: user?.location?.latitude,
            longitude: user?.location?.longitude,
            zoom: 14,
          }}
          style={{ width: "100%", height: 460 }}
          mapStyle="https://api.maptiler.com/maps/f0924eda-983d-4a8a-beb5-379d645f17ac/style.json?key=LGnmlQYoNtKqhtbjpL2X"
        > 
          <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded xl:hover:bg-white xl:hover:text-primary border-[1px] cursor-pointer border-primary  transition-all"
          onClick={() => mapRef.current?.flyTo({center: [user?.location?.longitude, user?.location?.latitude]}, {zoom: 14, essential: true})}>
            My Location
          </div>
          {filteredServices.map((service, index) => (
            <Marker
              key={index}
              latitude={Number(service.location.latitude)}
              longitude={Number(service.location.longitude)}
              onClick={(e) => {
                e.originalEvent.stopPropagation(); // Prevent event bubbling
                setSelectedService(service);
              }}
            >
              <img
                src={`${
                  service.role == "Mechanic"
                    ? "/assets/mechanic.svg"
                    : "/assets/roadside.svg"
                }`}
                width={35}
                height={35}
                alt=""
              />
            </Marker>
          ))}
          {selectedService && selectedService.location && (
            <Popup
              latitude={Number(selectedService.location.latitude)}
              longitude={Number(selectedService.location.longitude)}
              onClose={() => setSelectedService(null)} // Close popup on click
              closeOnClick
            >
              <div className="p-4 bg-primary rounded shadow-md text-center flex flex-col items-center justify-center">
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
                <button
                  disabled={requesting === selectedService.email}
                  className={`px-2 py-1 mt-2 bg-accent text-black font-semibold  rounded hover:bg-opacity-80 transition-all ${
                    requesting === selectedService.email
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingService(selectedService);
                    setShowModal(true);
                  }}
                >
                  {requesting === selectedService.email ? (
                    <FaCheck />
                  ) : (
                    "Request"
                  )}
                </button>
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
              <div className="p-4 bg-primary rounded shadow-md text-center flex flex-col items-center justify-center">
                <h3 className="text-base font-semibold text-accent">
                  Your Location
                </h3>
              </div>
            </Popup>
          )}

          {DriverLocation && (
            <>
              <Marker
                latitude={Number(DriverLocation.lat)}
                longitude={Number(DriverLocation.lng)}
                color="green"
                onClick={(e) => {
                  e.originalEvent.stopPropagation(); // Prevent event bubbling
                  setShowDriverPopup(true);
                }}
              />
              {showDriverPopup && driverInfo && (
                <Popup
                  latitude={Number(DriverLocation.lat)}
                  longitude={Number(DriverLocation.lng)}
                  closeOnClick
                  onClose={() => setShowDriverPopup(false)}
                >
                  <div className="p-3 bg-primary rounded shadow-md text-center flex flex-col items-center justify-center">
                    <h3 className="text-base font-semibold text-accent">
                      {driverInfo.name}
                    </h3>
                    <p className="text-white/80 text-base">
                      {driverInfo.phone}
                    </p>
                    <button
                      className="mt-2 p-1 bg-accent text-black rounded text-xs outline-none"
                      onClick={() => {
                        navigator.clipboard.writeText(driverInfo.phone);
                        toast.success("Copied");
                      }}
                    >
                      Copy Number
                    </button>
                  </div>
                </Popup>
              )}
            </>
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
                className="mr-2 w-4 h-4 accent-accent"
              />
              Road Assist
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.mechanic}
                onChange={() => handleFilterChange("mechanic")}
                className="mr-2 w-4 h-4 accent-accent"
              />
              Mechanic
            </label>
          </div>

          <label htmlFor="radius">
            Radius:{" "}
            <span className="font-bold text-accent">{selectedRadius} km</span>
            <input
              id="radius"
              type="range"
              min="1" // Minimum 1 km
              max="50" // Maximum 50 km
              step="1" // Adjust step size
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(String(e.target.value))}
              className="h-2 w-[190px] lg:w-[250px] bg-white rounded-lg appearance-none cursor-pointer accent-accent ml-2 mb-2"
            />
          </label>
        </div>

        <ScrollArea className="h-[450px]">
          <ul id="cards-wrapper" className="grid grid-cols-1 gap-[20px]">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <li
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
                    <button
                      disabled={requesting === service.email}
                      className={`button bg-accent text-black font-semibold p-1 rounded hover:bg-opacity-80 transition-all ${
                        requesting === service.email
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingService(service);
                        setShowModal(true);
                      }}
                    >
                      {requesting === service.email ? <FaCheck /> : "Request"}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-white">No services available.</li>
            )}
          </ul>
        </ScrollArea>
        {showModal && pendingService && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-primary text-white rounded-xl p-6 w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-4">Select Emergency</h2>

              <select
                value={selectedEmergency}
                onChange={(e) => setSelectedEmergency(e.target.value)}
                className="w-full p-2 rounded border mb-4 bg-primary focus:outline-none focus:border-accent"
              >
                <option value="">-- Select Emergency --</option>
                <option value="Tire Change">Tire Change</option>
                <option value="Battery Boost">Battery Boost</option>
                <option value="Fuel Delivery">Fuel Delivery</option>
                <option value="Locked Out">Locked Out</option>
                <option value="Other">Other...</option>
              </select>

              {selectedEmergency === "Other" && (
                <textarea
                  placeholder="Describe your emergency..."
                  className="w-full p-2 rounded  mb-4 bg-primary focus:outline-none ring-1 ring-white focus:ring-accent text-white "
                  rows={2}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  maxLength={30}
                />
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-red-400 hover:bg-red-500 rounded text-black"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEmergency("");
                    setCustomMessage("");
                    setPendingService(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-accent rounded text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !selectedEmergency ||
                    (selectedEmergency === "Other" && !customMessage)
                  }
                  onClick={() => {
                    if (!selectedEmergency) {
                      toast.error("Please select an emergency type.");
                      return;
                    }
                    handleServiceRequest(pendingService);
                    setShowModal(false);
                    setSelectedEmergency("");
                    setCustomMessage("");
                    setPendingService(null);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
