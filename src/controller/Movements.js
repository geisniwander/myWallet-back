import db from "../config/database.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";

export async function getMovements(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const user = await db.collection("sessions").findOne({ token });

    if (!user) return res.status(401).send("Não autorizado");

    const movements = await db
      .collection("movements")
      .find({ userID: ObjectId(user.userID) })
      .toArray();

    return res.send(movements);
  } catch (error) {
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function getMovementById(req, res) {
  const { id } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const user = await db.collection("sessions").findOne({ token });

    const movement = await db
      .collection("movements")
      .findOne({ _id: ObjectId(id) });

    if (!movement) res.status(404).send("Movimentação inválida!");

    if (user.userID.toString() !== movement.userID.toString())
      return res.status(401).send("Não autorizado!");

    return res.send(movement);
  } catch (error) {
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function postMovement(req, res) {
  const movement = req.body;
  const checkSession = res.locals.session;
  const movementSanitized = {
    value: stripHtml(movement.value).result.trim(),
    description: stripHtml(movement.description).result.trim(),
    type: stripHtml(movement.type).result.trim(),
  };

  try {
    const data = await db.collection("movements").insertOne({
      date: dayjs().format("DD/MM"),
      value: movementSanitized.value,
      description: movementSanitized.description,
      type: movementSanitized.type,
      userID: checkSession.userID,
    });
    res.status(201).send("Movimentação cadastrada!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function updateMovement(req, res) {
  const { id } = req.params;
  const movement = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const movementSanitized = {
    value: stripHtml(movement.value).result.trim(),
    description: stripHtml(movement.description).result.trim(),
  };

  try {
    const user = await db.collection("sessions").findOne({ token });

    const movement = await db
      .collection("movements")
      .findOne({ _id: ObjectId(id) });

    if (!movement) res.status(404).send("Movimentação inválida!");

    if (user.userID.toString() !== movement.userID.toString())
      return res.status(401).send("Não autorizado!");

    const { modifiedCount } = await db
      .collection("movements")
      .updateOne({ _id: ObjectId(id) }, { $set: movementSanitized });

    if (modifiedCount === 0)
      return res.status(404).send("Essa movimentação não existe!");

    res.status(200).send("Movimentação atualizada com sucesso!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function deleteMovement(req, res) {
  const { id } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const user = await db.collection("sessions").findOne({ token });

    const movement = await db
      .collection("movements")
      .findOne({ _id: ObjectId(id) });

    if (!movement) res.status(404).send("Movimentação inválida!");

    if (user.userID.toString() !== movement.userID.toString())
      return res.status(401).send("Não autorizado");

    await db.collection("movements").deleteOne({ _id: ObjectId(id) });

    res.status(202).send("Movimentação excluída!");
  } catch (error) {
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}
