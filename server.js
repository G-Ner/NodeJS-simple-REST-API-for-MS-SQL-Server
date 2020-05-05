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

    var host = server.address(8080).address
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
app.get('/customers', function (req, res) {
    execute('SELECT * FROM ECustomers;')
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})

// Get query with where
app.get('/customers/:cid/', function (req, res) {
    execute('SELECT * FROM ECustomers WHERE CustomerID = ' + req.params.cid)
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})

app.get('/customers/orders/:cid', function (req, res) {
    execute('SELECT * FROM EOrders WHERE CustID = ' + req.params.cid)
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})

// Get query with where
app.get('/orders/:oid/', function (req, res) {
    execute('SELECT * FROM EOrders WHERE OrderID - ' + req.params.oid)
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})
