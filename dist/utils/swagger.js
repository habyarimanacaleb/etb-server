"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = swaggerDocs;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_ui_dist_1 = __importDefault(require("swagger-ui-dist"));
const swaggerDistPath = swagger_ui_dist_1.default.getAbsoluteFSPath();
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
                url: "http://localhost:5000/api",
                description: "Local development server",
            },
            {
                url: "https://etb-server-wine.vercel.app/api",
                description: "Production server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // path to your route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app) {
    app.use("/api-docs", express_1.default.static(swaggerDistPath));
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(` Swagger Docs available at http://localhost:${process.env.PORT || 5000}/api-docs`);
}
