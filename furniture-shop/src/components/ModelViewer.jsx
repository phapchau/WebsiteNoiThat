



import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds, Center } from "@react-three/drei";

// Bật decoder Draco (nếu model .glb nén Draco)
useGLTF.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

function GltfModel({ url }) {
  const { scene } = useGLTF(url, true); // true => cho phép Draco
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

/** Lưu ý: container cha phải có height cố định (vd. h-[72vh]) */
export default function ModelViewer({
  url,
  className = "",
  cameraControls = true,
  autoRotate = false,
}) {
  if (!url) return null;

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [2.4, 1.8, 2.4], fov: 45 }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 2]} intensity={0.9} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <GltfModel url={url} />
          </Bounds>
        </Suspense>

        {cameraControls && (
          <OrbitControls
            makeDefault
            enablePan
            enableZoom
            enableDamping
            dampingFactor={0.08}
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
          />
        )}
      </Canvas>
    </div>
  );
}//22/11   nếu add 3d hay lỗi gì thì dùng lại cái này









