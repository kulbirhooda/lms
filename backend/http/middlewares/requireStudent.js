export default function requireStudent(req, res, next) {
  if (req.user?.role !== "STUDENT") {
    return res.status(403).json({ error: "Access denied. Students only." });
  }
  next();
}