const express = require('express');
const asyncHandler = require('../async_handler');
const DatabasePool = require("../boundaries/DatabasePool");

class BaseController {
    constructor(entity) {
        if (new.target === BaseController) {
            throw new Error("BaseController is an abstract class and cannot be instantiated.");
        }
        this.entity = entity;
        this.router = express.Router();
        this.setRoutes();
    }

    setRoutes() {
        // Define in subclasses
    }

    setGet(path, handler, ...extraArgs) {
        this.router.get(path, asyncHandler(async (req, res) => handler(req, res, ...extraArgs)));
    }

    setPost(path, handler, ...extraArgs) {
        this.router.post(path, asyncHandler(async (req, res) => handler(req, res, ...extraArgs)));
    }

    setUpdate(path, handler, ...extraArgs) {
        this.router.put(path, asyncHandler(async (req, res) => handler(req, res, ...extraArgs)));
    }

    setDelete(path, handler, ...extraArgs) {
        this.router.delete(path, asyncHandler(async (req, res) => handler(req, res, ...extraArgs)));
    }

    getRouter() {
        return this.router;
    }

    async getAll(entity) {
        const db = await DatabasePool.getInstance();
        return await db.query(`SELECT * FROM ${entity.table}`);
    }

    async getById(entity, value) {
        const db = await DatabasePool.getInstance();
        let columns = Object.keys(entity);

        const [rows] = await db.query(`SELECT * FROM ${entity.table} WHERE ${columns[1]} = ?`, [value]) || null;
        entity.setInfo(rows[0]);
        return [entity, rows[0] || null];
    }

    async getAllImmediately(req, res, entity = this.entity, returnFlag) {
        const db = await DatabasePool.getInstance();
        const [rows] = await db.query(`SELECT * FROM ${entity.table}`);
        res.json(rows);
    }

    async getByIdImmediately(req, res, entity = this.entity) {
        const db = await DatabasePool.getInstance();
        let columns = Object.keys(entity);

        const [rows] = await db.query(`SELECT * FROM ${entity.table} WHERE ${columns[1]} = ?`, [req.params.id]);
        res.json(rows[0] || null);
    }

    async add(req, res, entity = this.entity) {
        const db = await DatabasePool.getInstance();

        // Extract column names and values
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        // Construct the query
        const columns = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        var result = await db.execute(`INSERT INTO ${entity.table} (${columns}) VALUES (${placeholders})`, values);
        console.log('here:', result[0].insertId);
        console.log('result[0]:', result[0]);
        res.status(200).json(result[0].insertId);
    }

    async modify(req, res, entity = this.entity) {
        const db = await DatabasePool.getInstance();
        let columnNames = Object.keys(entity);

        // Extract column names and values from req.body
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        // Construct the SET part of the query using the keys
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const result = await db.execute(`UPDATE ${entity.table} SET ${setClause} WHERE ${columnNames[1]}  = ?`, [...values, req.params.userId]);

        // Logging for debugging

        console.log('Update operation reached');
        res.json('Update successful');
    }


    async remove(req, res, entity = this.entity) {
        const db = await DatabasePool.getInstance();
        let columns = Object.keys(entity);

        await db.execute(`DELETE FROM ${entity.table} WHERE ${columns[1]} = ?`, [req.params.id]);
        res.sendStatus(200);
    }
}

module.exports = BaseController;
