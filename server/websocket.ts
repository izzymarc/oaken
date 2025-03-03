import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { storage } from './storage';

interface ChatMessage {
  type: 'message';
  senderId: number;
  receiverId: number;
  content: string;
}

// Store active connections
const clients = new Map<number, WebSocket>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    let userId: number | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString()) as ChatMessage & { type: string };

        if (message.type === 'auth') {
          userId = message.senderId;
          clients.set(userId, ws);
          return;
        }

        if (message.type === 'message' && userId) {
          // Store message in database
          const savedMessage = await storage.createMessage({
            senderId: userId,
            receiverId: message.receiverId,
            content: message.content
          });

          // Send to recipient if online
          const recipientWs = clients.get(message.receiverId);
          if (recipientWs?.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify(savedMessage));
          }

          // Send back to sender as confirmation
          ws.send(JSON.stringify(savedMessage));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });
}
