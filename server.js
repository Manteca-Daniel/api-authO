const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Usa process.env en lugar de import.meta.env
const CLIENT_ID = process.env.VITE_GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_GITHUB_CLIENT_SECRET;

app.post("/auth/github", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Código no proporcionado" });
  }

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = response.data.access_token;

    if (!accessToken) {
      return res.status(500).json({ error: "No se pudo obtener el token" });
    }

    res.json({ token: accessToken });
  } catch (error) {
    console.error("Error al obtener el token:", error.message);
    res.status(500).json({ error: "Fallo al contactar con GitHub" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔐 Servidor OAuth corriendo en http://localhost:${PORT}`);
});
