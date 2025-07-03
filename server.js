// server.js
const net = require("net");
const http = require("http");

const server = http.createServer();
server.on("connect", (req, clientSocket, head) => {
    const [host, port] = req.url.split(":");
    const serverSocket = net.connect(port, host, () => {
        clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    serverSocket.on("error", () => clientSocket.end());
    clientSocket.on("error", () => serverSocket.end());
});

server.listen(process.env.PORT || 8080, () => {
    console.log("HTTPS CONNECT proxy running on port 8080");
});
