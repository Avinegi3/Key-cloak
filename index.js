import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import documents from "./Routes/documents.js";
import authenticate from "./Routes/authenticate.js";

(async function () {
  dotenv.config();

  const { PORT } = process.env;
  const app = express();

  // Configure CORS
  const corsOptions = {
    origin: 'http://localhost:5173', // Assuming your React app runs on port 5173
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  const server = app.listen(PORT, () =>
    console.log(`Backend started on port ${PORT}`)
  );

  app.use("/documents", authenticate, documents);
})();
