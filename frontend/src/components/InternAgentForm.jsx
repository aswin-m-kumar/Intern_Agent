import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const InternAgentForm = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'text'
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [optionalUrl, setOptionalUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    const payload = inputMode === 'url' ? { url } : { raw_text: rawText, url: optionalUrl };

    try {
      // Determine API Base URL dynamically or via VITE_API_URL environment variable
      const API_BASE = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL 
        : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://127.0.0.1:5000' 
            : 'https://intern-agent.onrender.com'); // Placeholder for user's actual Render URL if they don't use env vars
            
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        // Parse the results based on predefined "===SPLIT===" sent by backend
        const parts = data.content.split('===SPLIT===');
        setResults({
          poster: parts[0]?.trim() || "No poster content available.",
          whatsapp: parts[1]?.trim() || "No WhatsApp caption available.",
          qrLink: inputMode === 'url' ? url : optionalUrl
        });
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-2xl flex-col px-6 pb-10 pt-7 text-slate-100 sm:px-8">
      <header className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-[#d6fff7] via-[#acfbff] to-[#f7ffff] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          InternAgent
        </h1>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">
          Automated Communications Engine
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          {['home', 'about', 'updates'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-300 ${
                activeTab === tab 
                ? 'bg-white/22 shadow-[0_0_18px_rgba(186,255,247,0.35)] text-white' 
                : 'text-white/65 hover:bg-white/12 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'home' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 h-full max-h-[60vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="mx-auto flex max-w-[240px] self-center justify-center rounded-xl border border-white/25 bg-[#032a2d]/70 p-1 shadow-[0_10px_25px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <label className="flex-1 text-center cursor-pointer pb-2 pt-2 relative">
                <input 
                  type="radio" 
                  name="inputMode" 
                  className="hidden" 
                  checked={inputMode === 'url'} 
                  onChange={() => { setInputMode('url'); setResults(null); }} 
                />
                <span className={`text-sm font-semibold transition-colors ${inputMode === 'url' ? 'text-[#8bfff0]' : 'text-white/55'}`}>Scrape URL</span>
                {inputMode === 'url' && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-[#8bfff0] shadow-[0_0_10px_#8bfff0]" />
                )}
              </label>
              <label className="flex-1 text-center cursor-pointer pb-2 pt-2 relative">
                <input 
                  type="radio" 
                  name="inputMode" 
                  className="hidden" 
                  checked={inputMode === 'text'} 
                  onChange={() => { setInputMode('text'); setResults(null); }} 
                />
                <span className={`text-sm font-semibold transition-colors ${inputMode === 'text' ? 'text-[#ffd4a3]' : 'text-white/55'}`}>Paste Text</span>
                {inputMode === 'text' && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-[#ffd4a3] shadow-[0_0_10px_#ffd4a3]" />
                )}
              </label>
            </div>

            {inputMode === 'url' ? (
              <div className="group">
                <label className="mb-2 block px-1 text-xs font-semibold uppercase tracking-wider text-[#b8fff5]">Target URL</label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/internship" 
                  required 
                  className="w-full rounded-xl border border-white/25 bg-[#041e24]/72 px-4 py-3 text-white placeholder-white/45 backdrop-blur-md transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#8bfff0]"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="group">
                  <label className="mb-2 block px-1 text-xs font-semibold uppercase tracking-wider text-[#ffd8ab]">Raw Internship Content</label>
                  <textarea 
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste all internship details, eligibility, rules, and information here..." 
                    rows="5"
                    required
                    className="w-full resize-y rounded-xl border border-white/25 bg-[#041e24]/72 px-4 py-3 text-white placeholder-white/45 backdrop-blur-md transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ffd8ab]"
                  />
                </div>
                <div className="group">
                   <label className="mb-2 block px-1 text-xs font-semibold uppercase tracking-wider text-white/80">Application URL (Optional)</label>
                   <input 
                    type="url" 
                    value={optionalUrl}
                    onChange={(e) => setOptionalUrl(e.target.value)}
                    placeholder="https://..." 
                    className="w-full rounded-xl border border-white/25 bg-[#041e24]/72 px-4 py-3 text-white placeholder-white/45 backdrop-blur-md transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9dc3ff]"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full relative group overflow-hidden rounded-xl font-bold text-white transition-all duration-300 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#66d7cb] via-[#4cb7de] to-[#f3a66f] opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-[1px] rounded-xl bg-[#062028]/76 backdrop-blur-sm" />
              <div className="relative py-4 flex items-center justify-center space-x-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Synthesizing Data...</span>
                  </>
                ) : (
                  <span>Compile Communications</span>
                )}
              </div>
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm backdrop-blur-md">
              <span className="font-bold mr-2">!</span> {error}
            </div>
          )}

          {results && (
            <div className="mt-8 space-y-6">
              
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-lg group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#73bfc4] flex items-center"><span className="mr-2">🖼️</span> Poster Content</h3>
                  <button onClick={() => handleCopy(results.poster)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">Copy</button>
                </div>
                <pre className="text-sm font-mono whitespace-pre-wrap text-white/80 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 focus-within:border-[#73bfc4]/50 overflow-x-auto">
                  {results.poster}
                </pre>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-lg group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#ff810a] flex items-center"><span className="mr-2">💬</span> WhatsApp Caption</h3>
                  <button onClick={() => handleCopy(results.whatsapp)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">Copy</button>
                </div>
                <pre className="text-sm font-mono whitespace-pre-wrap text-white/80 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 focus-within:border-[#ff810a]/50 overflow-x-auto">
                  {results.whatsapp}
                </pre>
              </div>

              {results.qrLink && (
                 <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-[#8da0ce]/30 rounded-2xl backdrop-blur-lg shadow-[0_0_30px_rgba(141,160,206,0.1)]">
                   <h3 className="text-sm font-semibold mb-6 flex items-center text-[#8da0ce]"><span className="mr-2">🔗</span> Link QR Code</h3>
                   <div className="p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                     <QRCodeSVG value={results.qrLink} size={160} />
                   </div>
                 </div>
              )}

            </div>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="flex-1 overflow-y-auto text-white/80 p-4">
          <h2 className="text-2xl font-bold mb-4 text-[#73bfc4]">About InternAgent</h2>
          <p className="mb-4 text-sm leading-relaxed">InternAgent is an advanced AI-powered platform designed to extract and synthesize internship opportunities from any valid URL or raw content block.</p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-center hover:border-[#73bfc4]/50 transition-colors">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-bold text-white mb-1">Fast Parsing</h4>
              <p className="text-xs text-white/60">Bypasses complex sites instantly.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-center hover:border-[#ff810a]/50 transition-colors">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-bold text-white mb-1">AI Powered</h4>
              <p className="text-xs text-white/60">Uses Meta Llama 70B for synthesis.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="flex-1 overflow-y-auto text-white/80 p-4">
          <h2 className="text-2xl font-bold mb-6 text-[#ff810a]">Agent Roadmap</h2>
          <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#8da0ce] before:to-transparent">
             <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/50 bg-[#8da0ce] group-[.is-active]:bg-[#73bfc4] text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                 <span className="text-xs font-bold">1</span>
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-[#73bfc4]/50 bg-black/40 shadow">
                 <div className="flex items-center justify-between space-x-2 mb-1">
                   <div className="font-bold text-[#73bfc4]">LinkedIn Post Automation</div>
                 </div>
                 <div className="text-xs text-white/60">In planning phase for Q3 2026.</div>
               </div>
             </li>
             <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/50 bg-[#8da0ce] text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                 <span className="text-xs font-bold">2</span>
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-white/20 bg-black/40 shadow">
                 <div className="flex items-center justify-between space-x-2 mb-1">
                   <div className="font-bold text-white/80">PDF Exports</div>
                 </div>
                 <div className="text-xs text-white/60">Convert posters straight to PDF.</div>
               </div>
             </li>
          </ul>
        </div>
      )}

    </div>
  );
};
