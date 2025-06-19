import { AccumulativeShadows, ContactShadows, Grid, OrbitControls, RandomizedLight, SoftShadows, Stats, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useRef, useState } from "react";
import * as THREE from "three";
import "../src/App.css";

function App() {
  const [showLeva, setShowLeva] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [lightType, setLightType] = useState("point"); // ✅ state สำหรับเลือกแสง

  return (
    <>
      {/* Buttons */}
      <div className="Buttons">
        <button onClick={() => setShowLeva((prev) => !prev)}>
          {showLeva ? "Hide Leva" : "Show Leva"}
        </button>
        <button onClick={() => setShowStats((prev) => !prev)}>
          {showStats ? "Hide Stats" : "Show Stats"}
        </button>

        {/* ✅ Dropdown สำหรับเลือกแสง */}
        <select
          value={lightType}
          onChange={(e) => setLightType(e.target.value)}
        >
          <option value="ambient">Ambient Light</option>
          <option value="directional">Directional Light</option>
          <option value="point">Point Light</option>
          <option value="spot">Spot Light</option>
        </select>

        {showLeva && <Leva />}
        {showStats && <Stats />}
      </div>

      <Canvas shadows  camera={{ position: [3, 3, 3] }}>
        {/* <SoftShadows/>
        <ContactShadows/> */}
        <ContactShadows position-y={2} opacity={1} blur={2} color={"pink"} scale={10}/>
        <axesHelper />
        <Grid
          sectionSize={3}
          sectionColor={"purple"}
          sectionThickness={1}
          cellSize={1}
          cellColor={"#6f6f6f"}
          cellThickness={0.6}
          infiniteGrid
          fadeDistance={50}
          fadeStrength={5}
        />

        <Box />
        <BoxFloor/>
        <Lights type={lightType} />
        <OrbitControls />
      </Canvas>
    </>
  );
}





const Lights = ({ type }) => {
  const lightRef = useRef();

  // ใช้ useHelper แสดง Helper ตามประเภท
  useHelper(
    lightRef,
    type === "directional"
      ? THREE.DirectionalLightHelper
      : type === "point"
      ? THREE.PointLightHelper
      : type === "spot"
      ? THREE.SpotLightHelper
      : null,
    type === "point" ? 0.5 : 1,
    "red"
  );
  

  // Leva Controls
  const commonControls = useControls("Light Controls", {
    color: "#ff5151",
    intensity: { value: 6, min: 0, max: 10, step: 0.1 },
    position: { x: 0, y: 3, z: 0 },
  });

  const directionalControls = useControls("Light Controls", {
    castShadow: true,
    receiveShadow:true,
  });

  const pointControls = useControls("Light Controls", {
    distance: { value: 5, min: 0, max: 20 },
    decay: { value: 2, min: 0, max: 5 },
  });

  const spotControls = useControls("Light Controls", {
    angle: { value: 0.3, min: 0, max: Math.PI / 2 },
    penumbra: { value: 0.5, min: 0, max: 1 },
  });

  const pos = [commonControls.position.x, commonControls.position.y, commonControls.position.z];

  switch (type) {
    case "ambient":
      return <ambientLight color={commonControls.color} intensity={commonControls.intensity} receiveShadow  castShadow/>;
    case "directional":
      return (
        <directionalLight
          ref={lightRef}
          color={commonControls.color}
          intensity={commonControls.intensity}
          position={pos}
          castShadow={directionalControls.castShadow}
          receiveShadow={directionalControls.receiveShadow}
          
        />
      );
    case "point":
      return (
        <pointLight
          ref={lightRef}
          color={commonControls.color}
          intensity={commonControls.intensity}
          position={pos}
          distance={pointControls.distance}
          decay={pointControls.decay}
          castShadow={directionalControls.castShadow}
          receiveShadow={directionalControls.receiveShadow}
          
        />
      );
    case "spot":
      return (
        <spotLight
          ref={lightRef}
          color={commonControls.color}
          intensity={commonControls.intensity}
          position={pos}
          angle={spotControls.angle}
          penumbra={spotControls.penumbra}
          castShadow={directionalControls.castShadow}
          receiveShadow={directionalControls.receiveShadow}
        />
      );
    default:
      return null;
  }
};


const Box = () => {
  const ref = useRef();
  useHelper(ref, THREE.BoxHelper, "red");

  const { position, color, opacity, transparent } = useControls("Box Control",{
    position: { x: 0, y: 0.55, z: 0 },
    color: "#ff0000",
    opacity: { value: 1, min: 0, max: 1, step: 0.01 },
    transparent: false,
  });

  return (
    <mesh castShadow receiveShadow ref={ref} position={[position.x, position.y, position.z]}>
      <boxGeometry  />
      <meshStandardMaterial
        color={color}
        transparent={transparent}
        opacity={opacity}
      />
    </mesh>
  );
};

const BoxFloor = () => {

  return (
    <mesh castShadow receiveShadow >
      <boxGeometry args={[ 20 , 0.1 , 20 ]}/>
      <meshStandardMaterial/>
    </mesh>
  )

}

export default App;
