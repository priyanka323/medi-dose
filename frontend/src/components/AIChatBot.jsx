// import { useState, useRef, useEffect } from 'react';
// import { api } from '../services/api';
// import { Mic, Send, Bot, User } from 'lucide-react';

// export default function AIChatBot({ patientContext, onRecommendation }) {
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: "Hi! I'm your AI medical assistant. How can I help with dosing today?" }
//   ]);
//   const [input, setInput] = useState('');
//   const [listening, setListening] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     // Initialize speech recognition
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
      
//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript);
//         setListening(false);
//       };
      
//       recognitionRef.current.onerror = () => setListening(false);
//       recognitionRef.current.onend = () => setListening(false);
//     }
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await api.aiChat(input, patientContext);
      
//       let assistantMessage = { role: 'assistant', content: response.message };
      
//       if (response.dose_recommendation) {
//         assistantMessage.dose = response.dose_recommendation;
//         if (onRecommendation) {
//           onRecommendation(response.dose_recommendation);
//         }
//       }
      
//       setMessages(prev => [...prev, assistantMessage]);
//     } catch (error) {
//       setMessages(prev => [...prev, { 
//         role: 'assistant', 
//         content: "Sorry, I'm having trouble connecting. Please try again." 
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVoiceInput = () => {
//     if (recognitionRef.current) {
//       setListening(true);
//       recognitionRef.current.start();
//     }
//   };

//   return (
//     <div className="ai-chat-container">
//       <div className="chat-header">
//         <Bot size={20} />
//         <span>AI Medical Assistant</span>
//       </div>
      
//       <div className="chat-messages">
//         {messages.map((msg, idx) => (
//           <div key={idx} className={`message ${msg.role}`}>
//             <div className="message-avatar">
//               {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
//             </div>
//             <div className="message-content">
//               <div className="message-text">{msg.content}</div>
//               {msg.dose && (
//                 <div className="dose-suggestion">
//                   <strong>Recommended Dose:</strong> {msg.dose}mg
//                   <button onClick={() => onRecommendation?.(msg.dose)}>
//                     Apply
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         {loading && (
//           <div className="message assistant">
//             <div className="message-avatar">
//               <Bot size={16} />
//             </div>
//             <div className="typing-indicator">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//           placeholder="Ask me about dosing, interactions, or safety..."
//           disabled={loading}
//         />
//         <button 
//           onClick={handleVoiceInput} 
//           className={listening ? 'listening' : ''}
//           disabled={!recognitionRef.current}
//         >
//           <Mic size={18} />
//         </button>
//         <button onClick={handleSend} disabled={!input.trim() || loading}>
//           <Send size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { FiMic, FiSend, FiCpu, FiUser } from 'react-icons/fi';

export default function AIChatBot({ patientContext, onRecommendation }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI medical assistant. How can I help with dosing today?" }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.aiChat(input, patientContext);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <FiCpu size={20} />
        <span>AI Medical Assistant</span>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? <FiUser size={16} /> : <FiCpu size={16} />}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">
              <FiCpu size={16} />
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me about dosing, interactions, or safety..."
          disabled={loading}
        />
        <button 
          onClick={handleVoiceInput} 
          className={listening ? 'listening' : ''}
          disabled={!recognitionRef.current}
        >
          <FiMic size={18} />
        </button>
        <button onClick={handleSend} disabled={!input.trim() || loading}>
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}