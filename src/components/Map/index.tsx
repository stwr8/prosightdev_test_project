"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Modal, Input, Button, Segmented } from "antd";
import { Icon, LatLngBounds } from "leaflet";

import { DEFAULT_DATA } from "./data";

import "leaflet/dist/leaflet.css";

const { TextArea } = Input;

interface IService {
  latitude: number;
  longitude: number;
  status: boolean;
  details: string;
}

export function MapComponent() {
  const mapRef = useRef(null);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [services, setServices] = useState<IService[]>(DEFAULT_DATA);

  const handleClose = useCallback(() => {
    setSelectedService(null);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (selectedService) {
        setServices((prev) =>
          prev.map((s) =>
            s.latitude === selectedService.latitude &&
            s.longitude === selectedService.longitude
              ? selectedService
              : s
          )
        );
      }
      handleClose();
    },
    [selectedService, handleClose]
  );

  const FitBounds = useCallback(({ services }: { services: IService[] }) => {
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
  }, []);

  return (
    <>
      <MapContainer
        ref={mapRef}
        zoom={9}
        center={[0, 0]}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
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
                iconUrl: `/marker_${service.status ? "green" : "red"}_icon.png`,
              })
            }
          >
            <Popup>
              <div className="p-0 m-0 mb-4 text-xl font-medium">
                {service.details}
              </div>
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
              options={[
                { icon: "/marker_green_icon.png", value: true },
                { icon: "/marker_red_icon.png", value: false },
              ].map(({ icon, value }) => ({
                label: (
                  <div className="py-3 grid place-items-center">
                    <Image
                      width={48}
                      height={48}
                      src={icon}
                      alt={value ? "Green Marker Icon" : "Red Marker Icon"}
                    />
                  </div>
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
    </>
  );
}
