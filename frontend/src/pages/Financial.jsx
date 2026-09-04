import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, Rocket, Lock, Shield, 
  ChevronRight, CheckCircle2, Bot, SlidersHorizontal, Share2, ArrowRight, X
} from 'lucide-react';

const Financial = () => {
  // Sliders state
  const [capital, setCapital] = useState(21000000);
  const [horizon, setHorizon] = useState(3);
  const [cagr, setCagr] = useState(0.25);
  
  // Calculated state
  const [maturity, setMaturity] = useState(41015625);
  const [roi, setRoi] = useState(95.3);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chat state
  const [isSearchGrounded, setIsSearchGrounded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'ai',
      text: 'Welcome! I am your AI Investment Advisor. Ask me anything about our software engineering pipelines, global operations hubs, or security compliance logs. Toggle on "Live Google Search Grounding" to fetch modern market reports.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSubmit = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const newUserMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setChatInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let responseText = "Our proprietary models indicate strong exponential growth for digital health architectures in the APAC region over the next 3-5 years.";
      if (isSearchGrounded) {
        responseText = "[Live Web] According to recent Q3 market reports, telehealth infrastructure investments have surged by 42%. " + responseText;
      }
      setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuery = (query) => {
    setChatInput(query);
  };

  // Growth curve standard calculation for demo
  useEffect(() => {
    const calculatedMaturity = capital * Math.pow((1 + cagr), horizon);
    const calculatedRoi = ((calculatedMaturity - capital) / capital) * 100;
    
    setMaturity(Math.round(calculatedMaturity));
    setRoi(calculatedRoi.toFixed(1));
  }, [capital, horizon, cagr]);

  // Graph point calculations
  const maxYears = 5;
  const graphWidth = 480; // 500 - 20 (padding)
  const graphHeight = 160; // 200 - 40 (padding)
  const paddingX = 10;
  const paddingYBottom = 180;

  const graphPoints = Array.from({ length: maxYears + 1 }).map((_, i) => {
    const x = paddingX + (i / maxYears) * graphWidth;
    // For visual plotting, if cagr is 0, it's a flat line. Otherwise exponential.
    const ratio = cagr === 0 ? 0 : (Math.pow(1 + cagr, i) - 1) / (Math.pow(1 + cagr, maxYears) - 1);
    const y = paddingYBottom - (ratio * graphHeight);
    return { x, y };
  });

  const generatePath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const pPrev = points[i - 1];
      const pCurr = points[i];
      const cp1x = pPrev.x + (pCurr.x - pPrev.x) / 2;
      const cp1y = pPrev.y;
      const cp2x = pPrev.x + (pCurr.x - pPrev.x) / 2;
      const cp2y = pCurr.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pCurr.x},${pCurr.y}`;
    }
    return d;
  };

  const pathD = generatePath(graphPoints);
  const activePoint = graphPoints[horizon];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 1. Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 border border-gray-100">
            <img src="/logo.png" alt="Shivani Technologies" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Accelerating <span className="text-blue-600">Digital Health Tech</span> & Enterprise Architectures
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Shivani Technologies builds scalable cloud infrastructure, custom telehealth products, Traditional Ayurveda networks, and automated hospital record ecosystems targeting an exponential global landscape.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[200px] shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Floor Valuation</p>
              <p className="text-xl font-extrabold text-gray-900">₹4.5 Billion</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[200px] shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Headquarters</p>
              <p className="text-xl font-extrabold text-gray-900">Chennai / Blr</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[200px] shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target Cap Pool</p>
              <p className="text-xl font-extrabold text-gray-900">₹750 Million</p>
            </div>
          </div>
        </div>

        {/* 2. Financial Projection Engine */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-blue-600" />
                Financial Projection Engine
              </h2>
              <p className="text-gray-500 mt-1">Map your strategic capital against our scaled business trajectories.</p>
            </div>
            <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setCagr(0.15)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${cagr === 0.15 ? 'font-bold text-blue-700 bg-white shadow-sm border border-blue-100' : 'font-medium text-gray-600 hover:bg-white hover:shadow-sm'}`}
              >
                15% Conservative
              </button>
              <button 
                onClick={() => setCagr(0.25)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${cagr === 0.25 ? 'font-bold text-blue-700 bg-white shadow-sm border border-blue-100' : 'font-medium text-gray-600 hover:bg-white hover:shadow-sm'}`}
              >
                25% Core Target
              </button>
              <button 
                onClick={() => setCagr(0.35)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${cagr === 0.35 ? 'font-bold text-blue-700 bg-white shadow-sm border border-blue-100' : 'font-medium text-gray-600 hover:bg-white hover:shadow-sm'}`}
              >
                35% High Velocity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sliders */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Investment Capital (INR)</span>
                  <span className="text-xl font-bold text-blue-600">₹{capital.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                  <span>₹5 Lakhs</span>
                  <span>₹5 Crores</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={capital}
                      onChange={(e) => setCapital(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">Apply</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Horizon Duration</span>
                  <span className="text-xl font-bold text-blue-600">{horizon} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={horizon}
                  onChange={(e) => setHorizon(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                  <span>1 Year</span>
                  <span>5 Years</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <input 
                    type="number" 
                    value={horizon}
                    onChange={(e) => setHorizon(Number(e.target.value))}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">Apply</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Maturity Value</p>
                  <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">₹{maturity.toLocaleString('en-IN')}</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Compounded Return
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Yield (ROI)</p>
                  <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">{roi}%</p>
                  <p className="text-sm font-medium text-gray-500">Total Growth</p>
                </div>
              </div>
            </div>

            {/* Graph Visualization */}
            <div className="bg-gray-900 rounded-3xl p-6 relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start z-10 mb-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Growth Curve Model</p>
                  <p className="text-white font-medium">Capital appreciation path</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-400 mb-1">Trajectory Selected</p>
                  <span className="inline-block bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg text-sm font-bold">
                    {cagr * 100}% CAGR
                  </span>
                </div>
              </div>

              {/* Decorative Graph SVG */}
              <div className="flex-1 relative min-h-[200px] flex items-end mb-8 z-10">
                <svg viewBox="0 0 500 200" className="w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* Main curve */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="url(#blueGradient)" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Current point (glow) */}
                  <ellipse cx={activePoint.x} cy={activePoint.y} rx="12" ry="6" fill="#10b981" className="transition-all duration-500 ease-out" />
                  <ellipse cx={activePoint.x} cy={activePoint.y} rx="20" ry="10" fill="#10b981" opacity="0.3" className="transition-all duration-500 ease-out" />

                  {/* Start point */}
                  <ellipse cx={graphPoints[0].x} cy={graphPoints[0].y} rx="8" ry="4" fill="#3b82f6" />
                  
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-500 z-10 mb-6">
                {[0, 1, 2, 3, 4, 5].map((year) => (
                  <span key={year} className={year === horizon ? "text-blue-400 text-sm transition-all" : "transition-all"}>
                    YEAR {year}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center z-10 text-xs text-gray-400 pt-4 border-t border-gray-800">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Built on Series B metrics.
                </span>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer"
                >
                  Audit Sheet &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. AI Investment Liaison */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shivani AI™ Investment Liaison</h2>
                <p className="text-gray-500 text-sm mt-1">Ask the co-pilot about our telemetry pipelines, data encryption standards, or query live market intelligence.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-full lg:w-auto justify-between lg:justify-start">
              <span className="text-sm font-semibold text-gray-700">Live Google Search Grounding</span>
              <div 
                onClick={() => setIsSearchGrounded(!isSearchGrounded)}
                className={`w-10 h-6 rounded-full relative cursor-pointer flex-shrink-0 transition-colors ${isSearchGrounded ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isSearchGrounded ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col justify-between min-h-[300px]">
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 font-bold rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                      {msg.role === 'ai' ? 'AI' : 'You'}
                    </div>
                    <div className={`border p-5 rounded-2xl max-w-xl text-sm leading-relaxed font-medium ${
                      msg.role === 'ai' 
                        ? 'bg-gray-50 border-gray-200 text-gray-800 rounded-tl-none' 
                        : 'bg-blue-50 border-blue-100 text-blue-900 rounded-tr-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 font-bold rounded-xl flex items-center justify-center flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="relative mt-auto">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Query our scaling models or regional digital transformation timelines..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-6 py-4 rounded-2xl pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Suggested Intelligence Queries</h3>
                <div className="space-y-3">
                  <button onClick={() => handleSuggestedQuery("Series B Roadmap & Scaling Model")} className="w-full text-left bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 p-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-red-500 flex-shrink-0" /> Series B Roadmap & Scaling Model
                  </button>
                  <button onClick={() => handleSuggestedQuery("Telehealth Security & Encrypted EHRs")} className="w-full text-left bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 p-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" /> Telehealth Security & Encrypted EHRs
                  </button>
                  <button onClick={() => handleSuggestedQuery("Traditional Wellness Logistics Network")} className="w-full text-left bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 p-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Traditional Wellness Logistics Network
                  </button>
                  <button onClick={() => handleSuggestedQuery("Live Indian Health-Tech Forecasts")} className="w-full text-left bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 p-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-500 flex-shrink-0" /> Live Indian Health-Tech Forecasts
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Real-Time API Specifications</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Our platform handles asynchronous communication loops with the Gemini API to retrieve context-optimized answers without client blockades.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Strategic Capital Deployment */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">How We Deploy Your Strategic Capital</h2>
            <p className="text-gray-600 mt-2 max-w-3xl">
              Every rupee secured is directly routed into high-impact pipelines designed to maximize ecosystem value and tech architecture scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-blue-600 mb-3">45%</div>
              <h3 className="font-bold text-gray-900 mb-2">Healthcare AI & Core R&D</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Scaling HIPAA-compliant telehealth portals, secure EHR vaults, and machine-learning diagnostics frameworks.</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-auto">
                <div className="w-[45%] h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-emerald-600 mb-3">30%</div>
              <h3 className="font-bold text-gray-900 mb-2">Ayurvedic Store Logistics</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Modernizing wellness logistics chains, traditional organic inventories, and holistic consultation dashboards.</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-auto">
                <div className="w-[30%] h-full bg-emerald-600 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-indigo-600 mb-3">15%</div>
              <h3 className="font-bold text-gray-900 mb-2">Global Operations (APAC)</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Broadening operational reach, expanding engineering teams in major hubs, and solidifying legal structures.</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-auto">
                <div className="w-[15%] h-full bg-indigo-600 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-teal-600 mb-3">10%</div>
              <h3 className="font-bold text-gray-900 mb-2">Security Auditing & Scale</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Third-party infrastructure penetration tests, absolute end-to-end medical databank encryption checks, and robust DB compliance.</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-auto">
                <div className="w-[10%] h-full bg-teal-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Advanced Systems Architecture */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-10 shadow-sm flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Engineered For Scale</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Systems Built on Cutting-Edge Technology</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At Shivani Technologies, we focus on highly scalable, non-bloated codebases to ensure high performance and seamless digital health ecosystem migrations.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Full-Stack Cloud Architectures</h4>
                  <p className="text-sm text-gray-500 mt-1">AWS/GCP microservices using Node.js, Go, and high-performance WebRTC modules for secure virtual care video.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Encrypted EHR Databases</h4>
                  <p className="text-sm text-gray-500 mt-1">Robust clinical data systems running secure schema structures, automated e-prescribing queues, and compliance logs.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Traditional Wellness Warehouses</h4>
                  <p className="text-sm text-gray-500 mt-1">Proprietary logistics routing traditional Ayurveda and Siddha wellness inventory dynamically linked to patient profiles.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 lg:p-8 h-full">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">System Architecture Status</h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold">Operational</span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Service Gateway</span>
                  <span className="font-bold text-gray-900">Nginx / Cloudflare WAF</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Core Telehealth API</span>
                  <span className="font-bold text-gray-900">Go / WebRTC Signalling</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Record Data Vaults</span>
                  <span className="font-bold text-gray-900">Postgres / AES-256 Encrypted</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Ayurveda E-Store</span>
                  <span className="font-bold text-gray-900">GraphQL / Redis Caching</span>
                </div>
                <div className="flex justify-between items-center text-sm pb-8 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Compliance Audit logs</span>
                  <span className="font-bold text-gray-900">Write-Once Ledger</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    <span>Database Efficiency</span>
                    <span className="text-blue-600">94% Core Rating</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 pb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Investment FAQ Desk</h3>
          <p className="text-gray-500">Providing precise operational and systemic transparency to prospective partners.</p>
        </div>

      </div>

      {/* Unlock Investor Deck Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-gray-200 shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wider mb-4 border border-blue-100">
                  CONFIDENTIAL ACCESS
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Unlock Investor Deck</h2>
                <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">
                  Submit your credentials below to gain direct access to our audited sheets, compliance logs, and the complete Series B pitch slide-deck.
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Investor Name</label>
                  <input type="text" placeholder="eg., Dr. Anand Rajan" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Business Email Address</label>
                  <input type="email" placeholder="eg., anand@ventures.in" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Mobile / Contact Number</label>
                  <input type="tel" placeholder="eg., +91 98765 43210" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Investment Fund / Firm</label>
                  <input type="text" placeholder="eg., Apex Capital India (Optional)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Planned Ticket (INR)</label>
                    <input 
                      type="text" 
                      value={`₹${capital.toLocaleString('en-IN')}`}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-semibold cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Your Location</label>
                    <input type="text" placeholder="e.g., Chennai, India" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-6">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" required />
                  <label htmlFor="terms" className="text-sm text-gray-500 leading-relaxed">
                    I agree to standard digital confidentiality terms and confirm this credential request constitutes a professional inquiry.
                  </label>
                </div>

                <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-sm">
                  Request Confidential Access
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Financial;
