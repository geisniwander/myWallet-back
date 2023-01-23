import express from "express"
import cors from "cors"
import authRouter from "./routes/AuthRoutes.js"
import movementsRouter from "./routes/MovementRoutes.js";


const server = express();

server.use(express.json());
server.use(cors());

server.use([authRouter, movementsRouter])

server.listen(process.env.PORT, () => {console.log("Server running on port " + process.env.PORT)})