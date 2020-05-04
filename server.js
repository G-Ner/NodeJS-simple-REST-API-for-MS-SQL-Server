var express = require('express');
var app = express();

var sql = require('mssql');

// Connection string parameters.
var sqlConfig = {
    user: 'cycle46',
    password: 'Vision2020',
    server: 'cycle46.database.windows.net',
    database: 'c46usf'
}

// Start server and listen on http://localhost:8000/
var server = app.listen(8000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
})


async function execute(query) {

    return new Promise((resolve, reject) => {

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {

            resolve(result.recordset);

            sql.close();
        }).catch(err => {

            reject(err)
            sql.close();
            
        });
    });

}

// Get query that return data from orders table
app.get('/orders', function (req, res) {
    execute('SELECT * FROM Orders;')
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})

// Get query with where
app.get('/orders/:orderId/', function (req, res) {
    execute('SELECT * FROM Orders WHERE orderId = ' + req.params.orderId)
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})
