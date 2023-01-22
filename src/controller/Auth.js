import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import db from "../config/database.js";
import { stripHtml } from "string-strip-html";

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  const userSanitized = { name: stripHtml(name).result.trim(), email: stripHtml(email).result.trim(), password: stripHtml(password).result };
  const passwordHashed = bcrypt.hashSync(userSanitized.password, 10);

  try {
  const userExists = await db
    .collection("users")
    .findOne({ email });

  if (userExists)
    return res.status(409).send("Este email já está em uso!");

    await db
      .collection("users")
      .insertOne({ name: userSanitized.name, email: userSanitized.email, password: passwordHashed });
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
    const name = userExists.name;
    
    await db
      .collection("sessions")
      .insertOne({ userID: userExists._id, token });

    return res.status(200).send({token, name});
  } catch (error) {
    res.status(500).send(error.message);
  }
}
