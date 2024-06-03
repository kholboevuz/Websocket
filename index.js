const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');


const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server\n');
});

const wss = new WebSocket.Server({ server: app });

function fetchDataAndSendToClients() {
  axios
    .get('DB CONNECT URI')
    .then((response) => {
      const apiData = response.data;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(apiData));
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
}

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send initial data to the client when they connect
  fetchDataAndSendToClients();

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

setInterval(fetchDataAndSendToClients, 3000);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
