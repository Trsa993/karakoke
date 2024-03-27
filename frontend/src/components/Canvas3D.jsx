import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Vortex from "./CanvasVortex";
import { useEffect, useRef } from "react";

function Camera() {
  const camera = useThree((state) => state.camera);

  useFrame(({ clock }) => {
    const radius = 1;
    const speed = 1;
    const angle = clock.elapsedTime * speed;

    camera.position.x = Math.cos(angle) * radius;
    camera.position.y = Math.sin(angle) * radius;
  });
}

const Canvas3D = () => {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ fov: 75, near: 0.1, far: 200, position: [0, 0, 15] }}
    >
      <Camera />
      <Vortex position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Vortex position={[0, 0, 200]} rotation={[Math.PI / 2, 0, 0]} />
    </Canvas>
  );
};

export default Canvas3D;
