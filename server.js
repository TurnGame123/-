const WebSocket = require('ws');
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Game Server OK\n');
});
const wss = new WebSocket.Server({ server });
const clients = new Set();
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('message', (data) => {
        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        }
    });
    ws.on('close', () => clients.delete(ws));
    ws.on('error', () => clients.delete(ws));
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server started on port:', PORT));
