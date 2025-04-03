const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
