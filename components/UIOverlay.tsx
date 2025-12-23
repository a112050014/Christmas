
import React, { useState } from 'react';
import { Send, User, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  onSendWish: (name: string, text: string) => void;
  isSending?: boolean;
}

const UIOverlay: React.FC<Props> = ({ 
  onSendWish,
  isSending = false
}) => {
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wishText.trim() && name.trim() && !isSending) {
      onSendWish(name.trim(), wishText.trim());
      setWishText('');
      
      // 顯示短暫的成功勾選
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-serif italic text-pink-300 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]">
            Merry Christmas
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200 opacity-60 mt-2">
            The Eternal Energy Tree
          </p>
        </div>
      </div>

      {/* Footer - Wishing Input */}
      <div className="flex flex-col items-center gap-6">
        <div className="text-center h-4">
          {showSuccess && (
            <div className="flex items-center gap-2 text-green-400 animate-bounce">
              <CheckCircle2 size={14} />
              <span className="text-[10px] uppercase tracking-widest">Wish Recorded on Cloud</span>
            </div>
          )}
          {!showSuccess && (
            <p className="text-[10px] uppercase tracking-[0.5em] text-pink-100/40">
              Scroll to explore • Zoom to enter
            </p>
          )}
        </div>

        <form 
          onSubmit={handleSubmit}
          className="pointer-events-auto relative w-full max-w-md flex flex-col gap-2 group"
        >
          {/* Name Input */}
          <div className="relative">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              disabled={isSending}
              className="w-full bg-white/5 border-b border-white/10 focus:border-pink-400 focus:bg-white/10 transition-all outline-none py-2 px-6 text-xs tracking-widest placeholder:text-white/20 backdrop-blur-md rounded-t-lg disabled:opacity-50"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
              <User size={12} />
            </div>
          </div>

          {/* Message Input */}
          <div className="relative">
            <input 
              type="text"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder={isSending ? "Syncing with Spreadsheet..." : "Write your blessing..."}
              required
              disabled={isSending}
              className="w-full bg-white/5 border-b border-white/20 focus:border-pink-400 focus:bg-white/10 transition-all outline-none py-4 px-6 pr-20 text-sm tracking-widest placeholder:text-white/20 backdrop-blur-md disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!wishText.trim() || !name.trim() || isSending}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-300 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {isSending ? 'Sending' : 'Send'}
                </span>
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </div>
            </button>
          </div>
        </form>

        <div className="flex justify-between w-full max-w-2xl opacity-40 text-[9px] uppercase tracking-widest">
          <span>Backend Connected: GAS</span>
          <div className="flex gap-4">
            <span>Particle Count: 60K</span>
            <span>Cloud Sync: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
