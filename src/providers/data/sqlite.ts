import { SqlDatabase } from 'ionix-sqlite';
import { Meal, Food, Consume } from './interfaces';

export class SQLiteProvider {

    private dbPromise: Promise<SqlDatabase>;

    constructor() {

    }

    init() {
        const createMealsTable = `
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER KEY,
            name TEXT,
            balance INTEGER,
            modified TEXT )`;

        const createFoodsTable = `
        CREATE TABLE IF NOT EXISTS foods (
            id INTEGER KEY,
            name TEXT,
            unit TEXT,
            points INTEGER,
            parent_id INTEGER,
            modified TEXT )`;

        const createConsumesTable = `
        CREATE TABLE IF NOT EXISTS consumes (
            id INTEGER PRIMARY KEY,
            sid INTEGER KEY,
            uuid TEXT,
            food_id INTEGER,
            meal_id INTEGER,
            quantity INTEGER,
            date TEXT,
            created TEXT,
            deleted INTEGER,
            sync INTEGER)`;

        return this.dbPromise = SqlDatabase.open('dieta04.db', [
            createMealsTable,
            createFoodsTable,
            createConsumesTable,
        ]);
    }


    // Meals

    getMeals(): Promise<Meal[]> {
        const select = 'SELECT id, name, balance, modified FROM meals';
        return this.dbPromise
            .then(db => db.execute(select))
            .then(resultSet => {
                const items = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                    const row = resultSet.rows.item(i);
                    items.push({ ...row });
                }
                return items;
            });
    }

    insertMeals(meals): Promise<any> {
        if (meals.length < 1) {
            return Promise.resolve(false);
        }
        return this.insertTable('meals', meals, {
            fields: { id: 'id', name: 'name', balance: 'balance', modified: 'modified' }
        });
    }

    updateMeals(meals): Promise<any> {
        if (meals.length < 1) {
            return Promise.resolve(false);
        }
        return this.updateTable('meals', meals, {
            fields: { name: 'name', balance: 'balance', modified: 'modified' }
        });
    }

    deleteMeals(data: Meal[]): Promise<any> {
        if (data.length < 1) {
            return Promise.resolve(false);
        }
        const dataId = data.map(d => d.id).join(',')
        const deleteSql = `DELETE FROM meals WHERE id IN (${dataId}); `
        console.log(deleteSql);
        return this.dbPromise
            .then(db => db.execute(deleteSql))
            .catch((err) => this.errorHandler(err));

    }

    async saveMeals(data: Meal[], stateData: Meal[]) {
        const deleteData = data.filter((d: Meal) => d.deleted !== null)
        const insertData = data.filter((d: Meal) => d.deleted === null && stateData.find(s => s.id === d.id) === undefined)
        const updateData = data.filter((d: Meal) => d.deleted === null && stateData.find(s => s.id === d.id) !== undefined)
        await this.deleteMeals(deleteData);
        await this.insertMeals(insertData);
        await this.updateMeals(updateData);
        return this.getMeals();
    }


    // Foods

    getFoods(): Promise<Food[]> {
        const select = 'SELECT id, name, parent_id, points, unit, modified FROM foods';
        return this.dbPromise
            .then(db => db.execute(select))
            .then(resultSet => {
                const items = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                    const row = resultSet.rows.item(i);
                    items.push({
                        id: row.id,
                        name: row.name,
                        parent_id: row.parent_id === 'null' ? null : row.parent_id,
                        points: row.points,
                        unit: row.unit,
                        modified: row.modified,
                    });
                }
                return items;
            })

    }

    insertFoods(foods): Promise<any> {
        if (foods.length < 1) {
            return Promise.resolve(false);
        }
        return this.insertTable('foods', foods, {
            fields: { id: 'id', name: 'name', parent_id: 'parent_id', points: 'points', unit: 'unit', modified: 'modified' }
        });
    }

    updateFoods(foods): Promise<any> {
        if (foods.length < 1) {
            return Promise.resolve(false);
        }
        return this.updateTable('foods', foods, {
            fields: { name: 'name', parent_id: 'parent_id', points: 'points', unit: 'unit', modified: 'modified' }
        });
    }

    deleteFoods(data: Food[]): Promise<any> {
        if (data.length < 1) {
            return Promise.resolve(false);
        }
        const dataId = data.map(d => d.id).join(',')
        const deleteSql = `DELETE FROM foods WHERE id IN (${dataId}); `
        console.log(deleteSql);
        return this.dbPromise
            .then(db => db.execute(deleteSql))
            .catch((err) => this.errorHandler(err));

    }

    async saveFoods(data: Food[], stateData: Food[]) {
        const deleteData = data.filter((d: Food) => d.deleted !== null)
        const insertData = data.filter((d: Food) => d.deleted === null && stateData.find(s => s.id === d.id) === undefined)
        const updateData = data.filter((d: Food) => d.deleted === null && stateData.find(s => s.id === d.id) !== undefined)
        await this.deleteFoods(deleteData);
        await this.insertFoods(insertData);
        await this.updateFoods(updateData);
        return this.getFoods();
    }


    // Consumes

    getConsumes(): Promise<Consume[]> {
        const select = `SELECT id, sid, uuid, food_id, meal_id, quantity, date, created, sync FROM consumes WHERE deleted IS NULL`;
        return this.dbPromise
            .then(db => db.execute(select))
            .then(resultSet => {
                const items = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                    const row = resultSet.rows.item(i);
                    items.push({ ...row });
                }
                return items;
            });
    }

    getTrash(): Promise<string[]> {
        const select = `SELECT uuid FROM consumes WHERE deleted is NOT NULL`;
        return this.dbPromise
            .then(db => db.execute(select))
            .then(resultSet => {
                const items = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                    const row = resultSet.rows.item(i);
                    items.push(row.uuid);
                }
                console.log('getTrash', items);
                return items;
            });
    }

    insertConsumes(consumes): Promise<any> {
        if (consumes.length < 1) {
            return Promise.resolve(false);
        }
        return this.insertTable('consumes', consumes, {
            fields: { sid: 'id', uuid: 'uuid', food_id: 'food_id', meal_id: 'meal_id', quantity: 'quantity', date: 'date', created: 'created', sync: 'sync' }
        });
    }

    updateConsumes(consumes): Promise<any> {
        if (consumes.length < 1) {
            return Promise.resolve(false);
        }
        return this.updateTable('consumes', consumes, {
            primaryKey: 'uuid',
            fields: { sid: 'id', food_id: 'food_id', meal_id: 'meal_id', quantity: 'quantity', date: 'date', created: 'created', sync: 'sync' }
        });
    }

    deleteConsumes(data: Consume[]): Promise<any> {

        if (data.length < 1) {
            return Promise.resolve(false);
        }

        return this.updateTable('consumes', data.map(d => ({ ...d, deleted: 1, sync: 0 })), {
            primaryKey: 'uuid',
            fields: { deleted: 'deleted', sync: 'sync' }
        });

        /*console.log(data);
        const dataId = data.map(d => d.uuid).join(',')
        const deleteSql = `DELETE FROM consumes WHERE uuid IN ('${dataId}'); `
        console.log(deleteSql);
        return this.dbPromise
            .then(db => db.execute(deleteSql))
            .catch((err) => this.errorHandler(err));*/
    }

    trashConsumes(data: string[]): Promise<any> {

        if (data.length < 1) {
            return Promise.resolve(false);
        }

        const dataId = data.join(',')
        const deleteSql = `DELETE FROM consumes WHERE uuid IN ('${dataId}'); `
        console.log(deleteSql);
        return this.dbPromise
            .then(db => db.execute(deleteSql))
            .catch((err) => this.errorHandler(err));
    }

    async saveConsumes(data: Consume[], stateData: Consume[]) {
        const deleteData = data.filter((d: Consume) => d.deleted !== null)
        const insertData = data.filter((d: Consume) => d.deleted === null && stateData.find(s => s.uuid === d.uuid) === undefined)
        const updateData = data.filter((d: Consume) => d.deleted === null && stateData.find(s => s.uuid === d.uuid) !== undefined)
        console.log('insertData', insertData)
        console.log('updateData', updateData)
        console.log('deleteData', deleteData)
        await this.trashConsumes(deleteData.map(d => d.uuid));
        await this.insertConsumes(insertData);
        await this.updateConsumes(updateData);
        return this.getConsumes();
    }

    async saveTrash(data: string[], stateData: string[]) {
        console.log('saveTrash', data);
        await this.trashConsumes(data);
        /*await this.insertConsumes(insertData);
        await this.updateConsumes(updateData);*/
        return this.getTrash();
    }

    errorHandler(err) {
        console.error(err);
    }

    private batchSql(db: SqlDatabase, batch: string[]): Promise<any[]> {
        console.log('batchSql', batch)
        let promises: Promise<any>[] = [];
        batch.map((sql) => {
            promises.push(db.execute(sql))
        })
        return Promise.all(promises);
    }

    private updateTable(table: string, data: any[], options?: any): Promise<any> {
        if (data.length < 1) {
            return Promise.resolve(false);
        }
        const sql = data.map((each: any) => this.updateQuery(table, each, options))
        return this.dbPromise
            .then(db => this.batchSql(db, sql))
            .catch((err) => this.errorHandler(err));
    }

    private updateQuery(table: string, data: any, options?: any): string {
        const defaultOptions = { primaryKey: 'id' };
        const _options = { ...defaultOptions, ...options };
        const primaryKey = data[_options.primaryKey];
        const fieldKeys = Object.keys(_options.fields);
        const tableFields = _options.fields !== undefined ? fieldKeys : Object.keys(data);
        const fieldsData = tableFields.reduce((acc, field: string) => acc += `${field} = '${data[_options.fields[field]]}', `, ``).slice(0, -2);
        return `UPDATE ${table} SET ${fieldsData} WHERE ${_options.primaryKey} = '${primaryKey}';`;
    }

    private insertTable(table: string, data: any[], options?: any): Promise<any> {
        if (data.length < 1) {
            return Promise.resolve(false);
        }
        const sql = data.map((each: Consume) => this.insertQuery(table, each, options))
        return this.dbPromise
            .then(db => this.batchSql(db, sql))
            .catch((err) => this.errorHandler(err));
    }

    private insertQuery(table: string, data: any, options?: any): string {
        const defaultOptions = {};
        const _options = { ...defaultOptions, ...options };
        const fieldKeys = Object.keys(_options.fields);
        const tableFields = _options.fields !== undefined ? fieldKeys : Object.keys(data);
        const fieldsData = tableFields.reduce((acc, field: string) => acc += `'${data[_options.fields[field]]}', `, ``).slice(0, -2);
        return `INSERT INTO ${table} (${tableFields.join(', ')}) VALUES (${fieldsData}) ;`;
    }


    async destroyAll() {

        await this.destroyTable('meals');
        await this.destroyTable('foods');
        await this.destroyTable('consumes');
        /*return this.dbPromise
            .then(db => db.execute('DELETE FROM config WHERE ((key != "language") AND (key != "intro"))'))
            .then(resultSet => {
                return resultSet;
            });*/
    }

    destroyTable(table: string): Promise<any> {
        const sql = 'DELETE FROM ' + table;
        console.log(sql);
        return this.dbPromise
            .then(db => db.execute(sql))
            .then(resultSet => {
                return resultSet;
            });
    }

}