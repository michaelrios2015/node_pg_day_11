// this does the magic of leeting us use postgres
const pg = require('pg');

// here the pg>clien lets us connect to a database
const client = new pg.Client('postgres://postgres:JerryPine@localhost/depts_classes');

// we used this often... I started liking to just create everything outside of the app
// and just connect to the app from the database 
const syncAndSeed = async() => {
    const SQL = `
    CREATE TABLE IF NOT EXISTS depts(
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    `;

    await client.query(SQL);
};


// we try to actually connect it could fail so the try an dcatch
// it's not fast so async
const setUP = async() => {
    try {
      await client.connect();
      await syncAndSeed();
      console.log('connected to database');
    }
    catch(ex){
        console.log(ex)
    }

}

setUP();
