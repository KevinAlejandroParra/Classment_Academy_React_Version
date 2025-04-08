const express = require('express');
const cors = require('cors');
const userRoutes = require("./routes/user.routes.js");

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true 
}));

app.use(express.json());


app.use('/api', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});