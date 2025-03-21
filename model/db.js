import { createPool } from "mysql2/promise";
import { Sequelize } from "sequelize";


export const db = new Sequelize('classcov2', 'root', '', {
    host: 'localhost',
    dialect: "mysql",
    logging: console.log, // Esto habilita el logging
})

