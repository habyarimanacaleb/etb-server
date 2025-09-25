import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

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
        url: "http://localhost:5000/api",
        description: "Local development server",
      },
      {
        url: "https://etb-server-wine.vercel.app/",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app: Application): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(
    ` Swagger Docs available at http://localhost:${process.env.PORT || 5000}/api-docs`
  );
}
