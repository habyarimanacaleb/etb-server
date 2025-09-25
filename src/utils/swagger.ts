import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const apisPath =
  process.env.NODE_ENV === "development"
    ? "./src/routes/*.ts"
    : "./dist/routes/*.js";




const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ETB Server API",
      version: "1.0.0",
      description: "API documentation for ETB (Engineering Tech Build) server",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : `${process.env.BASE_URL}/api`

      },
    ],
  },
  apis: [apisPath], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app: Application): void {
  // Serve swagger.json
  app.get("/api-docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, {
    swaggerUrl: "/api-docs/swagger.json" // <-- explicitly tell UI where spec is
  }));

  console.log(
    `📄 Swagger Docs available at ${process.env.BASE_URL || "http://localhost:5000"}/api-docs`
  );
}
