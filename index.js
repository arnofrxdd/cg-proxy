const http = require("http");
const net = require("net");

const PORT = process.env.PORT || 8080;

// Basic handler to make Railway healthcheck happy
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Tunnel proxy is running.\n");
});

// Handle HTTPS CONNECT requests (main tunneling logic)
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
