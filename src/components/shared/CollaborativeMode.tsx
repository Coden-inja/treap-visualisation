import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Copy, Check, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface CollaborativeModeProps {
  roomId?: string;
  onConnect?: (roomId: string) => void;
  onDisconnect?: () => void;
  users?: User[];
  isConnected?: boolean;
}

export const CollaborativeMode = ({ 
  roomId, 
  onConnect, 
  onDisconnect,
  users = [],
  isConnected = false 
}: CollaborativeModeProps) => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    const id = inputRoomId || generateRoomId();
    onConnect?.(id);
    toast.success('Connected to collaborative session');
  };

  const handleDisconnect = () => {
    onDisconnect?.();
    toast.info('Disconnected from session');
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Room ID copied to clipboard');
    }
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="glass border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Collaborative Mode</CardTitle>
          </div>
          <Badge 
            variant={isConnected ? "default" : "secondary"}
            className={isConnected ? "bg-primary/20 text-primary" : ""}
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>
        <CardDescription>
          Work together in real-time with multiple users
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Enter Room ID (or leave empty to create new)
              </label>
              <Input
                placeholder="Room ID"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                className="border-primary/20"
              />
            </div>
            <Button
              onClick={handleConnect}
              className="w-full bg-primary text-primary-foreground"
            >
              {inputRoomId ? 'Join Session' : 'Create New Session'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Room Info */}
            <Card className="border-primary/20 p-3">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Room ID</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted/50 px-3 py-2 rounded">
                    {roomId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyRoomId}
                    className="border-primary/20"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Active Users */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Active Users ({users.length})
              </div>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-primary/20"
                  >
                    <Avatar className="h-8 w-8" style={{ backgroundColor: user.color }}>
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No other users yet. Share the Room ID to invite others.
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="w-full border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              Disconnect
            </Button>
          </div>
        )}

        {/* Info */}
        <div className="pt-3 border-t border-primary/20">
          <p className="text-xs text-muted-foreground">
            {isConnected 
              ? 'All operations are synchronized in real-time across all connected users.'
              : 'Create or join a room to collaborate with others. All changes will be synced instantly.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
