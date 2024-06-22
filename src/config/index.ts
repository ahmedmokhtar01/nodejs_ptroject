import merge from "lodash.merge"
process.env.NODE_ENV = process.env.NODE_ENV || "development"

const stage = process.env.STAGE || "local"

// let's  make dynamic config based on the enviroment 
let envConfig

if (stage === "production") {
    envConfig = require('./prod').default
} else if (stage === "testing") {
    envConfig = require("./testing").default
} else {
    envConfig = require("./local").default
}

export default merge({
    stage,
    envConfig,
    port: 80,
    secrets: {
        jwt: process.env.JWT_SEC,
        database: process.env.DATABASE_URL
    }
}, envConfig)