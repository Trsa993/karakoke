import { Canvas } from "@react-three/fiber";
import Vortex from "./Vortex";

const Canvas3D = () => {
  return (
    <Canvas>
      <pointLight position={[10, 10, 10]} />
      <Vortex position={[-2.2, 0, 0]} />
      <Vortex position={[2.2, 0, 0]} />
    </Canvas>
  );
};

export default Canvas3D;
