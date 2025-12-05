



// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Chatbot = ({ currentUserId }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { role: 'bot', text: 'Xin chào! Mình có thể giúp bạn tìm nội thất hoặc kiểm tra đơn hàng.', type: 'text' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isOpen]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: 'user', text: input, type: 'text' };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // const token = localStorage.getItem("token");
//       // const res = await axios.post(
//       //   "http://localhost:8081/api/chat",
//       //   { message: input },
//       //   { headers: { Authorization: `Bearer ${token}` } }
//       // );
//       const token = localStorage.getItem("token");

// const headers = {};
// if (token) {
//   headers.Authorization = `Bearer ${token}`;
// }

// const res = await axios.post(
//   "http://localhost:8081/api/chat",
//   { message: input },
//   { headers }
// );


//       const data = res.data;
//       setMessages(prev => [...prev, {
//         role: 'bot',
//         text: data.reply,
//         type: data.type,
//         payload: data.data
//       }]);
//     } catch (err) {
//       console.error(err);
//       setMessages(prev => [...prev, { role: 'bot', text: 'Lỗi kết nối server.', type: 'text' }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatVND = (price) =>
//     new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

//   const renderContent = (msg) => {
//     // Render sản phẩm
//     if (msg.type === 'product_list' && msg.payload?.length) {
//       return (
//         <div className="mt-2 grid grid-cols-2 gap-4">
//           {msg.payload.map((prod, i) => (
//             <div key={i} className="bg-white rounded-lg border shadow-sm p-3">
//               <img
//                 src={prod.poster || 'https://placehold.co/150'}
//                 alt={prod.name}
//                 className="w-full h-36 object-cover rounded mb-2"
//               />
//               <h4 className="text-sm font-bold line-clamp-2 h-10">{prod.name}</h4>
//               <p className="text-red-600 font-bold text-sm">{formatVND(prod.price)}</p>
//               {prod.colors?.length > 0 && (
//                 <p className="text-gray-500 text-xs mt-1">Màu: {prod.colors.join(", ")}</p>
//               )}
//               <button
//                 onClick={() => navigate(`/products/${encodeURIComponent(prod.slug || prod._id)}`)}
//                 className="block mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded"
//               >
//                 Xem ngay
//               </button>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     // Render đơn hàng
//     if (msg.type === 'order_info' && msg.payload?.length) {
//       return (
//         <div className="mt-2 flex flex-col gap-3">
//           {msg.payload.map((ord, i) => (
//             <div
//               key={i}
//               className="bg-gray-50 p-3 rounded border text-xs cursor-pointer hover:bg-gray-100"
//               onClick={() => navigate(`/orders/${encodeURIComponent(ord.code)}`)}
//             >
//               <p><strong>Mã:</strong> {ord.code}</p>
//               <p><strong>Trạng thái:</strong> <span className="text-blue-600">{ord.status}</span></p>
//               <p><strong>Tổng tiền:</strong> {formatVND(ord.total)}</p>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return null;
//   };

//   return (
//     <div className="fixed bottom-5 right-5 z-50 font-sans">
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
//         >
//           💬
//         </button>
//       )}

//       {isOpen && (
//         <div className="w-[450px] h-[570px] bg-white rounded-xl shadow-2xl flex flex-col border overflow-hidden animate-fade-in-up">
//           <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
//             <h3 className="font-bold">NATURAHOME</h3>
//             <button onClick={() => setIsOpen(false)}>✕</button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-4">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
//               >
//                 <div
//                   className={`max-w-[85%] p-3 rounded-xl text-sm ${
//                     msg.role === 'user'
//                       ? 'bg-purple-600 text-white rounded-tr-none'
//                       : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//                 {renderContent(msg)}
//               </div>
//             ))}
//             {isLoading && <div className="text-xs text-gray-400 ml-2">Đang soạn tin...</div>}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-3 bg-white border-t flex gap-2">
//             <input
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && handleSend()}
//               placeholder="Nhập tin nhắn..."
//               className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-purple-500"
//             />
//             <button
//               onClick={handleSend}
//               className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
//             >
//               ➤
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;//26/11














import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712100.png";
const USER_AVATAR = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png";

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Mình có thể giúp bạn tìm nội thất hoặc kiểm tra đơn hàng.",
      type: "text"
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input, type: "text" };
    setMessages((prev) => [...prev, userMsg]);

    const rawInput = input;
    setInput("");

    // Bot typing effect
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        "http://localhost:8081/api/chat",
        { message: rawInput },
        { headers }
      );

      const data = res.data;

      // Simulate delay typing
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: data.reply,
            type: data.type,
            payload: data.data
          }
        ]);
        setIsTyping(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠ Lỗi kết nối server.", type: "text" }
      ]);
      setIsTyping(false);
    }
  };

  // Format VND
  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Render sản phẩm, đơn hàng
  const renderPayload = (msg) => {
    if (msg.type === "product_list" && msg.payload?.length) {
      return (
        <div className="mt-2 grid grid-cols-2 gap-3 animate-fadeIn">
          {msg.payload.map((p, i) => (
            <div
              key={i}
              className="p-3 bg-white border border-purple-200 rounded-xl shadow hover:shadow-lg transition"
            >
              <img src={p.poster} className="h-28 w-full object-cover rounded" />
              <div className="font-semibold mt-1 text-sm line-clamp-2">{p.name}</div>
              <div className="text-purple-600 font-bold">{formatVND(p.price)}</div>

              <button
                onClick={() => navigate(`/products/${p.slug}`)}
                className="w-full mt-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg"
              >
                Xem ngay
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (msg.type === "order_info" && msg.payload?.length) {
      return (
        <div className="mt-2 flex flex-col gap-2 animate-fadeIn">
          {msg.payload.map((o, i) => (
            <div
              key={i}
              onClick={() => navigate(`/orders/${o.code}`)}
              className="cursor-pointer border border-purple-200 bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition"
            >
              <div><b>Mã:</b> {o.code}</div>
              <div><b>Trạng thái:</b> {o.status}</div>
              <div><b>Tổng:</b> {formatVND(o.total)}</div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">

      {/* BUTTON OPEN CHAT */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 
                     text-white text-3xl shadow-2xl flex items-center justify-center 
                     animate-pulse hover:scale-110 transition"
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-[450px] h-[600px] bg-white rounded-3xl shadow-2xl border border-purple-300 flex flex-col animate-slideUp">
          
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-600 text-white flex justify-between items-center rounded-t-3xl shadow">
            <div className="flex items-center gap-3">
              <img src={BOT_AVATAR} className="w-10 h-10 rounded-full shadow-lg" />
              <div>
                <div className="font-bold text-lg">NaturaBot</div>
                <div className="text-xs opacity-80">Hỗ trợ khách hàng</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-xl hover:text-gray-200">✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start animate-fadeIn ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar */}
                {msg.role === "bot" && (
                  <img src={BOT_AVATAR} className="w-9 h-9 rounded-full shadow" />
                )}

                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow 
                    ${msg.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-purple-100 rounded-tl-none"
                    }`}
                >
                  {msg.text}
                  {renderPayload(msg)}
                </div>

                {msg.role === "user" && (
                  <img src={USER_AVATAR} className="w-9 h-9 rounded-full shadow" />
                )}
              </div>
            ))}

            {/* Bot typing... */}
            {isTyping && (
              <div className="flex items-center gap-2 animate-fadeIn">
                <img src={BOT_AVATAR} className="w-8 h-8 rounded-full opacity-70" />
                <div className="bg-white p-3 rounded-xl border border-purple-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef}></div>
          </div>

          {/* INPUT */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-purple-50 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-3 rounded-full hover:scale-110 shadow-lg transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
