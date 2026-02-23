
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Zap, 
  ChefHat, 
  Wallet, 
  PieChart, 
  ShoppingCart, 
  FileText,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Send,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  Search,
  User,
  Mail,
  Phone,
  Building2,
  Sparkles,
  LayoutGrid,
  ClipboardList
} from 'lucide-react';
import { PricingPlan, ModuleInfo } from './types';
import { GoogleGenAI } from "@google/genai";

// --- Sub-components (Defined first to avoid ReferenceErrors) ---

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Olá! Sou o assistente do CRO$$PROFIT. Como posso te ajudar a aumentar a lucratividade do seu restaurante hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // Fix: Always create a new GoogleGenAI instance right before making an API call.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é o assistente virtual do CRO$$PROFIT, um sistema de gestão de lucro para restaurantes. 
          Seu objetivo é ajudar donos de restaurantes a entenderem como o sistema funciona. 
          Fale sobre CMV (Custo de Mercadoria Vendida), Fichas Técnicas, Ponto de Equilíbrio e Margem de Contribuição. 
          Use linguagem simples, profissional e motivadora. 
          Não responda sobre assuntos que não sejam relacionados ao sistema ou gestão de restaurantes.`,
        },
      });
      
      // Fix: Use the .text property directly from GenerateContentResponse.
      const botResponse = response.text || "Desculpe, tive um problema ao processar sua pergunta. Pode repetir?";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Estou um pouco ocupado agora, mas o CRO$$PROFIT continua cuidando do seu lucro!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-[90vw] sm:w-96 h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-400 p-1.5 rounded-lg">
                <Zap size={18} className="text-blue-900" />
              </div>
              <span className="text-white font-bold">Assistente CRO$$PROFIT</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-white text-slate-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre seu lucro..."
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-900 transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-900 text-white p-2 rounded-xl hover:bg-blue-800 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-900 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

const MenuAnalytics = () => (
  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2">CMV Médio</p>
        <p className="text-2xl sm:text-3xl font-black text-blue-900">28.4%</p>
        <div className="mt-2 flex items-center text-green-500 text-xs font-bold">
          <TrendingUp size={14} className="mr-1" /> -2.1% vs mês passado
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2">Prato Principal</p>
        <p className="text-2xl sm:text-3xl font-black text-slate-800">Risoto de Funghi</p>
        <p className="mt-2 text-xs text-gray-400">Margem: 74%</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2">Engenharia</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[9px] font-black">STARS: 12</span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[9px] font-black">PLOWHORSES: 5</span>
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[9px] font-black">DOGS: 2</span>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-black text-lg sm:text-xl text-slate-800">Análise de Fichas Técnicas</h3>
        <button className="text-blue-900 font-bold text-xs flex items-center hover:underline">
          <Search size={14} className="mr-1" /> Filtrar itens
        </button>
      </div>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Item</th>
            <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-center">Custo</th>
            <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-center">Venda</th>
            <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-center">Margem %</th>
            <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[
            { name: "Hambúrguer Gourmet", cost: "12.50", price: "42.00", margin: "70.2", status: "Excelente" },
            { name: "Batata Frita G", cost: "4.20", price: "24.00", margin: "82.5", status: "Excelente" },
            { name: "Salmão Grelhado", cost: "38.00", price: "72.00", margin: "47.2", status: "Revisar" },
          ].map((item, i) => (
            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 text-sm">{item.name}</td>
              <td className="p-4 text-center text-slate-600 text-sm">R$ {item.cost}</td>
              <td className="p-4 text-center text-slate-600 font-black text-sm">R$ {item.price}</td>
              <td className="p-4 text-center">
                <span className={`font-black text-sm ${parseFloat(item.margin) > 60 ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.margin}%
                </span>
              </td>
              <td className="p-4 text-right">
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                  item.status === 'Excelente' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FinancialAnalytics = () => (
  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">DRE Executivo</h3>
          <p className="text-gray-500 text-xs">Competência: Junho/2024</p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-green-500 p-2 rounded-lg text-white shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-green-700 uppercase tracking-widest leading-none mb-1">Lucro Líquido</p>
            <p className="text-lg sm:text-xl font-black text-green-900 leading-none">R$ 24.320,00</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: "Faturamento Bruto", value: "112.450,00", color: "text-blue-900", bold: true },
          { label: "Custo de Mercadoria (CMV)", value: "-31.935,00", color: "text-red-500" },
          { label: "Taxas e Impostos", value: "-14.618,00", color: "text-red-500" },
          { label: "Margem de Contribuição", value: "65.897,00", color: "text-slate-800", bg: "bg-blue-50/50", bold: true },
          { label: "Custos Fixos", value: "-41.577,00", color: "text-red-500" },
          { label: "Resultado Operacional", value: "24.320,00", color: "text-green-600", bg: "bg-green-50/30", bold: true },
        ].map((row, i) => (
          <div key={i} className={`flex justify-between items-center p-3 sm:p-4 rounded-xl text-xs sm:text-sm ${row.bg || ''} ${row.bold ? 'font-black' : 'text-slate-600'}`}>
            <span>{row.label}</span>
            <span className={row.color}>R$ {row.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SalesAnalytics = () => (
  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-black text-lg text-slate-800 mb-6">Pico de Movimento</h3>
        <div className="flex items-end gap-1.5 h-40">
          {[30, 45, 60, 90, 100, 85, 40, 20, 15].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-100 rounded-t-lg relative group transition-all hover:bg-blue-900">
              <div style={{ height: `${h}%` }} className="bg-blue-900 rounded-t-lg w-full"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 px-1">
          <span>12h</span>
          <span>18h</span>
          <span>21h</span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-black text-lg text-slate-800 mb-6">Mix de Pagamentos</h3>
        <div className="space-y-5">
          {[
            { label: "Cartão de Crédito", value: 65, color: "bg-blue-900" },
            { label: "Pix / Débito", value: 30, color: "bg-green-500" },
            { label: "Dinheiro", value: 5, color: "bg-yellow-400" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-wider">
                <span className="text-slate-700">{item.label}</span>
                <span className="text-slate-400">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div style={{ width: `${item.value}%` }} className={`h-full ${item.color}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FiscalAnalytics = () => (
  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 text-blue-900 rounded-2xl shrink-0">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">Conformidade Fiscal</h3>
          <p className="text-green-600 text-xs font-bold flex items-center mt-1">
            <CheckCircle2 size={14} className="mr-1" /> Empresa 100% regularizada
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "NFC-e Emitidas", val: "1.245" },
          { label: "Impostos do Mês", val: "R$ 8.940" },
          { label: "Créditos", val: "R$ 450", high: true },
          { label: "Alertas", val: "0", warn: true }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl ${stat.high ? 'bg-blue-50 border border-blue-100' : stat.warn ? 'bg-orange-50/50 border border-orange-100' : 'bg-gray-50'}`}>
            <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">{stat.label}</p>
            <p className={`text-lg font-black ${stat.high ? 'text-blue-900' : stat.warn ? 'text-orange-900' : 'text-slate-800'}`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('sandbox');

  const plans = [
    { id: 'essencial', name: 'Essencial' },
    { id: 'profissional', name: 'Profissional' },
    { id: 'business', name: 'Business' },
    { id: 'enterprise', name: 'Enterprise' },
    { id: 'sandbox', name: 'Sandbox 30 dias' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-in zoom-in duration-500 px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Solicitação Enviada!</h2>
          <p className="text-slate-600 mb-10 leading-relaxed text-sm sm:text-base">
            Nossa equipe entrará em contato em breve para liberar seu acesso ao <span className="font-bold text-blue-900">{plans.find(p => p.id === selectedPlan)?.name}</span>. Prepare-se para ver seu lucro crescer!
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-6 px-4">
      <div className="animate-in slide-in-from-left duration-700">
        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-blue-900 rounded-full font-bold text-sm mb-6">
          <Sparkles size={16} className="mr-2" /> ACESSO EXCLUSIVO
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
          Sua jornada para o <span className="text-blue-900 underline decoration-yellow-400">Lucro Real</span> começa aqui.
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
          Preencha os dados ao lado para criarmos seu ambiente personalizado. 
          Escolha o plano de interesse ou comece agora mesmo pelo Sandbox de 30 dias.
        </p>
        
        <div className="space-y-4 sm:space-y-6">
          {[
            { icon: <CheckCircle2 className="text-blue-900" />, text: "Configuração guiada do ambiente" },
            { icon: <CheckCircle2 className="text-blue-900" />, text: "Análise de DRE e CMV real" },
            { icon: <CheckCircle2 className="text-blue-900" />, text: "Suporte especializado na implantação" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-slate-700 font-medium">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">{item.icon}</div>
              <span className="text-sm sm:text-base">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-2xl animate-in slide-in-from-right duration-700">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-2 uppercase tracking-widest">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="text" placeholder="João Silva" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 transition-all outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-2 uppercase tracking-widest">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="email" placeholder="joao@restaurante.com" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 transition-all outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-2 uppercase tracking-widest">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="tel" placeholder="(00) 00000-0000" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 transition-all outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-2 uppercase tracking-widest">Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="text" placeholder="Nome do Negócio" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 transition-all outline-none text-sm" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 mb-2 uppercase tracking-widest">Plano de Interesse</label>
            <div className="relative">
              <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 transition-all outline-none text-sm appearance-none cursor-pointer"
              >
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={18} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 sm:py-5 bg-blue-900 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-blue-800 shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Solicitar Acesso Agora <ChevronRight size={22} /></>
            )}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 leading-tight">
            Ao solicitar acesso, você autoriza o CRO$$PROFIT a entrar em contato via e-mail e WhatsApp para fins de configuração do ambiente.
          </p>
        </form>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    setIsOpen(false);
    navigate('/solicitar-acesso');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-900 p-2 rounded-lg shrink-0">
              <span className="text-yellow-400 font-black text-xl sm:text-2xl tracking-tighter">CRO$$</span>
            </div>
            <span className="text-blue-900 font-extrabold text-xl sm:text-2xl tracking-tight">PROFIT</span>
          </button>
          
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#conceito" onClick={(e) => handleLinkClick(e, 'conceito')} className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Conceito</a>
            <a href="#funciona" onClick={(e) => handleLinkClick(e, 'funciona')} className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Como funciona</a>
            <a href="#planos" onClick={(e) => handleLinkClick(e, 'planos')} className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Planos</a>
            <button
              onClick={handleContactClick}
              className="bg-blue-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Experimente Grátis
            </button>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 animate-in fade-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-8 space-y-4">
            <a href="#conceito" onClick={(e) => handleLinkClick(e, 'conceito')} className="block text-gray-600 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl transition-colors">Conceito</a>
            <a href="#funciona" onClick={(e) => handleLinkClick(e, 'funciona')} className="block text-gray-600 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl transition-colors">Como funciona</a>
            <a href="#planos" onClick={(e) => handleLinkClick(e, 'planos')} className="block text-gray-600 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl transition-colors">Planos</a>
            <div className="pt-4 px-2">
              <button 
                onClick={handleContactClick}
                className="w-full bg-blue-900 text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
              >
                Experimente Grátis
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
    <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-900 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{description}</p>
  </div>
);

const ModuleCard: React.FC<{ module: ModuleInfo; onClick: () => void }> = ({ module, onClick }) => (
  <div 
    className="relative group cursor-pointer h-full"
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
    <div className="relative p-8 bg-white border border-gray-200 rounded-3xl group-hover:border-transparent transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 bg-blue-50 text-blue-900 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors shrink-0">
          {module.icon}
        </div>
        <span className="text-xs font-bold text-blue-900 group-hover:text-yellow-400 flex items-center gap-1 transition-colors">
          Ver Demo <ChevronRight size={14} />
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-black mb-6 text-slate-800 group-hover:text-white transition-colors">{module.title}</h3>
      <ul className="space-y-4 flex-grow">
        {module.features.map((feature, idx) => (
          <li key={idx} className="flex items-start space-x-3 text-slate-600 group-hover:text-blue-100 transition-colors">
            <CheckCircle2 size={18} className="text-blue-600 group-hover:text-yellow-400 mt-0.5 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFooterNav = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
  <div className="min-h-screen relative bg-gray-50 flex flex-col">
    <Navbar />
    <AIChatBot />
    <div className="flex-grow">
      {children}
    </div>
    <footer className="bg-slate-900 text-white py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="sm:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-white p-2 rounded-lg shrink-0">
                <span className="text-blue-900 font-black text-xl tracking-tighter">CRO$$</span>
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">PROFIT</span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm sm:text-base leading-relaxed">
              O software definitivo para gestão de lucro em serviços de alimentação. 
              Transformamos dados em decisões inteligentes para o seu negócio.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Plataforma</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => handleFooterNav('conceito')} className="hover:text-white transition-colors text-left">Conceito</button></li>
              <li><button onClick={() => handleFooterNav('funciona')} className="hover:text-white transition-colors text-left">Como funciona</button></li>
              <li><button onClick={() => handleFooterNav('planos')} className="hover:text-white transition-colors text-left">Planos</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-center gap-3">
                <Wallet size={16} className="shrink-0" /> suporte@crossprofit.com.br
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="shrink-0" /> Seg-Sex, 09h às 18h
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] sm:text-xs">
          <p className="text-center sm:text-left">© 2024 CRO$$PROFIT. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Termos de Uso</a>
            <a href="#" className="hover:text-white">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const navigate = useNavigate();

  const modules: ModuleInfo[] = [
    {
      id: 1,
      title: "Gestão de Cardápio",
      icon: <ChefHat size={32} />,
      features: ["Fichas Técnicas", "Calculo CMV", "Engenharia de Menu", "Controle de Custos"]
    },
    {
      id: 2,
      title: "Dashboard Financeiro",
      icon: <BarChart3 size={32} />,
      features: ["DRE Automático", "Fluxo de Caixa", "Ponto de Equilíbrio", "Indicadores Reais"]
    },
    {
      id: 3,
      title: "Vendas e PDV",
      icon: <ShoppingCart size={32} />,
      features: ["Venda Rápida", "Gestão de Comandas", "Fidelização", "Controle de Estoque"]
    },
    {
      id: 4,
      title: "Gestão Fiscal",
      icon: <FileText size={32} />,
      features: ["Emissão NF-e", "Integração Contábil", "Arquivamento XML", "Compliance"]
    }
  ];

  const plans: PricingPlan[] = [
    { 
      id: 'cp1', 
      name: 'CP1', 
      price: 50, 
      modules: ['Lucratividade do cardápio', 'Fichas Técnicas ilimitadas', 'Cálculo da perdas'], 
      description: 'Lucratividade dos seus pratos.' 
    },
    { 
      id: 'cp2', 
      name: 'CP2', 
      price: 90, 
      modules: ['Lucratividade do negócio', 'Pto. Equilíbrio', 'DRE', 'Auditoria vendas', 'Dash boards', 'Inclui o CP1'], 
      description: 'Saúde financeira e performance.', 
      popular: true 
    },
    { 
      id: 'cp3', 
      name: 'CP3', 
      price: 120, 
      modules: ['PDV (integrado com APP vendas)', 'Inclui o CP1 e o CP2'], 
      description: 'Integração total de vendas.' 
    },
    { 
      id: 'cp4', 
      name: 'CP4', 
      price: 200, 
      modules: ['Módulo fiscal', 'Inclui o CP1, CP2 e CP3'], 
      description: 'Conformidade e alta performance.' 
    }
  ];

  const moduleRoutes: Record<number, string> = {
    1: '/demo/cardapio',
    2: '/demo/financeiro',
    3: '/demo/vendas',
    4: '/demo/fiscal',
  };

  const handleModuleClick = (id: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(moduleRoutes[id] || '/');
  };

  const DemoPageWrapper = ({ moduleId, content }: { moduleId: number; content: React.ReactNode }) => (
    <Layout>
      <main className="flex-1 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-6">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-900 font-black mb-4 hover:gap-2 transition-all gap-1 text-sm"
            >
              <ArrowLeft size={18} /> Voltar para o início
            </button>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              {modules.find(m => m.id === moduleId)?.title}
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Amostra real da inteligência de dados aplicada ao seu negócio.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white border-2 border-blue-900 text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all text-sm">
              Baixar Demo PDF
            </button>
            <button
              onClick={() => navigate('/solicitar-acesso')}
              className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 text-sm"
            >
              Solicitar Este Módulo
            </button>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-[2rem] border border-gray-100 shadow-xl mb-12">
          {content}
        </div>

        <div className="p-8 sm:p-10 bg-blue-900 rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/40 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="p-4 bg-yellow-400 text-blue-900 rounded-2xl animate-bounce shrink-0">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black mb-2">Sua gestão pode ser assim.</h3>
              <p className="text-blue-100 text-sm sm:text-base opacity-90">Chega de planilhas manuais. Automatize sua lucratividade agora.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/solicitar-acesso')}
            className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl relative z-10 w-full lg:w-auto"
          >
            Liberar meu Sandbox
          </button>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        </div>
      </main>
    </Layout>
  );

  return (
    <Routes>
      <Route path="/solicitar-acesso" element={
        <Layout>
          <main className="flex-1 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-blue-900 font-black mb-8 hover:gap-2 transition-all gap-1 text-sm sm:text-base"
              >
                <ArrowLeft size={20} /> Voltar para o início
              </button>
              <ContactForm />
            </div>
          </main>
        </Layout>
      } />
      <Route path="/demo/cardapio" element={<DemoPageWrapper moduleId={1} content={<MenuAnalytics />} />} />
      <Route path="/demo/financeiro" element={<DemoPageWrapper moduleId={2} content={<FinancialAnalytics />} />} />
      <Route path="/demo/vendas" element={<DemoPageWrapper moduleId={3} content={<SalesAnalytics />} />} />
      <Route path="/demo/fiscal" element={<DemoPageWrapper moduleId={4} content={<FiscalAnalytics />} />} />
      <Route path="*" element={
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-900 rounded-full font-bold text-xs sm:text-sm mb-6 animate-bounce">
              <Zap size={16} className="mr-2 shrink-0" /> SEU LUCRO TÁ NA VEZ
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              O Lucro tem que vir <span className="text-blue-900 underline decoration-yellow-400 decoration-4 sm:decoration-8">Primeiro</span> em qualquer negócio.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              O software definitivo para gestão de lucro em serviços de alimentação. Transformamos dados complexos em decisões simples para o seu dia a dia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate('/solicitar-acesso')}
                className="w-full sm:w-auto px-10 py-5 bg-blue-900 text-white rounded-2xl font-black text-lg hover:bg-blue-800 hover:shadow-2xl hover:shadow-blue-900/30 transition-all flex items-center justify-center group"
              >
                30 dias grátis
                <ChevronRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://cpsystem.shop/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 bg-white text-blue-900 border-2 border-blue-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all text-center"
              >
                Ver Demo Online
              </a>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
            <div className="absolute -top-10 -right-10 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-400 rounded-full blur-[80px] sm:blur-[120px] opacity-10"></div>
            <div className="absolute -bottom-10 -left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600 rounded-full blur-[80px] sm:blur-[120px] opacity-10"></div>
            <div className="relative z-10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] sm:border-[12px] border-white bg-white rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500 group">
               <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                alt="Operação de restaurante moderna" 
                className="w-full h-[350px] sm:h-[500px] object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 text-white">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-yellow-400 mb-2">Cuidado Operacional</p>
                <h3 className="text-xl sm:text-2xl font-black">Feito por especialistas em Food Service.</h3>
              </div>
            </div>
            
            <div className="absolute -bottom-6 sm:-bottom-10 -left-6 sm:-left-10 z-20 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-100 hidden sm:block animate-pulse">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lucro Projetado</p>
                  <p className="text-xl font-black text-slate-800">+ R$ 24.320</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Profit? */}
      <section id="funciona" className="py-20 sm:py-24 px-4 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">O que o CRO$$PROFIT faz por sua empresa?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <FeatureCard
              icon={<ClipboardList size={28} />}
              title="Fichas Técnicas"
              description="Elabore fichas técnicas detalhadas, em quantidade ilimitada, e veja quanto lucra cada item do seu cardápio."
            />
            <FeatureCard 
              icon={<PieChart size={28} />}
              title="Engenharia de Menu"
              description="Simule variações das receitas culinárias para garantir maior lucratividade do cardápio."
            />
            <FeatureCard 
              icon={<ShieldCheck size={28} />}
              title="Visão Antecipada"
              description="Conheça o resultado antes do mês iniciar, estimando o valor de variáveis estratégicas"
            />
          </div>
        </div>
      </section>

      {/* Indicators Section (Moved after Modules) */}
      <section id="conceito" className="py-24 px-4 bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Dois indicadores financeiros inquestionáveis</h2>
            <p className="text-2xl text-slate-600">Constituem a <b>Regra de Ouro </b> da lucratividade</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-blue-900 rounded-3xl shadow-xl shadow-blue-900/20 transition-all flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 bg-yellow-400 text-blue-900 rounded-2xl flex items-center justify-center font-black text-xl">1</div>
              <h3 className="text-xl font-bold text-white">Margem de Contribuição&nbsp;-&nbsp;MC</h3>
              <p className="text-blue-100 leading-relaxed text-sm">É o que sobra do Preço de Venda – PV quando dele se subtrai o Custo da receita culinária - CMV e a Despesa Variável da Venda – DVV, ou seja:</p>
              <div className="w-full font-black text-center text-lg text-white bg-white/10 py-4 rounded-2xl border border-white/10">
                MC = PV – CMV - DVV
              </div>
            </div>
            <div className="p-8 bg-blue-900 rounded-3xl shadow-xl shadow-blue-900/20 transition-all flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 bg-yellow-400 text-blue-900 rounded-2xl flex items-center justify-center font-black text-xl">2</div>
              <h3 className="text-xl font-bold text-white">Custo dos Materiais Vendidos&nbsp;-&nbsp;CMV</h3>
              <p className="text-blue-100 leading-relaxed text-sm">Representa o custo real dos insumos que saíram da sua cozinha. Controlar o CMV é o segredo para manter o lucro no bolso e evitar desperdícios invisíveis.</p>
            </div>
            <div className="p-8 bg-blue-900 rounded-3xl shadow-xl shadow-blue-900/20 transition-all flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 bg-yellow-400 text-blue-900 rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-yellow-400">Regra de Ouro</h3>
              <div className="space-y-4 mt-2 w-full">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                  <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">Margem Alvo</p>
                  <p className="text-2xl font-black text-white">MC ~ 50%</p>
                  <p className="text-sm text-yellow-400 mt-1 italic">(quanto maior melhor)</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                  <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">Custo Alvo</p>
                  <p className="text-2xl font-black text-white">CMV ~ 30%</p>
                  <p className="text-sm text-yellow-400 mt-1 italic">(quanto menor melhor)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Pricing Section */}
      <section id="planos" className="py-24 px-4 bg-white relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6">CRO$$PROFIT em QUATRO OPÇÕES</h2>
            <div className="mt-2 inline-block relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <p className="relative bg-blue-50 text-blue-900 px-8 py-3 rounded-full font-black text-xl md:text-2xl tracking-tighter shadow-sm border border-blue-100">
                Serviços <span className="text-blue-600"> À la carte</span> & <span className="text-blue-600">Self-service</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-blue-900 shadow-xl scale-105 z-10 bg-white' : 'border-gray-200 bg-white/50'} flex flex-col transition-all hover:border-blue-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                    Mais Escolhido
                  </div>
                )}
                <div className="mb-6 text-center">
                  <div className={`inline-block px-4 py-1 rounded-lg mb-4 ${plan.popular ? 'bg-blue-900 text-yellow-400' : 'bg-gray-100 text-blue-900'}`}>
                    <h3 className="text-3xl font-black tracking-tighter">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-gray-400 text-sm font-medium">R$</span>
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-gray-400 text-xs font-medium">/mês</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 mb-6 font-medium text-center italic">{plan.description}</p>
                
                <div className="space-y-3 mb-6 flex-grow">
                  {plan.modules.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm font-bold text-slate-800 leading-tight">
                      <div className="mt-1 shrink-0">
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      {m}
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${plan.popular ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20' : 'bg-white text-blue-900 border-2 border-blue-900 hover:bg-blue-50'}`}>
                  Garantir Futuro
                </button>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 md:p-12 bg-blue-900 rounded-[3rem] relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/40">
            <div className="relative z-10 max-w-xl text-left">
              <h3 className="text-3xl font-black text-white mb-4">Mude sua Perspectiva</h3>
              <p className="text-blue-100 text-lg">
                Comece enxergar seus números de uma forma totalmente nova nesses 30 dias. <br />
                <span className="font-bold text-white uppercase tracking-tight">Quem entende o CRO$$PROFIT governa o resultado</span>
              </p>
            </div>
            <div className="relative z-10 shrink-0">
               <button onClick={() => navigate('/solicitar-acesso')} className="bg-yellow-400 text-blue-900 px-8 py-8 rounded-full font-black text-xl flex flex-col items-center justify-center shadow-lg transform rotate-6 border-4 border-white animate-pulse hover:scale-110 transition-transform cursor-pointer">
                  <span>30 DIAS</span>
                  <span className="text-sm">PARA TESTAR</span>
               </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
      } />
    </Routes>
  );
};

export default App;
