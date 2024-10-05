import { createPool } from "mysql2/promise";
import { Sequelize } from "sequelize";

export const db = new Sequelize('classcov', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
})

