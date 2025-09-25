import swaggerJSDoc from "swagger-jsdoc";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerUiDist from "swagger-ui-dist";

const swaggerDistPath = swaggerUiDist.getAbsoluteFSPath();

const apisPath =
  process.env.NODE_ENV === "development"
    ? "src/routes/*.ts"
    : "dist/routes/*.js";

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
          : `${process.env.BASE_URL}/api`,
        description: "Server URL",
      },
    ],
  },
  apis: [apisPath], // dynamic path for routes
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app: Application): void {
  // Serve swagger.json
  app.get("/api-docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Serve Swagger UI
  app.use("/api-docs", express.static(swaggerDistPath));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerUrl: "/api-docs/swagger.json"
  }));

  console.log(
    `Swagger Docs available at ${process.env.BASE_URL || "http://localhost:5000"}/api-docs`
  );
}
