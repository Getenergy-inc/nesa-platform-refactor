import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useJudgeChat, type ChatMessage } from "@/hooks/useJudgeChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Send,
  Loader2,
  MoreVertical,
  Trash2,
  Pencil,
  MessageCircle,
  Users,
  Shield,
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";

function formatMessageDate(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function getInitials(name?: string): string {
  if (!name) return "JG";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function MessageBubble({ message, isOwn, onEdit, onDelete }: MessageBubbleProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
        <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-gold/20">
          <AvatarImage src={message.user_avatar} />
          <AvatarFallback className="bg-gold/20 text-gold text-xs font-bold">
            {getInitials(message.user_name)}
          </AvatarFallback>
        </Avatar>

        <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-white/70">
              {message.user_name || "Judge"}
            </span>
            <span className="text-[10px] text-white/40">
              {formatMessageDate(message.created_at)}
            </span>
            {message.is_edited && (
              <span className="text-[10px] text-white/30 italic">(edited)</span>
            )}
          </div>

          <div className="flex items-start gap-1 group">
            <div
              className={`px-4 py-2.5 rounded-2xl ${
                isOwn
                  ? "bg-gold text-charcoal rounded-tr-md"
                  : "bg-charcoal-light border border-gold/20 text-white rounded-tl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
            </div>

            {isOwn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4 text-white/50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-charcoal border-gold/20">
                  <DropdownMenuItem
                    onClick={() => onEdit(message.id, message.message)}
                    className="text-white/70 hover:text-white focus:text-white focus:bg-gold/10"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-charcoal border-gold/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(message.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function JudgeChatRoom() {
  const { user } = useAuth();
  const { messages, loading, error, sending, sendMessage, deleteMessage, editMessage } =
    useJudgeChat();
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      if (editingId) {
        await editMessage(editingId, inputText);
        toast.success("Message updated");
        setEditingId(null);
      } else {
        await sendMessage(inputText);
      }
      setInputText("");
      inputRef.current?.focus();
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && editingId) {
      setEditingId(null);
      setInputText("");
    }
  };

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setInputText(text);
    inputRef.current?.focus();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInputText("");
  };

  const onlineCount = new Set(messages.map((m) => m.user_id)).size;

  return (
    <>
      <Helmet>
        <title>Chat Room | Judges Arena | NESA-Africa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <JudgesArenaLayout title="Judges Chat Room" description="Private discussion space for jury members">
        <div className="h-[calc(100vh-120px)] flex flex-col p-4">
          {/* Chat Header */}
          <Card className="bg-charcoal-light border-gold/20 mb-4">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-charcoal" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Jury Discussion</h2>
                  <p className="text-xs text-white/50">Private • Encrypted • Secure</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/50">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{onlineCount} participants</span>
                </div>
                <Badge className="bg-gold/20 text-gold border-gold/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Jury Only
                </Badge>
              </div>
            </div>
          </Card>

          {/* Messages Area */}
          <Card className="flex-1 bg-charcoal-light border-gold/20 overflow-hidden flex flex-col">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-gold animate-spin" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-400">
                  <p>{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Be the first to start the discussion!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.user_id === user?.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gold/20 p-4">
              {editingId && (
                <div className="flex items-center justify-between mb-2 px-2 py-1 bg-gold/10 rounded text-sm">
                  <span className="text-gold">Editing message</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="text-white/50 hover:text-white h-6"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-charcoal border-gold/30 text-white placeholder:text-white/30 focus:border-gold"
                  disabled={sending}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputText.trim() || sending}
                  className="bg-gold hover:bg-gold-dark text-charcoal"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                Press Enter to send • Esc to cancel editing
              </p>
            </div>
          </Card>
        </div>
      </JudgesArenaLayout>
    </>
  );
}
