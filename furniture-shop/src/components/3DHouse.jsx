

import { useSearchParams, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center, useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Button } from "antd";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ReloadOutlined,
  SyncOutlined
} from "@ant-design/icons";

const GOLD = "#B88E2F";

// Load model
function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function ModelsViewer() {
  const [sp] = useSearchParams();
  const url = sp.get("file");
  const name = sp.get("name") || "Mẫu 3D";
  const [autoRotate, setAutoRotate] = useState(false);
  const [full, setFull] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if (!url) return <div className="text-center p-20">Không tìm thấy model.</div>;

  return (
    <div
      style={{
        background: "#1A1A1A",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        transition: "0.3s"
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: GOLD }}>
            {name}
          </h1>
          <p className="text-gray-300 mt-1">
            Xoay – phóng to – xem mọi chi tiết với mô hình 3D chân thực.
          </p>
        </div>

        <Link
          to="/models"
          className="text-gray-300 hover:text-white transition underline"
        >
          ← Quay về bộ sưu tập
        </Link>
      </div>

      {/* Viewer Container */}
      <div
        style={{
          height: full ? "92vh" : "72vh",
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${GOLD}33`,
          position: "relative",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)"
        }}
      >
        {/* Canvas */}
        <Canvas
          key={resetKey}
          camera={{ position: [2.2, 1.8, 2.2], fov: 45 }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight intensity={0.6} position={[4, 6, 4]} />
          <Environment preset="warehouse" />

          <Suspense fallback={null}>
            <Model url={url} />
          </Suspense>

          <OrbitControls
            enableZoom
            enablePan
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
          />
        </Canvas>

        {/* Control buttons */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}
        >
          {/* Fullscreen */}
          <Button
            shape="circle"
            size="large"
            icon={full ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={() => setFull(!full)}
            style={{
              background: GOLD,
              border: "none",
              color: "#fff",
              boxShadow: "0 6px 16px rgba(0,0,0,0.3)"
            }}
          />

          {/* Auto rotate */}
          <Button
            shape="circle"
            size="large"
            icon={<SyncOutlined spin={autoRotate} />}
            onClick={() => setAutoRotate(v => !v)}
            style={{
              background: "#222",
              border: `1px solid ${GOLD}`,
              color: GOLD
            }}
          />

          {/* Reset view */}
          <Button
            shape="circle"
            size="large"
            icon={<ReloadOutlined />}
            onClick={() => setResetKey(k => k + 1)}
            style={{
              background: "#222",
              border: `1px solid ${GOLD}`,
              color: GOLD
            }}
          />
        </div>
      </div>
    </div>
  );
}

