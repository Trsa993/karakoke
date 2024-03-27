import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Vector3, Float32BufferAttribute } from "three";
import { ImprovedNoise } from "three-stdlib";

const Vortex = (props) => {
  const meshRef = useRef();
  const noise = useMemo(() => new ImprovedNoise(), []);

  useEffect(() => {
    if (meshRef.current) {
      const tubeGeo = meshRef.current.geometry;
      const tubeVerts = tubeGeo.attributes.position;
      const colors = [];
      const color = new Color();
      const hueNoiseFreq = 0.005;
      let p = new Vector3();
      let v3 = new Vector3();
      const noisefreq = 0.1;
      const noiseAmp = 0.5;

      for (let i = 0; i < tubeVerts.count; i += 1) {
        p.fromBufferAttribute(tubeVerts, i);
        v3.copy(p);
        let vertexNoise = noise.noise(v3.x * noisefreq, v3.y * noisefreq, v3.z);
        v3.addScaledVector(p, vertexNoise * noiseAmp);
        tubeVerts.setXYZ(i, v3.x, p.y, v3.z);

        let colorNoise = noise.noise(
          v3.x * hueNoiseFreq,
          v3.y * hueNoiseFreq,
          i * 0.001 * hueNoiseFreq
        );
        color.setHSL(0.5 - colorNoise, 1, 0.5);
        colors.push(color.r, color.g, color.b);
      }

      tubeGeo.setAttribute("color", new Float32BufferAttribute(colors, 3));
      tubeGeo.attributes.position.needsUpdate = true;
      // tubeGeo.attributes.color.needsUpdate = true;
    }
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.z += 0.5;
      if (meshRef.current.position.z > 200) {
        meshRef.current.position.z = -200;
      }
    }
  });

  return (
    <points {...props} ref={meshRef}>
      <cylinderGeometry args={[3, 3, 200, 128, 2048, true]} />
      <pointsMaterial vertexColors={true} size={0.03} />
    </points>
  );
};

export default Vortex;
