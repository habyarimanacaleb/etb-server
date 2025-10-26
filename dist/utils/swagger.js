"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = swaggerDocs;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const apisPath = process.env.NODE_ENV === "development"
    ? "./src/routes/*.ts"
    : "./dist/routes/*.js";
const options = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app) {
    // Serve swagger.json
    app.get("/api-docs/swagger.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    // Serve Swagger UI
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(null, {
        swaggerUrl: "/api-docs/swagger.json" // <-- explicitly tell UI where spec is
    }));
    console.log(`📄 Swagger Docs available at ${process.env.BASE_URL || "http://localhost:5000"}/api-docs`);
}
