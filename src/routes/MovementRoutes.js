import {
  getMovements,
  postMovement,
  updateMovement,
  deleteMovement,
  getMovementById,
} from "../controller/Movements.js";
import { Router } from "express";
import { validateSchema } from "../middleware/ValidateSchema.js";
import { movementSchema } from "../schema/MovementsSchema.js";
import { authValidation } from "../middleware/AuthMiddleware.js";

const movementsRouter = Router();

movementsRouter.use(authValidation);
movementsRouter.get("/movimentacoes", getMovements);
movementsRouter.get("/movimentacoes/:id", getMovementById);
movementsRouter.put(
  "/editar-entrada/:id",
  validateSchema(movementSchema),
  updateMovement
);
movementsRouter.post(
  "/movimentacoes",
  validateSchema(movementSchema),
  postMovement
);
movementsRouter.delete("/excluir-entrada/:id", deleteMovement);

export default movementsRouter;
