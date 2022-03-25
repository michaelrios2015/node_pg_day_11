// starting to seperate out parts, the computer does not care but it is fing unreadable if you don't
// do this 
const { client, syncAndSeed } = require('./db');  

// this does the magic of leeting us use postgres in general this is like the library I use in python
const express = require('express');
const path = require('path');

const app = express();

// so the famous static files which include css, pictures, javascript, I think they are called static because 
// they never change while a html could change... even just a straight html file needs to change I believe
// for the moment it is ok I don't completely understand 
app.use('/assest', express.static(path.join(__dirname, 'assests')));

// so at the beggining we did not have a seperate api and componenet all just mixed together 
app.get('/', async(req, res, next)=> {
    // try catch just gives us a better way to fail
    // try is the risky one catch is teh safe one 
    try {
        const response = await client.query('SELECT * FROM depts');
        const depts = response.rows
        // respones has a whole bunch of stuff 
        // console.log(response);
        // the famous list 
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/assest/styles.css' />
            </head>
            <body>
                <h1> FORDHAM </h1>
                <ul>
                    ${
                        depts.map( dept => `
                            <li>
                                <a href = 'depts/${dept.id}'>
                                ${ dept.name }
                                </a>
                            </li>
                        `).join('') 
                    }
                </ul>
            </body>
        </html>`);
    }
    // ex seems to just be the error or maybe exception can be called whatever you want 
    catch(ex){
        // next seems to be a magical error message handler
        // in this case it is sent to to the webpage 
        next(ex)
        // at this point console.log only appears in the terminal 
        console.log(ex)
    }

});

app.get('/depts/:id', async(req, res, next)=> {
    // try catch just gives us a better way to fail
    // try is the risky one catch is teh safe one 
    console.log('here')
    try {
        // the magic of promises which is just an array of await calles that are not dependent
        // on each other
        // the magic $1 to nake sql injection harder
        const promises = [
            client.query('SELECT * FROM depts WHERE id=$1', [req.params.id]),
            client.query('SELECT * FROM courses WHERE depts_id=$1', [req.params.id])
        ];

        // the famous promis all which just lets you deal with more then one await at a time 
        // we even destructed it (not my favorite term) to make it slightly easier use 
        const [deptResponses, courseRespones ] = await Promise.all(promises);
        
        const dept = deptResponses.rows[0];
        
        // const response = await client.query('SELECT * FROM depts WHERE id=2');
        const courses = courseRespones.rows;

        // respones has a whole bunch of stuff 
        // console.log(response);
        // the famous list 
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/assest/styles.css' />
            </head>
            <body>
            <h1>   Fordham </h1>    
            <h2> <a href = '/'>Depts:</a>  ${ dept.name } </h2>
                <ul>
                ${
                    courses.map( course => `
                        <li>
                            ${ course.name }
                            </a>
                        </li>
                    `).join('') 
                }
                </ul>        
            </body>
        </html>`);
    }
    // ex seems to just be the error or maybe exception can be called whatever you want 
    catch(ex){
        // next seems to be a magical error message handler
        // in this case it is sent to to the webpage 
        next(ex)
        // at this point console.log only appears in the terminal 
        console.log(ex)
    }

});


app.get('*', (req, res, next) =>{
    res.send('what???');
  });
  


const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));



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
