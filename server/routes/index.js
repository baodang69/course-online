const authRouter = require("./authRoutes");
const courseRouter = require("./courseRoutes");
const lessonRouter = require("./lessonRoutes");
const enrollRouter = require("./enrollRoutes");
const categoryRouter = require("./categoryRoutes");
const levelRouter = require("./levelRoutes");
const roleRouter = require("./roleRoutes");

function route(app) {
  app.use("/api", authRouter);
  app.use("/api/course", courseRouter);
  app.use("/api/lesson", lessonRouter);
  app.use("/api/enroll", enrollRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/level", levelRouter);
  app.use("/api/role", roleRouter);
}

module.exports = route;
