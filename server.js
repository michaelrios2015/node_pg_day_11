// this does the magic of leeting us use postgres
const pg = require('pg');

// here the pg>clien lets us connect to a database
const client = new pg.Client('postgres://postgres:JerryPine@localhost/depts_classes');




// we try to actually connect it could fail so the try an dcatch
// it's not fast so async
const setUP = async() => {
    try {
      await client.connect();
      console.log('connected to database');
    }
    catch(ex){
        console.log(ex)
    }

}

setUP();
