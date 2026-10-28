import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { foodQualityAPI } from '../services/api';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  XCircle, 
  AlertCircle, 
  Check, 
  X, 
  Eye, 
  FileText, 
  Info,
  HelpCircle,
  ChevronRight,
  Sliders,
  RotateCcw
} from 'lucide-react';

export const AIFoodQualityAnalyzer = () => {
  const { selectedDonation, setSelectedDonation, showToast } = useApp();

  // If a donation was selected from NGO or Donor dashboard, load its image
  const [selectedImage, setSelectedImage] = useState(() => {
    return selectedDonation?.imageUrl || '/ai_food_match.jpg';
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBase64, setSelectedBase64] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const fileInputRef = useRef(null);

  // Update selected image if selectedDonation changes in AppContext
  useEffect(() => {
    if (selectedDonation?.imageUrl) {
      setSelectedImage(selectedDonation.imageUrl);
      setSelectedFile(null);
      setSelectedBase64(null);
      setAnalysisResult(null);
      setErrorMessage(null);
    }
  }, [selectedDonation]);

  // Test Visual Presets (No simulated or hardcoded scores; each sends its image to the real Gemini API)
  const sampleFoods = [
    {
      name: "Fresh Toasted Chapati",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      description: "Normal cooking toasting marks"
    },
    {
      name: "Spoiled / Moldy Bread",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      description: "Visible fungal mold colonies"
    },
    {
      name: "Cooked Banquet Buffet",
      image: "/ai_food_match.jpg",
      description: "Hot catered surplus food tray"
    },
    {
      name: "Farm Harvest Greens",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80",
      description: "Raw crisp leafy produce"
    }
  ];

  // Handle local image file upload & convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file type. Please upload a JPEG, PNG, or WebP image.');
      setErrorCode('UNSUPPORTED_TYPE');
      return;
    }

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file exceeds the 10 MB limit. Please select a smaller photo.');
      setErrorCode('FILE_TOO_LARGE');
      return;
    }

    setSelectedFile(file);
    setAnalysisResult(null);
    setErrorMessage(null);
    setErrorCode(null);

    // Read file as base64 to ensure reliable, zero-boundary transmission and preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result;
      setSelectedBase64(b64);
      setSelectedImage(b64);
    };
    reader.onerror = () => {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini Vision API analysis
  const executeAnalysis = async (imageUrlOverride = null) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setErrorCode(null);

    try {
      let payload;
      // Case 1: Fresh base64 from user-uploaded file
      if (!imageUrlOverride && selectedBase64) {
        payload = {
          imageBase64: selectedBase64,
          donationId: selectedDonation?.id || undefined,
          foodCategory: selectedDonation?.foodType || selectedDonation?.category || undefined
        };
      }
      // Case 2: Data URI image or remote URL
      else {
        const targetUrl = imageUrlOverride || selectedImage;
        if (targetUrl?.startsWith('data:image/')) {
          payload = {
            imageBase64: targetUrl,
            donationId: selectedDonation?.id || undefined,
            foodCategory: selectedDonation?.foodType || selectedDonation?.category || undefined
          };
        } else {
          payload = {
            imageUrl: targetUrl,
            donationId: selectedDonation?.id || undefined,
            foodCategory: selectedDonation?.foodType || selectedDonation?.category || undefined
          };
        }
      }

      const response = await foodQualityAPI.analyze(payload);
      const data = response?.data?.data;
      if (!data) {
        throw new Error('Received incomplete response payload from analyzer backend.');
      }

      setAnalysisResult(data);
      if (showToast) {
        showToast('Gemini Vision visual food quality analysis complete!', 'success');
      }
    } catch (err) {
      console.error('[AIFoodQualityAnalyzer] Analysis error:', err);
      const backendError = err.response?.data?.message || err.response?.data?.error || err.message;
      const code = err.response?.data?.code || err.code;

      setErrorCode(code);
      if (code === 'GEMINI_KEY_MISSING' || backendError?.includes('GEMINI_API_KEY')) {
        setErrorMessage(
          'GEMINI_API_KEY is not configured on the server. Please add your Google Gemini API key to backend/.env (e.g. GEMINI_API_KEY="AIzaSy...") and restart the server.'
        );
      } else if (code === 'RATE_LIMITED' || err.response?.status === 429) {
        setErrorMessage('Google Gemini API rate limit reached. Please wait a moment before re-analyzing.');
      } else {
        setErrorMessage(backendError || 'Failed to analyze food image with Gemini Vision API.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper for preset selection: loads the preset image and runs real analysis
  const handleSelectPreset = (preset) => {
    setSelectedImage(preset.image);
    setSelectedFile(null);
    setSelectedBase64(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setErrorCode(null);
    executeAnalysis(preset.image);
  };

  // Determine styling based on recommendation status
  const getRecommendationStyle = (recommendation) => {
    switch (recommendation) {
      case 'no_obvious_visual_concerns':
        return {
          bannerBg: 'bg-[#F0F8EC]',
          bannerBorder: 'border-[#63A644]/30',
          textColor: 'text-[#63A644]',
          icon: <CheckCircle2 className="w-6 h-6 text-[#63A644]" />
        };
      case 'visual_concerns_detected':
        return {
          bannerBg: 'bg-red-50',
          bannerBorder: 'border-red-200',
          textColor: 'text-red-600',
          icon: <XCircle className="w-6 h-6 text-red-500" />
        };
      case 'review_required':
      default:
        return {
          bannerBg: 'bg-amber-50',
          bannerBorder: 'border-amber-200',
          textColor: 'text-amber-700',
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />
        };
    }
  };

  const recStyle = analysisResult ? getRecommendationStyle(analysisResult.recommendation) : null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#1D52F2]" />
            <span>Google Gemini Vision API • Visual Quality Audit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">AI Visual Food Quality Analyzer</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Inspects uploaded food images for visible mold, discoloration, dryness, charring vs. normal toasting, contamination, and packaging condition using the official Gemini Vision model.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1D52F2]" />
            <span>Visual Inspection • Human Review Mandatory</span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">Optical Surface Analysis (Non-Laboratory)</span>
        </div>
      </div>

      {/* Linked Donation Context (If launched from NGO/Donor Dashboard) */}
      {selectedDonation && (
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#1D52F2]/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-[#EBF1FE] text-[#1D52F2] font-bold text-[11px]">
              Active Donation
            </span>
            <span className="font-extrabold text-slate-900">{selectedDonation.foodName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">ID: {selectedDonation.id}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Category: {selectedDonation.category || selectedDonation.foodType}</span>
          </div>
          <button 
            onClick={() => setSelectedDonation(null)}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            Clear Donation Context
          </button>
        </div>
      )}

      {/* Main Grid: 5 cols Left (Image & Upload), 7 cols Right (Analysis Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Telemetry, Upload & Presets */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Inspection Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-sm h-64 sm:h-72 flex items-center justify-center">
            
            <img 
              src={selectedImage} 
              alt="Food Inspection Target" 
              className={`w-full h-full object-cover transition-opacity duration-300 ${isAnalyzing ? 'opacity-40' : 'opacity-100'}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
              }}
            />

            {/* Scanning Animation */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-[#1D52F2]/25 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-20 p-4 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest animate-pulse">
                    Gemini Vision Processing...
                  </p>
                  <p className="text-[11px] text-white/80 mt-1">
                    Inspecting fungal patterns, toasting marks & surface integrity
                  </p>
                </div>
              </div>
            )}

            {/* AI Reticle Corner Accents */}
            {!isAnalyzing && (
              <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <span className="w-3 h-3 border-t-2 border-l-2 border-[#1D52F2]"></span>
                  <span className="w-3 h-3 border-t-2 border-r-2 border-[#1D52F2]"></span>
                </div>
                <div className="flex justify-between">
                  <span className="w-3 h-3 border-b-2 border-l-2 border-[#1D52F2]"></span>
                  <span className="w-3 h-3 border-b-2 border-r-2 border-[#1D52F2]"></span>
                </div>
              </div>
            )}

            {/* Bottom Overlay Controls */}
            <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-white/95 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between backdrop-blur-md shadow-xs">
              <span className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                <Camera className="w-3.5 h-3.5 text-[#1D52F2]" />
                <span>{selectedFile ? selectedFile.name.substring(0, 20) : 'Visual Target'}</span>
              </span>
              <label className="text-[11px] text-[#1D52F2] font-black underline cursor-pointer hover:text-[#133BB5] flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload New Image</span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            </div>

          </div>

          {/* Action Trigger Button */}
          <div>
            <button
              onClick={() => executeAnalysis()}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
                isAnalyzing 
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed' 
                  : 'bg-[#1D52F2] hover:bg-[#133BB5] text-white shadow-[#1D52F2]/25 hover:scale-[1.01]'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing with Gemini Vision...' : 'Analyze Food Quality'}</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Powered by official Google Gemini Vision API • Evaluates observable optical evidence
            </p>
          </div>

          {/* Test Visual Presets (Real Gemini Pipeline) */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Test Image Presets:</p>
              <span className="text-[10px] text-slate-400">Routes to real Gemini API</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {sampleFoods.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(s)}
                  disabled={isAnalyzing}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1D52F2] bg-[#F8FAFC] hover:bg-white text-left transition-all group cursor-pointer disabled:opacity-50"
                >
                  <img src={s.image} alt={s.name} className="w-full h-14 object-cover rounded-lg mb-1.5" />
                  <p className="text-[11px] font-black text-slate-900 truncate group-hover:text-[#1D52F2]">{s.name}</p>
                  <p className="text-[9px] text-slate-500 truncate">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 space-y-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-900">Analysis Error</h4>
                  <p className="text-xs leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => executeAnalysis()}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Analysis</span>
                </button>
              </div>
            </div>
          )}

          {/* Initial State / Awaiting Inspection */}
          {!analysisResult && !isAnalyzing && !errorMessage && (
            <div className="p-8 rounded-3xl border border-dashed border-slate-300 bg-[#F8FAFC] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2] mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900">Ready for Visual Quality Analysis</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload a photo of surplus food or select one of the test presets, then click <strong>"Analyze Food Quality"</strong> to run real-time visual assessment via Google Gemini.
                </p>
              </div>
              <button
                onClick={() => executeAnalysis()}
                className="px-6 py-3 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/25 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Gemini Inspection Now</span>
              </button>
            </div>
          )}

          {/* Analyzing Loading Skeleton */}
          {isAnalyzing && (
            <div className="p-8 rounded-3xl border border-slate-200 bg-white space-y-6 animate-pulse">
              <div className="h-16 bg-slate-100 rounded-2xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-100 rounded-2xl"></div>
                <div className="h-24 bg-slate-100 rounded-2xl"></div>
              </div>
              <div className="h-40 bg-slate-100 rounded-2xl"></div>
            </div>
          )}

          {/* Live Analysis Output Results */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              
              {/* Status & Recommendation Banner */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-xs transition-all ${recStyle.bannerBg} ${recStyle.bannerBorder}`}>
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-white shadow-xs">
                    {recStyle.icon}
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-black tracking-wider ${recStyle.textColor}`}>
                      Donation Recommendation
                    </p>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {analysisResult.recommendationTitle || analysisResult.recommendation}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => executeAnalysis()}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer shadow-xs transition-colors shrink-0"
                  title="Re-analyze Image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Metric Cards: Visual Quality Score & Confidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Visual Quality Score */}
                <div className={`p-5 rounded-2xl border text-center space-y-1 bg-[#F8FAFC] ${recStyle.bannerBorder}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Visual Quality Score</span>
                  <div className={`text-4xl font-black font-heading ${recStyle.textColor}`}>
                    {analysisResult.qualityScore !== null ? `${analysisResult.qualityScore}%` : 'N/A'}
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">{analysisResult.ratingTier}</p>
                </div>

                {/* AI Confidence Level */}
                <div className="p-5 rounded-2xl border border-slate-200 text-center space-y-1 bg-[#F8FAFC]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assessment Confidence</span>
                  <div className="text-4xl font-black text-slate-900 font-heading capitalize">
                    {analysisResult.assessmentConfidence}
                  </div>
                  <p className="text-[11px] font-bold text-[#1D52F2]">Optical Evidence Reliability</p>
                </div>

              </div>

              {/* Food Identified & Overall Condition */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Food Identification</span>
                  <span className="text-[10px] font-bold text-[#1D52F2] bg-[#EBF1FE] px-2 py-0.5 rounded">
                    Category: {analysisResult.foodCategory || 'Prepared Food'}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {analysisResult.foodIdentified || 'Food Item'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysisResult.overallCondition}
                </p>
              </div>

              {/* Detected Visual Findings Grid */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#1D52F2]" />
                    <span>Visual Indicator Audit Findings</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">8 Optical Checks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {analysisResult.findings?.map((f, idx) => {
                    const isObservedConcern = f.status === 'observed' && f.isConcern;
                    const isObservedNormal = f.status === 'observed' && !f.isConcern;
                    const isNotObserved = f.status === 'not_observed';
                    const isUncertain = f.status === 'uncertain';

                    let cardClass = 'bg-[#F0F8EC] border-[#63A644]/20 text-slate-800';
                    let IconComponent = <Check className="w-4 h-4 text-[#63A644] shrink-0" />;

                    if (isObservedConcern) {
                      cardClass = 'bg-red-50 border-red-200 text-red-900';
                      IconComponent = <X className="w-4 h-4 text-red-500 shrink-0" />;
                    } else if (isUncertain) {
                      cardClass = 'bg-amber-50 border-amber-200 text-amber-900';
                      IconComponent = <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />;
                    } else if (isObservedNormal) {
                      cardClass = 'bg-[#EBF1FE] border-[#1D52F2]/20 text-slate-800';
                      IconComponent = <Info className="w-4 h-4 text-[#1D52F2] shrink-0" />;
                    }

                    return (
                      <div key={idx} className={`p-3 rounded-xl border flex items-start gap-2.5 ${cardClass}`}>
                        <div className="mt-0.5">{IconComponent}</div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-black uppercase tracking-wider opacity-75">{f.category}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/70 border border-black/5 capitalize">
                              {f.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="font-semibold text-[11px] leading-snug">{f.explanation}</p>
                          {f.pointsDeducted > 0 && (
                            <span className="text-[9px] font-bold text-red-600 block">
                              -{f.pointsDeducted} pts applied in rubric
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score Deductions Rubric Breakdown */}
              {analysisResult.scoreBreakdown && (
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#1D52F2]" />
                    <span>Transparent Scoring Rubric Breakdown</span>
                  </h4>
                  <div className="flex items-center justify-between text-slate-600 font-semibold border-b border-slate-200 pb-1.5 text-[11px]">
                    <span>Baseline Score</span>
                    <span>100 pts</span>
                  </div>
                  {analysisResult.scoreBreakdown.deductions?.length > 0 ? (
                    <div className="space-y-1">
                      {analysisResult.scoreBreakdown.deductions.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-red-600 text-[11px]">
                          <span>• {d.reason}</span>
                          <span className="font-bold">-{d.points} pts</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#63A644] font-bold">
                      Zero defect deductions applied. All surface indicators conform to baseline standard.
                    </p>
                  )}
                  <div className="flex items-center justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 text-xs">
                    <span>Final Visual Quality Score</span>
                    <span className={recStyle.textColor}>
                      {analysisResult.qualityScore !== null ? `${analysisResult.qualityScore}/100` : 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              {/* Limitations & Mandatory Safety Disclaimer */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Important Scope & Safety Limitations</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {analysisResult.limitations}
                </p>
                <p className="text-[10px] text-slate-400 italic border-t border-slate-200 pt-2 leading-relaxed">
                  {analysisResult.disclaimer}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
