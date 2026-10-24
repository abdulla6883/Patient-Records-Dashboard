"use client";
export const dynamic = "force-static";

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  CheckCheck,
  ArrowLeft,
  MessageSquare,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ALL_CONVERSATIONS = [
  { name: 'Emily Williams', image: '/emily.png', role: 'Patient' },
  { name: 'Ryan Johnson', image: '/ryan.png', role: 'Patient' },
  { name: 'Jessica Taylor', image: '/jessica.png', role: 'Patient' },
  { name: 'Brandon Mitchell', image: '/brandon.png', role: 'Patient' },
];

export default function MessagesPage() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [activeChat, setActiveChat] = React.useState(ALL_CONVERSATIONS[0].name);
  const [searchQuery, setSearchQuery] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) { setMessages([]); return; }
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages (incoming replies) every 2 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, activeChat]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || sending) return;

    // Optimistic update
    const optimistic = {
      id: `opt-${Date.now()}`,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      receiver: activeChat,
      sender: 'Dr. Jose Simmons',
      optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);
    setNewMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, receiver: activeChat }),
      });
      if (res.ok) {
        // Replace optimistic with real
        fetchMessages();
      } else {
        // Remove optimistic on failure
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      console.error(err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const filteredConversations = ALL_CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversations = filteredConversations.map(c => {
    const chatMsgs = messages.filter(m => m.receiver === c.name || m.sender === c.name);
    const lastMsg = chatMsgs[chatMsgs.length - 1] ?? null;
    return {
      ...c,
      message: lastMsg ? lastMsg.content : 'No messages yet',
      time: lastMsg ? lastMsg.time : '',
      active: activeChat === c.name,
    };
  });

  const currentMessages = messages.filter(
    m => m.receiver === activeChat || (m.sender === activeChat)
  );
  const activeChatData = ALL_CONVERSATIONS.find(c => c.name === activeChat) ?? ALL_CONVERSATIONS[0];

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[60px] lg:pt-[72px] flex flex-col">
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
        
        {/* Sidebar */}
        <div className={`w-full lg:w-[340px] xl:w-[380px] border-r border-[#EDEDED] bg-white flex flex-col flex-shrink-0 ${isChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Sidebar Header */}
          <div className="p-4 lg:p-6 border-b border-[#EDEDED]">
            <div className="flex items-center space-x-3 mb-4">
              <Link href="/" className="p-2 bg-gray-50 rounded-xl hover:bg-[#01F0D0]/10 transition-all text-[#072635]">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Messages</h1>
              <span className="ml-auto bg-[#01F0D0] text-[#072635] text-[10px] font-black px-2 py-0.5 rounded-full">
                {conversations.filter(c => c.message !== 'No messages yet').length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707070]" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F6F7F8] rounded-xl text-sm focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { setActiveChat(chat.name); setIsChatOpen(true); }}
                className={`p-4 flex items-center space-x-3 cursor-pointer transition-all border-b border-[#F6F7F8] relative ${
                  chat.active ? 'bg-[#D8FCF7]' : 'hover:bg-gray-50'
                }`}
              >
                {chat.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#01F0D0] rounded-r-full" />}
                <div className="relative flex-shrink-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image src={chat.image} alt={chat.name} fill className="object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-extrabold text-[#072635] truncate">{chat.name}</span>
                    <span className="text-[10px] text-[#707070] font-bold flex-shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <p className="text-xs text-[#707070] truncate">{chat.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${isChatOpen ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Chat Header */}
          <div className="px-4 lg:px-6 py-4 bg-white border-b border-[#EDEDED] flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsChatOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-all text-[#072635]"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative">
                <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden border-2 border-[#01F0D0]">
                  <Image src={activeChatData.image} alt={activeChatData.name} fill className="object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#072635]">{activeChatData.name}</p>
                <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-[#072635]"><Phone size={18} /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-[#072635]"><Video size={18} /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-[#072635]"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#F6F7F8]/40">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-[#01F0D0]" size={32} />
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#01F0D0]/10 rounded-full flex items-center justify-center text-[#01F0D0]">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <p className="font-extrabold text-[#072635]">Start the conversation</p>
                  <p className="text-sm text-[#707070] mt-1">Send a message to {activeChatData.name}</p>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {currentMessages.map((msg, idx) => (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: msg.optimistic ? 0.7 : 1, y: 0 }}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.isMe && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 self-end">
                        <Image src={activeChatData.image} alt={activeChatData.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[65%] space-y-1 flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 text-sm leading-relaxed ${
                        msg.isMe
                          ? 'bg-[#072635] text-white rounded-2xl rounded-br-sm'
                          : 'bg-white text-[#072635] rounded-2xl rounded-bl-sm shadow-sm border border-[#EDEDED]'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center space-x-1 px-1">
                        <span className="text-[10px] text-[#707070] font-bold">{msg.time}</span>
                        {msg.isMe && <CheckCheck size={12} className={msg.optimistic ? 'text-gray-300' : 'text-[#01F0D0]'} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 lg:p-5 bg-white border-t border-[#EDEDED]">
            <div className="flex items-center space-x-3 bg-[#F6F7F8] rounded-2xl px-4 py-2">
              <button className="text-[#707070] hover:text-[#072635] transition-colors flex-shrink-0">
                <Paperclip size={20} />
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder={`Message ${activeChatData.name}...`}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                className="flex-1 py-2 bg-transparent text-sm outline-none text-[#072635] placeholder:text-[#707070]"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="w-9 h-9 flex items-center justify-center bg-[#01F0D0] text-[#072635] rounded-xl shadow-md shadow-[#01F0D0]/20 hover:bg-[#01d9bc] transition-all disabled:opacity-40 flex-shrink-0"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
