import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";

export default function Models3D() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    // 🟡 Danh sách file bạn lưu trong public/models
    const files = [
      { name: "Phòng khách Luxury 01", file: "/models/phongkhach.glb", thumb: "/models/thumbs/phongkhach (1).png" },
      { name: "Phòng khách Tối Giản 02", file: "/models/phongkhach2.glb", thumb: "/models/thumbs/phongkhach (2).png" },
      { name: "Phòng ngủ Hiện Đại", file: "/models/phongngu.glb", thumb: "/models/thumbs/phongkhach (3).png" },
      { name: "Phòng bếp Sang Trọng", file: "/models/phongbep.glb", thumb: "/models/thumbs/phongbep.png" },
    ];

    setModels(files);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#B88E2F" }}>
        Bộ Sưu Tập Mẫu Nhà 3D
      </h1>

      <p className="text-gray-600 mb-8">
        Khám phá các mẫu thiết kế nội thất cao cấp bằng công nghệ 3D – xoay, xem chi tiết từng góc nhìn.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {models.map((m, i) => (
          <Link key={i} to={`/models/view?file=${encodeURIComponent(m.file)}&name=${encodeURIComponent(m.name)}`}>
            <Card
              hoverable
              style={{ borderRadius: 16 }}
              cover={
                <img
                  src={m.thumb}
                  alt={m.name}
                  className="h-56 w-full object-cover rounded-t-xl"
                />
              }
            >
              <h3 className="text-lg font-semibold">{m.name}</h3>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
