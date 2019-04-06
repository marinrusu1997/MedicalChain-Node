const massive = require('massive');

let db;

massive({
   host: "127.0.0.1",
   port: 5432,
   database: "marin",
   user: "marin",
   password: "2307mgd73fn"
}).then(instance => {
   db = instance;
   return Promise.resolve(db);
}).then( () => {
   console.log("Connected to PostgreSQL successfull!")
}).catch(e => {
   console.log(e)
   console.log('error while getting massive instance')
})

function createPoll(db, payload, blockinfo, context) {
   db.poll_data.insert({
      id : payload.data.id,
      data : payload.data.data
   }).then(new_poll => {
      console.log("poll created")
   }).catch(e => {
      console.error('error while inserting data')
   })
}

//Register blockchain Actions to which this update will be called.
const updaters = [{
   actionType: "poll.p::create",
   updater: create
}]
