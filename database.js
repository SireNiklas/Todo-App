var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE task (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text UNIQUE, 
            summary text UNIQUE,
            points integer
        )`,
        (err) => {
            if (err) {
                // Table already created
                console.log("Table already created...")
            }else{
                console.log("Table created!")
                // // Table just created, creating some rows
                // var insert = 'INSERT INTO task (title, summary, points) VALUES (?,?,?)'
                // db.run(insert, ["asdwdw Sasdwdwqawdasd tream","HeasdwdwadsStream",6])
                // db.run(insert, ["asdasd","SCREEEM!",6])
                // db.run(insert, ["Hello, World!","TEEEHEEEEEEEEEEEEE!",6])
                
            }
        });  
    }
});


module.exports = db
