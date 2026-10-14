"use client";
import dynamic from "next/dynamic";
const LabScreen = dynamic(() => import("src/utils/lab/lab"), { ssr: false });
export default function LabPage() {
  return process.env.NODE_ENV === "development" ? <LabScreen /> : <p>Esta página no está disponible.</p>;
}
