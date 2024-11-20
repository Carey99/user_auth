const path = require('path');

const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API for user management',
        },
        servers: [
            {
                url: 'https://user-auth-blush.vercel.app/api',
                description: 'Production server',
            },
        ],
    },
    apis: [path.join(__dirname, '../server.js')],
};

module.exports = swaggerJsDoc(swaggerOptions);