import db from "../config/database.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function getMovements(req, res) {
  try {
    const movements = await db.collection("movements").find().toArray();

    console.log(movements);

    return res.send(movements);
  } catch (error) {
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function postMovement(req, res) {
  const movement = req.body;
  const checkSession = res.locals.session;

  try {
    const data = await db
      .collection("movements")
      .insertOne({
        date: dayjs().format("DD/MM"),
        value: movement.value,
        description: movement.description,
        type: movement.type,
        idUsuario: checkSession.userID,
      });
    console.log(data);
    res.send("Movimentação cadastrada!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function updateMovement(req, res) {
  const { id } = req.params;
  const movement = req.body;

  try {
    const { modifiedCount } = await db
      .collection("movements")
      .updateOne({ _id: ObjectId(id) }, { $set: movement });

    if (modifiedCount === 0)
      return res.status(404).send("Essa movimentação não existe!");

    res.send("Movimentação atualizada com sucesso!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}

export async function deleteMovement(req, res) {
  const { id } = req.params;

  try {
    await db.collection("movements").deleteOne({ _id: ObjectId(id) });

    res.status(202).send("Movimentação excluída!");
  } catch (error) {
    res.status(500).send("Um erro inesperado ocorreu no servidor!");
  }
}
