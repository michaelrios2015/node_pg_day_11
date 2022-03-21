// this does the magic of leeting us use postgres in general this is like the library I use in python
const pg = require('pg');
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`lostening on port ${port}`));

// here the pg client lets us connect to a database 
const client = new pg.Client('postgres://postgres:JerryPine@localhost/depts_classes');

// we used this often... I started liking to just create everything outside of the app
// and just connect to the app from the database 
const syncAndSeed = async() => {
    // so some sql 
    const SQL = `
    DROP TABLE IF EXISTS courses;
    DROP TABLE IF EXISTS depts;
    CREATE TABLE IF NOT EXISTS depts(
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses(
        id INTEGER,
        name VARCHAR(100) NOT NULL,
        depts_id INTEGER REFERENCES depts(id),
        PRIMARY KEY (id, depts_id)
    );
    
    -- a little data
    INSERT INTO depts(id, name) VALUES(1, 'CS');
    INSERT INTO depts(id, name) VALUES(2, 'Visual Arts');
    INSERT INTO depts(id, name) VALUES(3, 'Spanish');
    
    INSERT INTO courses(id, name, depts_id) VALUES(1, 'C++', 1);
    INSERT INTO courses(id, name, depts_id) VALUES(2, 'Java', 1);
    INSERT INTO courses(id, name, depts_id) VALUES(1, 'Painting', 2);
    `;

        //this part that connects then runs the SQL 
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
