"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("@/components").then((module) => module.MapComponent),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="h-full p-10">
      <MapComponent />
    </div>
  );
}
