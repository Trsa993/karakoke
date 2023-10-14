import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

const Vortex = (props) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += 0.5 * delta;
    meshRef.current.rotation.y += 0.2 * delta;
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerOver={(event) => setHovered(true)}
      onPointerOut={(event) => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

export default Vortex;
