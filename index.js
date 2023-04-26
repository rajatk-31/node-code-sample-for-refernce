// var app = require('express')()

// app.use('/users', async function (req, res) {
//     await waitFifteenSec();
//     res.send('Hrefi');
// })

// var server = app.listen(8000);
// console.log("Server starte")
// server.setTimeout(10 * 1000); //10 sec

// server.on('timeout', function () {
//     console.log('timed out')
// })

// function waitFifteenSec() {
//     return new Promise(function (resolve) {
//         setTimeout(function () { resolve(); }, 15000);
//     });
// }

// let c = 1;

// function test(c) {
//     c = 2;
// }

// test(c);

// console.log(c);

// let obj = { "a": 1 }

// function objTest(obj) {
//     obj.a = 2;
// }

// objTest(obj);

// console.log(obj.a);

// let obj1 = { "a": 1 }

// function objTest1(...obj1) {
//     obj1.a = 2;
// }

// objTest1(obj1);

// console.log(obj1.a);


// (function () {
//     var p = Promise.resolve(5);
//     (async function () { await p; console.log(4); })();
//     p.then(console.log);
//     console.log(6)
// })()


// var http = require('http');
// http.createServer(function (req, res) {
//     console.log("hete")
//     res.write("Sample");
//     res.end();
// })
//     .listen(8080);


var http = require('http');

var options = {
    host: '127.0.0.1',
    port: 3333,
    path: '/',
    method: 'GET'
};

function work() {
    var req = http.request(options, function (res) {
        if (res.statusCode != 200) {
            process.exit(1)
        }
        res.setEncoding('utf8');
        res.on('data', function (chunk) { /* do something */ });
        res.on('end', function () { work(); });
    });
    req.on('error', function (e) {
        process.exit(1);
    });
    req.end();
}
work();