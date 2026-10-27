import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger.js";
import { notFound, errorHandler } from "./middleware/errors.js";
import recipesRouter from "./routes/recipes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// 1. Who is allowed to call us from a browser. Your Vite app runs on
//    port 5173, a different "origin" than 3000, so the browser blocks it
//    unless the server says yes. Full CORS story on Nov 5.
app.use(cors({ origin: "http://localhost:5173" }));

// 2. Log every request.
app.use(logger);

// 3. Turn JSON bodies into req.body.
app.use(express.json());

// 4. Routes.
app.get("/", (req, res) => {
    res.json({ name: "Recipe Box API", endpoints: ["/api/recipes", "/api/recipes/:id"] });
});
app.use("/api/recipes", recipesRouter);

// 5. Nothing matched.
app.use(notFound);

// 6. Something threw.
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Kitchen open at http://localhost:${PORT}`);
});
