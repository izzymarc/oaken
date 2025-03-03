import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './use-auth';
import { Message } from '@shared/schema';
import { useToast } from './use-toast';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const connect = useCallback(() => {
    if (!user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Authenticate the WebSocket connection
      ws.send(JSON.stringify({ type: 'auth', senderId: user.id }));
    };

    ws.onerror = () => {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to chat server',
        variant: 'destructive',
      });
    };

    wsRef.current = ws;
  }, [user, toast]);

  const sendMessage = useCallback((receiverId: number, content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
      toast({
        title: 'Connection Error',
        description: 'Reconnecting to chat server...',
      });
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        type: 'message',
        senderId: user?.id,
        receiverId,
        content,
      })
    );
  }, [user, connect, toast]);

  const subscribe = useCallback((onMessage: (message: Message) => void) => {
    if (!wsRef.current) return;

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return { sendMessage, subscribe };
}
