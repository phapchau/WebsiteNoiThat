


// // src/App.jsx
// import { BrowserRouter } from "react-router-dom";
// import AppRouter from "./router/Approuter.jsx";
// import { CartProvider } from "./context/CartContext.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import Chatbot from "./components/Chatbot.jsx"; // ⬅️ thêm

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <CartProvider>
//           {/* Routes / Layout của bạn */}
//           <AppRouter />

//           {/* Nút chat nổi góc phải */}
//           <Chatbot />
//         </CartProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }6/11





// src/App.jsx
import AppRouter from "./router/Approuter.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Chatbot from "./components/Chatbot.jsx";


import MessageProvider from "./components/MessageProvider.jsx";


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MessageProvider>
        {/* Routes / Layout */}
        <AppRouter />

        {/* Nút chat nổi góc phải */}
        <Chatbot />
        </MessageProvider>
      </CartProvider>
    </AuthProvider>
  );
}


