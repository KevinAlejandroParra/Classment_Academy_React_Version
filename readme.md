# Classment Academy

## Descripción
Este proyecto está dividido en dos partes: **Backend (server)** y **Frontend (client)**.

El backend utiliza `sequelize-cli` para manejar las migraciones y los seeders, permitiendo estructurar la base de datos en SQL. Los datos de los seeders se encuentran en un archivo JSON.

## Instalación
Antes de ejecutar el proyecto, instala las dependencias necesarias ejecutando:

```sh
npm run download
```

Esto instalará las dependencias tanto en el **server** como en el **client**.

---
## Comandos disponibles

### Ejecutar el servidor backend
```sh
npm run server
```

### Ejecutar el cliente frontend
```sh
npm run client
```

### Migraciones de la base de datos

Crear la estructura de la base de datos según los modelos definidos:
```sh
npm run db:migrate
```

Revertir la última migración aplicada:
```sh
npm run db:migrate:undo
```

### Seeders (Datos de prueba)

Cargar los datos iniciales en la base de datos:
```sh
npm run db:seed
```

Eliminar los datos cargados previamente por los seeders:
```sh
npm run db:seed:undo
```

---
## Autor
**Kevin Alejandro Parra Cifuentes**

Licencia ISC

