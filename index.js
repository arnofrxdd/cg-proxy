const http = require("http");
const net = require("net");
const url = require("url");

const PORT = process.env.PORT || 8080;

const server = http.createServer();

server.on("connect", (req, clientSocket, head) => {
    const { port, hostname } = new URL(`http://${req.url}`);
    const serverSocket = net.connect(port, hostname, () => {
        clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    serverSocket.on("error", (err) => {
        clientSocket.end(`HTTP/1.1 500 ${err.message}\r\n`);
    });
});

server.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
