import { useSearchParams, Link } from "react-router-dom";
import ModelViewer from "../components/3DHouse";

export default function ModelViewerPage() {
  const [sp] = useSearchParams();
  const url = sp.get("file");
  const name = sp.get("name") || "Mẫu 3D";

  if (!url) return <div className="p-10">Không tìm thấy file.</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <Link to="/models" className="text-yellow-600 hover:underline">&larr; Quay lại</Link>

      <h1
        className="text-3xl font-bold mt-3 mb-6"
        style={{ color: "#B88E2F" }}
      >
        {name}
      </h1>

      <div className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-xl border">
        <ModelViewer url={url} className="w-full h-full" autoRotate cameraControls />
      </div>
    </section>
  );
}
