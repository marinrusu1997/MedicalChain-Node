const { Migration } = require("demux-postgres")

const createTodoTable = new Migration (
   "createTodoTable", // name
   "public", // schema
   "create_todo_table.sql", // SQL file
 )
 
 // MigrationSequence[]
 // See: https://github.com/EOSIO/demux-js-postgres/blob/develop/src/interfaces.ts
 module.exports = [{
   migrations: [createTodoTable],
   sequenceName: "init"
 }]