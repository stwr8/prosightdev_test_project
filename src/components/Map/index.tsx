"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Modal, Input, Button, Segmented } from "antd";
import { Icon, LatLngBounds } from "leaflet";

import MarkerGreenIcon from "@/assets/images/marker_green_icon.png";
import MarkerRedIcon from "@/assets/images/marker_red_icon.png";

import { DEFAULT_DATA } from "./data";

import "leaflet/dist/leaflet.css";

const { TextArea } = Input;

const DEFAULT_ZOOM = 9;
const LOCAL_STORAGE_KEY = "service-data";

const MARKER_ICONS = {
  true: MarkerGreenIcon.src,
  false: MarkerRedIcon.src,
} as const;

interface IService {
  latitude: number;
  longitude: number;
  status: boolean;
  details: string;
}

const loadServices = (): IService[] => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : DEFAULT_DATA;
  }
  return DEFAULT_DATA;
};

const saveServices = (services: IService[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  }
};

export function MapComponent() {
  const mapRef = useRef(null);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [services, setServices] = useState<IService[]>(loadServices());

  const handleClose = () => {
    setSelectedService(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedService) {
      setServices((prev) =>
        prev.map((service) =>
          service.latitude === selectedService.latitude &&
          service.longitude === selectedService.longitude
            ? selectedService
            : service
        )
      );
    }
    handleClose();
  };

  const FitBounds = ({ services }: { services: IService[] }) => {
    const map = useMap();

    useEffect(() => {
      if (services.length > 0) {
        const bounds = new LatLngBounds(
          services.map((s) => [s.latitude, s.longitude])
        );
        map.fitBounds(bounds);
      }
    }, [services, map]);

    return null;
  };

  useEffect(() => {
    saveServices(services);
  }, [services]);

  return (
    <div className="h-full p-4 md:p-10">
      <MapContainer
        ref={mapRef}
        center={[0, 0]}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full rounded-2xl"
      >
        <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=YxVZqW1sNTEZCr18teZw" />
        <FitBounds services={services} />
        {services.map((service) => (
          <Marker
            key={`${service.latitude}-${service.longitude}`}
            position={[service.latitude, service.longitude]}
            icon={
              new Icon({
                iconSize: [48, 48],
                iconAnchor: [24, 54],
                popupAnchor: [0, -58],
                iconUrl: MARKER_ICONS[`${service.status}`],
              })
            }
          >
            <Popup>
              <div className="p-0 m-0 mb-4 font-medium">{service.details}</div>
              <Button block onClick={() => setSelectedService(service)}>
                Update
              </Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Modal
        centered
        title="Update Service"
        footer={null}
        open={!!selectedService}
        onCancel={handleClose}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <Segmented
              block
              value={selectedService?.status}
              onChange={(value) =>
                setSelectedService((prev) => prev && { ...prev, status: value })
              }
              options={[true, false].map((value, index) => ({
                label: (
                  <Image
                    key={index}
                    width={48}
                    height={48}
                    src={MARKER_ICONS[`${value}`]}
                    alt={value ? "Green Marker Icon" : "Red Marker Icon"}
                    className="my-3 mx-auto grid place-items-center"
                  />
                ),
                value,
              }))}
            />
          </div>
          <TextArea
            required
            placeholder="Enter details"
            className="mb-5"
            autoSize={{ minRows: 3, maxRows: 6 }}
            value={selectedService?.details}
            onChange={({ target: { value } }) =>
              setSelectedService((prev) => prev && { ...prev, details: value })
            }
          />
          <div className="flex gap-3 justify-end">
            <Button key="back" onClick={handleClose}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
