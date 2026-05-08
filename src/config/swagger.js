const YAML = require('yamljs');

const swaggerSpec = YAML.load('./openapi.yaml');

module.exports = swaggerSpec;