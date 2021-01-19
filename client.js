var net = require('net');
// Connect to a server @ port 9898
var client = net.createConnection({ port: 9898 }, function () {

});
var stdin = process.stdin;

stdin.on('data', function (text) {
    var data = text.toString("utf-8");
    stdin.setMaxListeners(1);
    client.write(data);
});


client.on("close", () => {
    client.setMaxListeners(1);
    client.destroy();
})

client.on('data', function (text) {
    client.setMaxListeners(1);
    console.log(text.toString("utf-8"));
});
