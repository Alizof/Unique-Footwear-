import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CHATBOT_TOPICS,
  ChatbotTopic,
  ChatMessage,
  SupportedLanguage,
  getSmartChatbotResponse
} from '../data/chatbotData';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MapPin,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Phone,
  UserCheck,
  Globe,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const {
    settings,
    openGeneralWhatsAppChat,
    setCurrentView,
    setIsSizeGuideOpen,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('hi'); // Default to Hindi as requested
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ownerName = settings.ownerName || 'Md. MARUF';
  const whatsappNumber = settings.whatsappNumber || '9709057763';
  const phoneNumber = settings.phoneNumber || '9709057763';
  const address = settings.address || 'Kokdoro Chowk, Pithoria, Kanke';

  // Initialize greeting when opening or switching language
  useEffect(() => {
    if (messages.length === 0) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initialGreeting: ChatMessage = {
        id: 'init-1',
        sender: 'bot',
        language: lang,
        time: now,
        text:
          lang === 'hi'
            ? `नमस्ते! 🙏 *Unique Style Footwear* के WhatsApp सहायता केंद्र में आपका स्वागत है।\n\nप्रोप्राइटर **${ownerName}** (कोकदोरो चौक, पिठोरिया, कांके) की ओर से आपका अभिनंदन।\n\nआप नीचे दिए गए विकल्पों में से चुन सकते हैं या अपना सवाल हिंदी/English में टाइप कर सकते हैं!`
            : `Hello! 🙏 Welcome to *Unique Style Footwear* WhatsApp Assistant.\n\nWarm greetings on behalf of proprietor **${ownerName}** (Kokdoro Chowk, Pithoria, Kanke).\n\nSelect a topic below or type any question in Hindi or English!`,
      };
      setMessages([initialGreeting]);
    }
  }, [lang, ownerName]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const toggleLanguage = () => {
    const newLang = lang === 'hi' ? 'en' : 'hi';
    setLang(newLang);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const langChangeMsg: ChatMessage = {
      id: `lang-${Date.now()}`,
      sender: 'bot',
      language: newLang,
      time: now,
      text:
        newLang === 'hi'
          ? `🇮🇳 भाषा बदलकर **हिंदी** कर दी गई है। अब आप हिंदी में सवाल पूछ सकते हैं या जानकारी प्राप्त कर सकते हैं।`
          : `🌐 Language switched to **English**. You can now ask questions in English or explore footwear.`,
    };
    setMessages((prev) => [...prev, langChangeMsg]);
  };

  const handleTopicClick = (topic: ChatbotTopic) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User question
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      language: lang,
      time: now,
      text: topic.question[lang],
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        language: lang,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: topic.answer[lang],
        actionButton: topic.actionType
          ? {
              label: topic.actionText ? topic.actionText[lang] : (lang === 'hi' ? 'जानकारी देखें' : 'View Info'),
              type: topic.actionType === 'whatsapp_owner' ? 'whatsapp' : topic.actionType === 'open_size_guide' ? 'guide' : 'view',
              urlOrView: topic.actionType,
            }
          : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      language: lang,
      time: now,
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const smartResponse = getSmartChatbotResponse(query, lang, ownerName, whatsappNumber, address);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        language: lang,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: smartResponse.answer,
        actionButton: smartResponse.actionType
          ? {
              label: smartResponse.actionText || (lang === 'hi' ? 'WhatsApp पर पूछें' : 'Ask on WhatsApp'),
              type: smartResponse.actionType === 'whatsapp_owner' ? 'whatsapp' : smartResponse.actionType === 'open_size_guide' ? 'guide' : 'view',
              urlOrView: smartResponse.actionType,
            }
          : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleActionButtonClick = (actionType?: string, actionLabel?: string) => {
    if (!actionType) return;

    if (actionType === 'whatsapp_owner') {
      const defaultHindi = `नमस्ते मोहम्मद मारुफ़ जी (Unique Style Footwear), मुझे जूतों के डिजाइन, साइज और उपलब्धता के बारे में जानकारी चाहिए।`;
      const defaultEng = `Hello ${ownerName} (Unique Style Footwear), I have an enquiry regarding footwear designs and size availability.`;
      const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
      const fullNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
      const url = `https://wa.me/${fullNum}?text=${encodeURIComponent(lang === 'hi' ? defaultHindi : defaultEng)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (actionType === 'navigate_shop') {
      setCurrentView('shop');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (actionType === 'navigate_contact') {
      setCurrentView('contact');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (actionType === 'navigate_offers') {
      setCurrentView('offers');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (actionType === 'open_size_guide') {
      setIsSizeGuideOpen(true);
    }
  };

  const resetChat = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        language: lang,
        time: now,
        text:
          lang === 'hi'
            ? `चैट रीसेट हो गई है! 🙏 नमस्ते, मैं Unique Style Footwear चैटबॉट हूँ। प्रोप्राइटर **${ownerName}** जी की ओर से आपकी क्या सेवा करूँ?`
            : `Chat restarted! 🙏 Hello, I am Unique Style Footwear chatbot. How can I help you today?`,
      },
    ]);
  };

  const openDirectWhatsAppWithCustomPrompt = (promptText?: string) => {
    const defaultText =
      lang === 'hi'
        ? `नमस्ते मोहम्मद मारुफ़ जी (Unique Style Footwear), मुझे जूतों के बारे में जानकारी चाहिए।`
        : `Hello Md. MARUF (Unique Style Footwear), I would like to inquire about footwear styles and pricing.`;
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const fullNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    const url = `https://wa.me/${fullNum}?text=${encodeURIComponent(promptText || defaultText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50">
      {isOpen ? (
        <div className="w-[92vw] sm:w-96 md:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Top Header Bar */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-4 text-white shrink-0 relative shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/30 shadow-xs shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm leading-tight tracking-wide text-white">
                      {settings.brandName || 'UNIQUE STYLE FOOTWEAR'}
                    </h4>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-white/25 text-[9px] font-extrabold uppercase">
                      AI 24/7
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>WhatsApp हिंदी चैटबॉट • {ownerName}</span>
                  </p>
                </div>
              </div>

              {/* Language Switcher & Controls */}
              <div className="flex items-center gap-1.5">
                {/* Hindi / English Toggle Button */}
                <button
                  onClick={toggleLanguage}
                  className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-black flex items-center gap-1 border border-white/30 transition-colors shadow-xs"
                  title="भाषा बदलें (Switch Language: हिंदी / English)"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? '🇮🇳 हिंदी' : '🌐 EN'}</span>
                </button>

                {/* Reset Chat Button */}
                <button
                  onClick={resetChat}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
                  title="चैट रीसेट करें (Restart Chat)"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close Chatbot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Proprietor Subtitle bar */}
            <div className="mt-2.5 pt-2 border-t border-emerald-500/50 flex items-center justify-between text-[10px] text-emerald-100">
              <span className="flex items-center gap-1 truncate max-w-[240px]">
                <MapPin className="w-3 h-3 text-emerald-200 shrink-0" />
                <span>कोकदोरो चौक, पिठोरिया, कांके</span>
              </span>
              <span className="font-mono font-bold bg-emerald-800/60 px-2 py-0.5 rounded-md text-white">
                +91 {whatsappNumber}
              </span>
            </div>
          </div>

          {/* Chat Messages Scrolling Container */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {/* Language Selector Banner */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                <span>🌐 {lang === 'hi' ? 'हिंदी भाषा में सहायता सक्रिय' : 'English Assistant Active'}</span>
                <button
                  onClick={toggleLanguage}
                  className="underline text-emerald-700 hover:text-emerald-950 ml-1 font-black"
                >
                  ({lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'})
                </button>
              </div>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[84%] rounded-2xl p-3 shadow-xs space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  {/* Bot Verified Badge */}
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Unique Style Assistant</span>
                      </span>
                      <span>{msg.time}</span>
                    </div>
                  )}

                  {/* Message Text formatted */}
                  <div className="whitespace-pre-line text-[12px] sm:text-xs">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('*') && line.endsWith('*')) {
                        return (
                          <strong key={idx} className="block font-bold text-slate-950 mt-1">
                            {line.replace(/\*/g, '')}
                          </strong>
                        );
                      }
                      return (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      );
                    })}
                  </div>

                  {/* Optional Action Button */}
                  {msg.actionButton && (
                    <div className="pt-1.5">
                      <button
                        onClick={() =>
                          handleActionButtonClick(msg.actionButton?.urlOrView, msg.actionButton?.label)
                        }
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          msg.actionButton.type === 'whatsapp'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                            : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
                        }`}
                      >
                        {msg.actionButton.type === 'whatsapp' ? (
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5" />
                        )}
                        <span>{msg.actionButton.label}</span>
                      </button>
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <div className="text-[9px] text-emerald-100 text-right">{msg.time}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-white py-2 px-3 rounded-2xl rounded-tl-none border border-slate-200 w-fit shadow-xs animate-pulse">
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {lang === 'hi' ? 'उत्तर तैयार हो रहा है...' : 'Writing response...'}
                </span>
              </div>
            )}

            {/* Quick Topic Prompts (Hindi & English) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {lang === 'hi' ? '⚡ मुख्य प्रश्न (Quick Topics):' : '⚡ Quick Topics:'}
                </p>
                <button
                  onClick={toggleLanguage}
                  className="text-[10px] text-emerald-700 font-bold hover:underline"
                >
                  {lang === 'hi' ? 'Switch to English' : 'हिंदी में देखें'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {CHATBOT_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/90 text-slate-700 transition-all text-[11px] font-medium flex items-center justify-between group shadow-2xs hover:border-emerald-300"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-sm shrink-0">{topic.icon}</span>
                      <span className="truncate">{topic.label[lang]}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Direct 1-Click WhatsApp Owner Bar */}
          <div className="px-3 py-2 bg-emerald-50/80 border-t border-emerald-200/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-950 font-bold truncate">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">
                {lang === 'hi' ? 'मालिक:' : 'Owner:'} {ownerName} (+91 {whatsappNumber})
              </span>
            </div>
            <button
              onClick={() => openDirectWhatsAppWithCustomPrompt()}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 shrink-0 shadow-xs transition-colors"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>{lang === 'hi' ? 'सीधा WhatsApp' : 'Direct WhatsApp'}</span>
            </button>
          </div>

          {/* Text Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'अपना सवाल हिंदी या English में लिखें...'
                  : 'Type your footwear question in Hindi or English...'
              }
              className="flex-1 px-3.5 py-2 bg-slate-50 text-xs text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold transition-colors flex items-center justify-center shrink-0 shadow-xs"
              title={lang === 'hi' ? 'भेजें' : 'Send'}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          id="floating-whatsapp-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-emerald-600/40 transition-all transform hover:scale-105 active:scale-95 border-2 border-white/20"
          aria-label="Open WhatsApp Hindi Chatbot"
        >
          {/* Active Ping Animation */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-300 border-2 border-white" />
          </span>

          <MessageCircle className="w-6 h-6 fill-white shrink-0" />
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-200 flex items-center gap-1">
              <span>🇮🇳 हिंदी चैटबॉट</span>
            </span>
            <span className="text-xs font-black tracking-wide">
              WhatsApp Help (मारुफ़)
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
