import { Metadata } from "next";
import WebGPUGame from "@/components/WebGPUGame";

export const metadata: Metadata = {
  title: "Shores of Thiruchendur | Lessario Studios",
  description: "An open-world coastal adventure game prototype built with Three.js and WebGPU.",
};

export default function PlayRoute() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#050510", position: "relative" }}>
      <WebGPUGame />
    </main>
  );
}
