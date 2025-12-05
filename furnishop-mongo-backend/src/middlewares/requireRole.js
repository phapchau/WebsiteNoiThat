// module.exports = function requireRole(role) {
//   return (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
//     if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
//     next();
//   };
// };




module.exports = function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthenticated" });

    // Nếu roles là 1 string -> chuyển thành array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Kiểm tra quyền
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
