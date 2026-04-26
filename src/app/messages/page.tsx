"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MessagesPage() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, receiver: 'Emily Williams' }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const conversations = [
    { name: 'Emily Williams', message: messages[messages.length - 1]?.content || 'Start a conversation', time: messages[messages.length - 1]?.time || 'Now', unread: 0, image: '/emily.png', active: true },
    { name: 'Ryan Johnson', message: 'When is my next appointment?', time: '10:30 AM', unread: 0, image: '/ryan.png', active: false },
    { name: 'Jessica Taylor', message: 'I sent the lab results over.', time: 'Yesterday', unread: 0, image: '/jessica.png', active: false },
    { name: 'Brandon Mitchell', message: 'Thanks for the advice, doctor.', time: 'Monday', unread: 0, image: '/brandon.png', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[100px] lg:pt-[110px] pb-6 lg:pb-10 px-4 md:px-8">
      
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-140px)] min-h-[500px] card bg-white flex overflow-hidden shadow-lg border border-[#EDEDED]">
        {/* Sidebar */}
        <div className={`w-full lg:w-[380px] border-r border-[#EDEDED] flex flex-col ${isChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6 border-b border-[#EDEDED]">
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/" className="p-2 bg-gray-50 rounded-xl hover:bg-[#01F0D0]/10 transition-all text-[#072635]">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Messages</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-12 pr-4 py-3 bg-[#F6F7F8] rounded-2xl text-sm focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.map((chat, index) => (
              <div 
                key={index} 
                onClick={() => setIsChatOpen(true)}
                className={`p-4 lg:p-6 flex items-center space-x-4 cursor-pointer transition-all border-b border-[#F6F7F8] ${
                  chat.active ? 'bg-[#D8FCF7]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                  <Image src={chat.image} alt={chat.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-extrabold text-[#072635] truncate">{chat.name}</span>
                    <span className="text-[10px] text-[#707070] font-bold">{chat.time}</span>
                  </div>
                  <p className="text-xs text-[#707070] truncate">{chat.message}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-[#01F0D0] rounded-full flex items-center justify-center text-[10px] font-bold text-[#072635]">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#F6F7F8]/30 ${isChatOpen ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chat Header */}
          <div className="p-4 lg:p-6 bg-white border-b border-[#EDEDED] flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsChatOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-all text-[#072635]"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-[#01F0D0]">
                <Image src="/emily.png" alt="Emily" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-[#072635]">Emily Williams</span>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button className="p-2 lg:p-3 hover:bg-gray-100 rounded-full transition-all text-[#072635]">
                <Phone size={18} />
              </button>
              <button className="p-2 lg:p-3 hover:bg-gray-100 rounded-full transition-all text-[#072635]">
                <Video size={18} />
              </button>
              <button className="hidden sm:block p-2 lg:p-3 hover:bg-gray-100 rounded-full transition-all text-[#072635]">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar space-y-6">
            {messages.map((msg, idx) => (
              <MessageItem 
                key={idx}
                content={msg.content} 
                time={msg.time} 
                isMe={msg.isMe} 
              />
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 lg:p-6 bg-white border-t border-[#EDEDED]">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button className="p-2 lg:p-3 text-[#707070] hover:text-[#072635] transition-colors">
                <Paperclip size={20} />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-[#F6F7F8] rounded-xl lg:rounded-2xl text-sm focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleSendMessage}
                className="p-3 lg:p-4 bg-[#01F0D0] text-[#072635] rounded-xl lg:rounded-2xl shadow-lg shadow-[#01F0D0]/20 hover:scale-105 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MessageItem = ({ content, time, isMe }: { content: string, time: string, isMe: boolean }) => (
  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
      <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${
        isMe ? 'bg-[#072635] text-white rounded-tr-none' : 'bg-white text-[#072635] rounded-tl-none shadow-sm'
      }`}>
        {content}
      </div>
      <div className="flex items-center space-x-2 px-1">
        <span className="text-[10px] text-[#707070] font-bold">{time}</span>
        {isMe && <CheckCheck size={14} className="text-[#01F0D0]" />}
      </div>
    </div>
  </div>
);
