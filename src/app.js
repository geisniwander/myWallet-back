import express from "express"
import cors from "cors"
import authRouter from "./routes/AuthRoutes.js"


const server = express();

server.use(express.json());
server.use(cors());

server.use([authRouter])

server.listen(5000, () => {console.log("Server is listening on port 5000")})