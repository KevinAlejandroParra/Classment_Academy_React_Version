const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/index.js"];


const doc = {
    info: {
        version: "1.0.0",
        title: "API",
        description: "API para la aplicación de gestión de clases"
    },
    host: "localhost:5000",
    schemes: ["http"]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
