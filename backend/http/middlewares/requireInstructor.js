export default function requireInstructor(req, res, next) {
  if (req.user?.role !== "INSTRUCTOR") {
    return res.status(403).json({ error: "Access denied. Instructors only." });
  }
  next();
}