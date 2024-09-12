// Create express app
var express = require("express")
const ejs = require('ejs');
var db = require("./database.js")

var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Root endpoint
app.get("/", (req, res, next) => {

    var sql = "select * from task"
    var params = []
    db.all(sql, params, (err, result) => {
        if (err) {
            console.log("ERROR! Line 29")
        }
        res.render('index.ejs', {data: result});
      });
});

// Root endpoint
app.get("/tv", (req, res, next) => {

    var sql = "select * from task"
    var params = []
    db.all(sql, params, (err, result) => {
        if (err) {
            console.log("ERROR! Line 29")
        }
        res.render('tv.ejs', {data: result});
      });
});


// New Task Enpoint
app.get("/api/new_task", (req, res, next) => {

    var sql = "select * from task"
    var params = [req.params.id]
    db.all(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.render('create_task.ejs', {data: result});
    });
});

// New Task Enpoint
app.get("/api/selected_task/:id", (req, res, next) => {

var sql = "select * from task where id = ?"
    var params = [req.params.id]
    db.all(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.render('edit_task.ejs', {data: result});
      });
});

// Insert here other API endpoints
app.get("/api/tasks", (req, res, next) => {
    var sql = "select * from task"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/task/:id", (req, res, next) => {
    var sql = "select * from task where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.post("/api/add_task/", (req, res, next) => {
    var data = {
        title: req.body.title,
        summary: req.body.summary,
        effort: req.body.effort,
    }
    var sql ='INSERT INTO task (title, summary, effort) VALUES (?,?,?)'
    var params =[data.title, data.summary, data.effort]
    db.run(sql, params, function (err, data) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        
        return res.redirect('/');
    });
})

app.post("/api/edit_task/:id", (req, res, next) => {
    var data = {
        title: req.body.title ? req.body.title : req.params.title,
        summary: req.body.summary ? req.body.summary : req.params.summary,
        effort : req.body.effort ? req.body.effort : req.params.effort,
    }
    db.run(
        `UPDATE task set 
           title = COALESCE(?,title), 
           summary = COALESCE(?,summary), 
           effort = COALESCE(?,effort)
           WHERE id = ?`,
        [data.title, data.summary, data.effort, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            return res.redirect('/');

    });
})

app.get("/api/delete_task/:id", (req, res, next) => {
    var sql = "DELETE FROM task WHERE id = ?"
    var params = req.params.id
    db.run(sql, params, function (err, row) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        return res.redirect('/');
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
