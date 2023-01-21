import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import db from "../config/database.js";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const passwordHashed = bcrypt.hashSync(password, 10);

  try {
    await db
      .collection("users")
      .insertOne({ name, email, password: passwordHashed });
    res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const userExists = await db.collection("users").findOne({ email });

    if (!userExists) return res.status(400).send("Usuário ou senha incorretos");

    const checkPassword = bcrypt.compareSync(password, userExists.password);

    if (!checkPassword)
      return res.status(400).send("Usuário ou senha incorretos");

    const token = uuidV4();

    await db
      .collection("sessions")
      .insertOne({ userID: userExists._id, token });

    return res.status(200).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
