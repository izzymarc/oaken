import { useQuery } from "@tanstack/react-query";
import { Message, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { sendMessage, subscribe } = useWebSocket();

  // Get all messages for the current user
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedUser?.id],
    enabled: !!selectedUser,
  });

  useEffect(() => {
    if (!user) return;

    subscribe((newMessage: Message) => {
      queryClient.setQueryData<Message[]>(["/api/messages", selectedUser?.id], (old) => {
        if (!old) return [newMessage];
        return [...old, newMessage];
      });
    });
  }, [user, selectedUser, subscribe, queryClient]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    sendMessage(selectedUser.id, messageInput);
    setMessageInput("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[300px_1fr]">
          <div className="border-r">
            <div className="p-4 border-b">
              <Input placeholder="Search conversations..." />
            </div>
            <ScrollArea className="h-[600px]">
              {messages?.map((message) => {
                const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId;
                return (
                  <button
                    key={message.id}
                    className="w-full p-4 text-left hover:bg-accent transition-colors border-b"
                    onClick={() => setSelectedUser({ id: otherUserId } as User)}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {message.senderId === user?.id ? "R" : "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {message.senderId === user?.id ? "Recipient" : "Sender"}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt || new Date()), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </button>
                );
              })}
            </ScrollArea>
          </div>

          <div className="flex flex-col">
            <ScrollArea className="flex-1 p-4 h-[550px]" ref={scrollRef}>
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.senderId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(new Date(message.createdAt || new Date()), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form className="flex space-x-2" onSubmit={handleSendMessage}>
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button type="submit">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}