import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST-in-Peace API",
      version: "1.0.0",
      description: "API del fixture del Mundial — auth, torneo y datos por usuario",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT ?? 3001}`,
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
