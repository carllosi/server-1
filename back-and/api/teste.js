import express from "express";
import multer from "multer";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// === CONFIGURAÇÕES DE ARQUIVOS ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === MULTER PARA UPLOAD ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// === MONGO ===
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = "galeria";
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Conectado ao MongoDB!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}
connectDB();

// === ROTAS CRUD ===

// 🔹 CREATE (POST)
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { descricao, usuario } = req.body;
    const imgUrl = `http://127.0.0.1:3000/uploads/${req.file.filename}`;

    const novoPost = { descricao, usuario, imgUrl, data: new Date() };
    const result = await db.collection("posts").insertOne(novoPost);

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao salvar post:", error);
    res.status(500).json({ error: "Erro ao salvar post" });
  }
});

// 🔹 READ (GET)
app.get("/posts", async (req, res) => {
  try {
    const posts = await db.collection("posts").find().toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

// 🔹 UPDATE (PUT)
app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, usuario } = req.body;

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $set: { descricao, usuario } }
    );

    res.json({ message: "Post atualizado com sucesso", result });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

// 🔹 DELETE (DELETE)
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(id),
    });

    res.json({ message: "Post excluído com sucesso", result });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir post" });
  }
});

// === INICIAR SERVIDOR ===
app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
