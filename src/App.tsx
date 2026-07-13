import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scan, Shield, CheckCircle, AlertTriangle, AlertCircle, Sparkles, BookOpen, 
  HelpCircle, ChevronDown, Check, ArrowRight, Smartphone, Copy, Download, 
  RefreshCw, Menu, X, Heart, Database, Users, TrendingUp, Info, Activity, ShieldAlert,
  History, Camera, Upload, Zap, Mic, MicOff, Volume2, VolumeX, Send
} from "lucide-react";

// Types for the safety report
interface IngredientAnalysis {
  name: string;
  status: "SAFE" | "CAUTION" | "AVOID";
  description: string;
  alternatives?: string;
}

interface SafetyReport {
  productName: string;
  verdict: "SAFE" | "CAUTION" | "AVOID";
  pregnancySafety: string;
  breastfeedingSafety: string;
  overallScore: number;
  reasoningSummary: string;
  ingredientsAnalyzed: IngredientAnalysis[];
  recommendationText: string;
}

// Preset products for scanner demo
const PRODUCT_PRESETS = [
  {
    name: "Regenerate Retinol Night Cream",
    category: "Skincare",
    ingredients: "Water, Retinol (Vitamin A), Glyceryl Stearate, Glycerin, Stearic Acid, Sodium Hyaluronate, Phenoxyethanol, Fragrance",
    description: "A popular anti-aging moisturizer designed to smooth fine lines overnight."
  },
  {
    name: "Clarifying Acne Wash",
    category: "Skincare",
    ingredients: "Water, Cocamidopropyl Betaine, Salicylic Acid 2%, Glycerin, Lactic Acid, Aloe Barbadensis Leaf Juice, Phenoxyethanol",
    description: "An over-the-counter cleanser targeting blemishes and oily skin."
  },
  {
    name: "SafeShield Mineral Sunscreen",
    category: "Skincare",
    ingredients: "Zinc Oxide 20%, Titanium Dioxide 5%, Water, Organic Coconut Oil, Shea Butter, Tocopherol (Vitamin E), Sunflower Seed Oil",
    description: "A physical sunscreen providing broad spectrum SPF 50 protection."
  },
  {
    name: "Tension Headache Relief",
    category: "Medication",
    ingredients: "Acetaminophen 500mg, Caffeine 65mg, Microcrystalline Cellulose, Stearic Acid, Corn Starch, Croscarmellose Sodium",
    description: "An over-the-counter pain reliever for quick headache relief."
  },
  {
    name: "Active Care Ibuprofen 200mg",
    category: "Medication",
    ingredients: "Ibuprofen 200mg, Carnauba Wax, Colloidal Silicon Dioxide, Croscarmellose Sodium, Hypromellose, Stearic Acid",
    description: "A non-steroidal anti-inflammatory drug (NSAID) for muscle aches and fever."
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "blueprint">("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Scanner states
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [customName, setCustomName] = useState("");
  const [customIngredients, setCustomIngredients] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [scanMode, setScanMode] = useState<"presets" | "custom" | "camera">("presets");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState("");
  const [scanResult, setScanResult] = useState<SafetyReport | null>(null);
  const [scanHasRun, setScanHasRun] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{ productName: string; ingredients: string; category: string }>>([
    { productName: "Regenerate Retinol Night Cream", ingredients: "Water, Retinol (Vitamin A), Glyceryl Stearate, Glycerin, Stearic Acid, Sodium Hyaluronate, Phenoxyethanol, Fragrance", category: "Skincare" },
    { productName: "Clarifying Acne Wash", ingredients: "Water, Cocamidopropyl Betaine, Salicylic Acid 2%, Glycerin, Lactic Acid, Aloe Barbadensis Leaf Juice, Phenoxyethanol", category: "Skincare" },
    { productName: "SafeShield Mineral Sunscreen", ingredients: "Zinc Oxide 20%, Titanium Dioxide 5%, Water, Organic Coconut Oil, Shea Butter, Tocopherol (Vitamin E), Sunflower Seed Oil", category: "Skincare" }
  ]);

  // Bottom navigation state inside the simulated phone
  const [activePhoneTab, setActivePhoneTab] = useState<"dashboard" | "scanner" | "history" | "journal" | "saved">("dashboard");

  // Saved Safe Products state
  const [savedProducts, setSavedProducts] = useState<Array<{ productName: string; verdict: "SAFE" | "CAUTION" | "AVOID"; overallScore: number; date: string }>>([
    { productName: "SafeShield Mineral Sunscreen", verdict: "SAFE", overallScore: 98, date: "July 11, 2026" },
    { productName: "Hydrating Hyaluronic Serum", verdict: "SAFE", overallScore: 95, date: "July 12, 2026" }
  ]);

  // Journal entries state
  const [journalEntries, setJournalEntries] = useState<Array<{ id: number; date: string; trimester: string; mood: string; content: string }>>([
    {
      id: 1,
      date: "July 10, 2026",
      trimester: "1st Trimester",
      mood: "🤢 Nauseous",
      content: "Woke up feeling extremely nauseous. Double checked my daily facial wash; it has salicylic acid (2%), which might be a concern. Need to scan it using Expecta to be 100% sure and find safe alternatives."
    },
    {
      id: 2,
      date: "July 12, 2026",
      trimester: "1st Trimester",
      mood: "😊 Relieved",
      content: "Switched to a glycolic acid cleanser today! Did a toxicological scan and got a SAFE green badge. Feel much more confident about my morning routine now."
    }
  ]);

  const [newEntryText, setNewEntryText] = useState("");
  const [newEntryMood, setNewEntryMood] = useState("😊 Happy");

  // Voice Assistant state variables
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<Array<{ sender: "user" | "ava"; text: string; time: string }>>([
    { sender: "ava", text: "Hello mama! I'm Ava, your virtual clinical voice companion. Ask me any ingredient, nutrition, or pregnancy safety questions, and I'll read my answers aloud to you!", time: "Just now" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isAvaSpeaking, setIsAvaSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [assistantStatus, setAssistantStatus] = useState<string>("Idle");
  const [voiceInput, setVoiceInput] = useState("");
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  
  // Advanced enhancements states
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voicePitch, setVoicePitch] = useState(1.05); // Default: Warm/reassuring
  const [voiceRate, setVoiceRate] = useState(0.95);  // Default: Calm/deliberate
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [suggestionCategory, setSuggestionCategory] = useState<"skin" | "diet" | "care">("skin");
  const [savedMessageIndices, setSavedMessageIndices] = useState<Record<number, boolean>>({});

  const recognitionRef = React.useRef<any>(null);
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  // Speech Recognition API Support
  const SpeechRecognition = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

  // Save Ava safety recommendations to the journal
  const saveAvaRecommendationToJournal = (text: string, msgIndex: number) => {
    const trimesterLabel = maternityStage === "1st" ? "1st Trimester" : maternityStage === "2nd" ? "2nd Trimester" : maternityStage === "3rd" ? "3rd Trimester" : "Nursing Phase";
    const d = new Date();
    const dateStr = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const newId = journalEntries.length > 0 ? Math.max(...journalEntries.map(e => e.id)) + 1 : 1;
    
    const newEntry = {
      id: newId,
      date: dateStr,
      trimester: trimesterLabel,
      mood: "💡 Safe Advice",
      content: `Ava Safety Tip: "${text}"`
    };

    setJournalEntries(prev => [newEntry, ...prev]);
    setSavedMessageIndices(prev => ({ ...prev, [msgIndex]: true }));
    
    // Temporarily announce in status bar
    const oldStatus = assistantStatus;
    setAssistantStatus("Added to Maternal Journal! 📓");
    setTimeout(() => {
      setAssistantStatus(oldStatus);
    }, 2000);
  };

  // Speak the response using browser's SpeechSynthesis API
  const speakResponse = (text: string) => {
    if (isVoiceMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a friendly US female/English voice
      const preferredVoice = voices.find(
        v => v.lang.startsWith("en-US") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Zira"))
      ) || voices.find(v => v.lang.startsWith("en"));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = voiceRate; // Customizable reassuring speed
      utterance.pitch = voicePitch; // Customizable compassionate pitch

      utterance.onstart = () => {
        setIsAvaSpeaking(true);
        setAssistantStatus("Ava is speaking...");
      };

      utterance.onend = () => {
        setIsAvaSpeaking(false);
        setAssistantStatus("Idle");
      };

      utterance.onerror = () => {
        setIsAvaSpeaking(false);
        setAssistantStatus("Idle");
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
      setIsAvaSpeaking(false);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      setAssistantStatus("Speech recognition not supported in browser.");
      return;
    }

    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsAvaSpeaking(false);
      setInterimTranscript("");

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = true; // Enabled interim feedback
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setAssistantStatus("Listening... Speak now!");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error event:", event);
        setIsListening(false);
        setAssistantStatus("Speech error: " + (event.error || "failed") + ". Try typing!");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.onresult = (event: any) => {
        let interimText = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        if (interimText) {
          setInterimTranscript(interimText);
        }

        if (finalTranscript.trim()) {
          setInterimTranscript("");
          handleSendVoiceMessage(finalTranscript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setAssistantStatus("Mic blocked. Please type!");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setIsListening(false);
      setInterimTranscript("");
      setAssistantStatus("Stopped listening.");
    }
  };

  const handleSendVoiceMessage = async (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;

    const d = new Date();
    const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user" as const, text: textToSubmit, time: timeStr };
    
    setVoiceMessages((prev) => [...prev, userMsg]);
    setVoiceInput("");
    setIsVoiceLoading(true);
    setAssistantStatus("Ava is thinking...");

    if (isListening) {
      stopListening();
    }

    try {
      const historyPayload = voiceMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const response = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSubmit,
          stage: maternityStage,
          history: historyPayload
        })
      });

      const data = await response.json();
      const avaText = data.text || "I'm sorry, I couldn't process that. Please try again, mama.";

      const avaMsg = { sender: "ava" as const, text: avaText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setVoiceMessages((prev) => [...prev, avaMsg]);
      setAssistantStatus("Idle");

      speakResponse(avaText);
    } catch (err) {
      console.error("Voice assistant API error:", err);
      const fallbackText = "I encountered a minor network error. Please try again shortly, mama!";
      const avaMsg = { sender: "ava" as const, text: fallbackText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setVoiceMessages((prev) => [...prev, avaMsg]);
      setAssistantStatus("Idle");
      speakResponse(fallbackText);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  // Stop speech/recording on close
  React.useEffect(() => {
    if (!isVoiceAssistantOpen) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsAvaSpeaking(false);
      if (isListening) {
        stopListening();
      }
    }
  }, [isVoiceAssistantOpen]);

  // Auto scroll voice messages
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [voiceMessages, isVoiceLoading]);

  // Camera capture states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Trigger camera stream
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    setIsTorchOn(false);
    setIsTorchSupported(false);
    try {
      // Ask for high-definition back-facing camera stream to maximize OCR text legibility
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        } 
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      // Check if camera has flash/torch capability
      const track = stream.getVideoTracks()[0];
      if (track && typeof track.getCapabilities === "function") {
        try {
          const capabilities = track.getCapabilities() as any;
          if (capabilities && "torch" in capabilities) {
            setIsTorchSupported(true);
          }
        } catch (capErr) {
          console.warn("Could not retrieve camera capabilities:", capErr);
        }
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Make sure permissions are granted, or upload a photo below.");
    }
  };

  // Close camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  };

  // Toggle flash/torch flashlight
  const toggleTorch = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && typeof track.applyConstraints === "function") {
        try {
          const targetTorchState = !isTorchOn;
          await track.applyConstraints({
            advanced: [{ torch: targetTorchState }]
          } as any);
          setIsTorchOn(targetTorchState);
        } catch (torchErr) {
          console.error("Failed to toggle flashlight:", torchErr);
        }
      }
    }
  };

  // Bind video stream to element once it is active and mounted
  React.useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  }, [isCameraActive]);

  // Clean up stream on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture frame from video feed
  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Use the actual high resolution stream dimensions
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Apply high quality smoothing context settings to optimize OCR readability
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Export at 95% JPEG quality to preserve maximum fine-grained ingredient label texture details
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  // Handle manual file attachment/upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger scanning simulation
  const runScan = async (productName: string, ingredients: string, category: string) => {
    setIsScanning(true);
    setScanResult(null);
    setScanHasRun(true);
    
    const steps = [
      "Accessing clinical scanner environment...",
      "Extracting chemical compound lists...",
      "Querying clinical databases (ACOG, LactMed)...",
      "Analyzing toxicological profiles...",
      "Compiling maternal safety report..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanStepText(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, ingredients, category }),
      });
      const data = await response.json();
      setScanResult(data);
      setRecentScans((prev) => {
        const filtered = prev.filter((item) => item.productName !== productName);
        return [{ productName, ingredients, category }, ...filtered].slice(0, 3);
      });
    } catch (e) {
      console.error("Scan API error, fallback triggered automatically.", e);
    } finally {
      setIsScanning(false);
    }
  };

  // Image-based Multimodal Scan
  const runImageScan = async (base64Image: string) => {
    setIsScanning(true);
    setScanResult(null);
    setScanHasRun(true);
    
    const steps = [
      "Analyzing captured photo content...",
      "Applying image enhancement & noise filters...",
      "Running Optical Character Recognition (OCR)...",
      "Identifying active skincare/medication ingredients...",
      "Cross-referencing with clinical databases (ACOG, LactMed)..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanStepText(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const response = await fetch("/api/scan-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image, mimeType: "image/jpeg" }),
      });
      const data = await response.json();
      setScanResult(data);
      if (data.productName) {
        setRecentScans((prev) => {
          const filtered = prev.filter((item) => item.productName !== data.productName);
          const ingredientsStr = data.ingredientsAnalyzed ? data.ingredientsAnalyzed.map((i: any) => i.name).join(", ") : "N/A";
          return [{ productName: data.productName, ingredients: ingredientsStr, category: "Scanned Label" }, ...filtered].slice(0, 3);
        });
      }
    } catch (e) {
      console.error("Scan Image API error, fallback triggered automatically.", e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRecentScanClick = (scan: { productName: string; ingredients: string; category: string }) => {
    const presetIdx = PRODUCT_PRESETS.findIndex(p => p.name === scan.productName);
    if (presetIdx !== -1) {
      setSelectedPreset(presetIdx);
      setIsCustomMode(false);
      setScanMode("presets");
      runScan(scan.productName, scan.ingredients, scan.category);
    } else if (scan.category === "Scanned Label") {
      setScanMode("camera");
      // Re-trigger scan from cache/preset text
      runScan(scan.productName, scan.ingredients, scan.category);
    } else {
      setIsCustomMode(true);
      setScanMode("custom");
      setCustomName(scan.productName);
      setCustomIngredients(scan.ingredients);
      runScan(scan.productName, scan.ingredients, scan.category);
    }
  };

  const handlePresetScan = (index: number) => {
    setSelectedPreset(index);
    setIsCustomMode(false);
    setScanMode("presets");
    const preset = PRODUCT_PRESETS[index];
    runScan(preset.name, preset.ingredients, preset.category);
  };

  const handleCustomScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customIngredients.trim()) return;
    setScanMode("custom");
    runScan(customName, customIngredients, "Custom Product");
  };

  // interactive profile state
  const [maternityStage, setMaternityStage] = useState<"1st" | "2nd" | "3rd" | "nursing">("1st");

  // Pricing state
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Copy success feedback states for Blueprint Mode
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getVerdictBadgeStyles = (verdict: string) => {
    switch (verdict) {
      case "SAFE":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          iconColor: "text-emerald-600",
          label: "🟢 Pregnancy & Nursing Safe",
          badge: "bg-emerald-500 text-white"
        };
      case "CAUTION":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          iconColor: "text-amber-600",
          label: "🟡 Exercise Caution / Consult Doctor",
          badge: "bg-amber-500 text-white"
        };
      case "AVOID":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          iconColor: "text-rose-600",
          label: "🔴 Avoid During Pregnancy",
          badge: "bg-rose-500 text-white"
        };
      default:
        return {
          bg: "bg-stone-50 border-stone-200 text-stone-800",
          iconColor: "text-stone-600",
          label: "Unknown Safety Rating",
          badge: "bg-stone-500 text-white"
        };
    }
  };

  // Helper renderers for smartphone mockup sub-screens
  const renderDashboardTab = () => {
    return (
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-left flex flex-col justify-between min-h-0">
        <div className="space-y-3.5">
          {/* Welcome message */}
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase font-bold tracking-widest text-brand-sage font-mono">My Portal</p>
            <h3 className="text-sm font-serif font-bold text-brand-terracotta flex items-center space-x-1">
              <span>Welcome, Mama</span>
              <span className="animate-pulse">🤍</span>
            </h3>
          </div>

          {/* Active maternity profile status box */}
          <div className="bg-brand-soft p-3 rounded-xl border border-brand-border/60 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-sage/5 rounded-full -mr-6 -mt-6"></div>
            <p className="text-[9px] font-mono font-bold text-[#8C8375] uppercase tracking-wider">Active Stage Info</p>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-xs font-bold text-stone-800 capitalize">
                {maternityStage === "1st" && "1st Trimester (Weeks 1-13)"}
                {maternityStage === "2nd" && "2nd Trimester (Weeks 14-27)"}
                {maternityStage === "3rd" && "3rd Trimester (Weeks 28-40)"}
                {maternityStage === "nursing" && "Maternal Nursing Phase"}
              </span>
              <Sparkles className="w-3 h-3 text-brand-sage animate-pulse shrink-0" />
            </div>
            <p className="text-[10px] text-stone-500 mt-1 leading-relaxed font-medium">
              {maternityStage === "1st" && "Weeks 1-13: Vital cellular development is happening. Avoid retinol, high-strength salicylic acid (>2%), and oxybenzone."}
              {maternityStage === "2nd" && "Weeks 14-27: Skin undergoes changes and stretch. Safely use physical mineral-based barrier sunscreens and rosehip oil."}
              {maternityStage === "3rd" && "Weeks 28-40: Maximize skin elastic protection. Opt for fragrance-free, deeply nourishing plant lipids and natural body butters."}
              {maternityStage === "nursing" && "Nursing: Compounds can translocate into skin layers or milk. Continue auditing active ingredients and skincare preservatives."}
            </p>
            <div className="mt-2 pt-2 border-t border-brand-border/40 flex items-center justify-between">
              <span className="text-[9px] text-stone-400 font-medium">Change maternity stage profile?</span>
              <a
                href="#landing"
                onClick={() => {
                  const el = document.getElementById("maternity-profile-selector");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-[9px] font-bold text-brand-sage hover:underline flex items-center space-x-0.5"
              >
                <span>Edit Stage</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Active Stats Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setActivePhoneTab("history")}
              className="bg-stone-50 hover:bg-brand-soft p-1.5 rounded-xl border border-brand-border text-center transition-all cursor-pointer"
            >
              <p className="text-xs font-serif font-bold text-brand-terracotta">{recentScans.length}</p>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Scans Run</p>
            </button>
            <button
              onClick={() => setActivePhoneTab("saved")}
              className="bg-stone-50 hover:bg-brand-soft p-1.5 rounded-xl border border-brand-border text-center transition-all cursor-pointer"
            >
              <p className="text-xs font-serif font-bold text-[#E65C5C]">{savedProducts.length}</p>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Favorites</p>
            </button>
            <button
              onClick={() => setActivePhoneTab("journal")}
              className="bg-stone-50 hover:bg-brand-soft p-1.5 rounded-xl border border-brand-border text-center transition-all cursor-pointer"
            >
              <p className="text-xs font-serif font-bold text-brand-sage">{journalEntries.length}</p>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Journal Logs</p>
            </button>
          </div>

          {/* Guidance box */}
          <div className="p-2.5 bg-[#FDFBF7] border border-brand-border/60 rounded-xl space-y-1">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center space-x-1">
              <Shield className="w-2.5 h-2.5 text-brand-sage" />
              <span>Daily Safety Reminders</span>
            </p>
            <div className="space-y-0.5 text-[10px] text-stone-600">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Check cosmetic labels before standing in queue</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Save safe products for easy pharmacy search</span>
              </div>
            </div>
          </div>

          {/* Voice Assistant Promo banner */}
          <button
            type="button"
            onClick={() => {
              setIsVoiceAssistantOpen(true);
              startListening();
            }}
            className="w-full p-2.5 bg-brand-soft border border-brand-border/40 rounded-xl text-left flex items-center justify-between hover:bg-brand-soft/80 transition-all cursor-pointer group"
          >
            <div className="space-y-0.5 max-w-[80%]">
              <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-brand-sage flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                <span>Voice Companion Beta</span>
              </p>
              <h4 className="text-[11px] font-bold text-stone-800">Talk to Ava Clinical Assistant</h4>
              <p className="text-[9px] text-stone-500 leading-normal">Have a question about skincare safety or caffeine? Tap to ask Ava!</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#E3A390] group-hover:scale-110 transition-transform flex items-center justify-center text-white shadow-sm shrink-0 ml-1">
              <Mic className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Big CTA to Scanner */}
        <button
          type="button"
          onClick={() => setActivePhoneTab("scanner")}
          className="w-full py-2 bg-brand-sage hover:bg-brand-sage/95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm cursor-pointer mt-1"
        >
          <Scan className="w-3.5 h-3.5 animate-pulse" />
          <span>Quick Scan Ingredients</span>
        </button>
      </div>
    );
  };

  const renderScanHistoryTab = () => {
    return (
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-left flex flex-col min-h-0">
        <div className="space-y-0.5 shrink-0">
          <p className="text-[9px] uppercase font-bold tracking-widest text-brand-sage font-mono">Evaluation History</p>
          <h3 className="text-sm font-serif font-bold text-brand-terracotta">
            Your Recent Scans
          </h3>
        </div>

        <p className="text-[10px] text-stone-500 leading-normal shrink-0">
          Tap on any past scan to instantly re-analyze it or inspect its clinical toxicology ingredients report inside the main Scanner.
        </p>

        <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          {recentScans.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-1.5">
              <History className="w-8 h-8 mx-auto text-stone-300 animate-pulse" />
              <p className="text-xs font-semibold">No recent scans yet</p>
              <p className="text-[10px] text-stone-400">Launch the scanner to evaluate cosmetics or food ingredients.</p>
            </div>
          ) : (
            recentScans.map((scan, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => {
                  setActivePhoneTab("scanner");
                  handleRecentScanClick(scan);
                }}
                className="w-full p-2 bg-[#FDFBF7] hover:bg-brand-sage/5 border border-brand-border/60 hover:border-brand-sage rounded-xl text-left transition-all flex items-start justify-between space-x-2"
              >
                <div className="space-y-0.5 max-w-[85%]">
                  <p className="text-xs font-bold text-stone-800 truncate">{scan.productName}</p>
                  <p className="text-[8px] text-stone-400 font-mono uppercase tracking-wider font-semibold">{scan.category}</p>
                  <p className="text-[9px] text-stone-500 truncate mt-0.5">{scan.ingredients}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-sage mt-0.5 shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderJournalTab = () => {
    return (
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-left flex flex-col min-h-0">
        <div className="space-y-0.5 shrink-0">
          <p className="text-[9px] uppercase font-bold tracking-widest text-brand-sage font-mono">Maternal Health Journal</p>
          <h3 className="text-sm font-serif font-bold text-brand-terracotta">
            Your Safety Diary
          </h3>
        </div>

        {/* Form to add journal entry */}
        <div className="bg-stone-50 p-2 border border-brand-border/60 rounded-xl space-y-1.5 shrink-0">
          <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#8C8375]">Log daily routines & safety notes</p>
          
          <textarea
            placeholder="How are you feeling today? e.g. Checked sunscreen labels and discarded retinol serums."
            rows={2}
            value={newEntryText}
            onChange={(e) => setNewEntryText(e.target.value)}
            className="w-full p-1.5 border border-brand-border rounded-lg text-[10px] bg-white focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-[8px] text-stone-400 font-bold uppercase">Mood:</span>
              <div className="flex space-x-1">
                {["😊 Good", "🤢 Nausea", "😴 Tired"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setNewEntryMood(m)}
                    className={`px-1 py-0.5 text-[9px] rounded transition-all ${
                      newEntryMood === m ? "bg-brand-sage/10 text-brand-sage font-bold border border-brand-sage/20" : "bg-white text-stone-500 border border-transparent"
                    }`}
                  >
                    {m.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newEntryText.trim()) return;
                const d = new Date();
                const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const newEntry = {
                  id: Date.now(),
                  date: formattedDate,
                  trimester: maternityStage === "1st" ? "1st Trimester" : maternityStage === "2nd" ? "2nd Trimester" : maternityStage === "3rd" ? "3rd Trimester" : "Nursing",
                  mood: newEntryMood,
                  content: newEntryText
                };
                setJournalEntries([newEntry, ...journalEntries]);
                setNewEntryText("");
              }}
              className="px-2 py-0.5 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white rounded text-[9px] font-bold transition-all cursor-pointer"
            >
              Log Note
            </button>
          </div>
        </div>

        {/* List of journal entries */}
        <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="p-2 bg-[#FDFBF7] border border-brand-border/60 rounded-lg space-y-1 text-[10px] relative">
              <div className="flex justify-between items-center text-[8px] font-mono text-stone-400 font-semibold border-b border-brand-border/30 pb-0.5">
                <span>{entry.date} • {entry.trimester}</span>
                <span className="bg-brand-soft px-1 rounded-full text-stone-600">{entry.mood}</span>
              </div>
              <p className="text-stone-700 leading-relaxed pt-0.5">{entry.content}</p>
              <button
                onClick={() => {
                  setJournalEntries(journalEntries.filter(e => e.id !== entry.id));
                }}
                className="absolute top-1 right-1 text-stone-300 hover:text-red-500 text-xs transition-colors p-1"
                title="Delete note"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSavedProductsTab = () => {
    return (
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-left flex flex-col min-h-0">
        <div className="space-y-0.5 shrink-0">
          <p className="text-[9px] uppercase font-bold tracking-widest text-red-500 font-mono">My Shopping Safe List</p>
          <h3 className="text-sm font-serif font-bold text-brand-terracotta">
            Saved Safe Products
          </h3>
        </div>

        <p className="text-[10px] text-stone-500 leading-normal shrink-0">
          Keep a curated collection of fully cleared pregnancy & nursing safe formulas for your next shopping run.
        </p>

        <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          {savedProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-1.5">
              <Heart className="w-8 h-8 mx-auto text-stone-300 animate-pulse" />
              <p className="text-xs font-semibold">No saved safe products yet</p>
              <p className="text-[10px] text-stone-400">Scan any product, then click the Heart button on the results to save them here.</p>
            </div>
          ) : (
            savedProducts.map((p, pIdx) => (
              <div
                key={pIdx}
                className="p-2.5 bg-white border border-brand-border/60 hover:border-brand-sage rounded-xl transition-all flex items-center justify-between"
              >
                <div className="space-y-0.5 max-w-[80%]">
                  <p className="text-xs font-bold text-stone-800 truncate">{p.productName}</p>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[8px] font-mono text-[#5D7052] bg-emerald-50 border border-emerald-100 px-1 py-0.2 rounded font-bold">
                      {p.verdict}
                    </span>
                    <span className="text-[9px] text-stone-400">Score: {p.overallScore}/100</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSavedProducts(savedProducts.filter((_, idx) => idx !== pIdx));
                  }}
                  className="p-1 hover:bg-stone-50 text-stone-400 hover:text-red-500 rounded-md transition-colors"
                  title="Remove from favorites"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderVoiceAssistantOverlay = () => {
    // Dynamic filtered suggestion lists based on active category
    const suggestions = {
      skin: ["Is retinol safe?", "Benzoyl peroxide?", "Salicylic acid safety", "Is mineral zinc safe?"],
      diet: ["Can I drink coffee?", "Is feta cheese safe?", "Is sushi safe?", "Caffeine in trimester"],
      care: ["Remedies for nausea", "Is Tylenol safe?", "Headache alternatives", "Can I take ibuprofen?"]
    };

    return (
      <div className="absolute inset-0 bg-[#FDFBF7] z-50 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-[#F6F3EC] border-b border-brand-border/60 p-3 flex flex-col shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {/* Interactive SVG / Pulse Avatar Orb */}
              <div className="relative">
                {isListening && (
                  <>
                    <span className="absolute -inset-1.5 rounded-full bg-rose-500/25 animate-ping" />
                    <span className="absolute -inset-1 rounded-full bg-rose-500/10 animate-pulse" />
                  </>
                )}
                {isAvaSpeaking && (
                  <>
                    <span className="absolute -inset-1.5 rounded-full bg-brand-sage/25 animate-ping" />
                    <span className="absolute -inset-1 rounded-full bg-brand-sage/10 animate-pulse" />
                  </>
                )}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-serif text-sm font-bold shadow-md transition-all duration-500 ${
                  isListening
                    ? "bg-rose-500 scale-105"
                    : isAvaSpeaking
                      ? "bg-brand-sage scale-105"
                      : isVoiceLoading
                        ? "bg-[#E3A390] animate-spin"
                        : "bg-[#5D7052]"
                }`}>
                  {isListening ? (
                    <Mic className="w-4 h-4 animate-bounce" />
                  ) : isAvaSpeaking ? (
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  ) : isVoiceLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Av"
                  )}
                </div>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  isListening ? "bg-rose-500" : isAvaSpeaking ? "bg-brand-sage" : isVoiceLoading ? "bg-[#E3A390]" : "bg-stone-400"
                }`}></span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-serif font-bold text-brand-terracotta leading-tight flex items-center space-x-1.5">
                  <span>Ava Voice Companion</span>
                  <span className="text-[7px] font-mono bg-[#E3A390]/15 text-[#E3A390] px-1 py-0.2 rounded font-bold uppercase tracking-wide">
                    Clinical AI
                  </span>
                </h4>
                <p className="text-[8px] text-[#8C8375] font-mono font-bold uppercase tracking-wider">{assistantStatus}</p>
              </div>
            </div>

            {/* Quick Tools Header Actions */}
            <div className="flex items-center space-x-1">
              {/* Toggle Voice Customizer Settings */}
              <button
                type="button"
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showVoiceSettings ? "bg-brand-sage/15 text-brand-sage" : "hover:bg-stone-100 text-stone-500"
                }`}
                title="Voice Customization Settings"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const newMute = !isVoiceMuted;
                  setIsVoiceMuted(newMute);
                  if (newMute && typeof window !== "undefined") {
                    window.speechSynthesis.cancel();
                    setIsAvaSpeaking(false);
                  }
                }}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"
                title={isVoiceMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-brand-sage" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.speechSynthesis.cancel();
                  }
                  setIsAvaSpeaking(false);
                  setVoiceMessages([
                    { sender: "ava", text: "Hello mama! I'm Ava, your virtual clinical voice companion. Ask me any ingredient, nutrition, or pregnancy safety questions, and I'll read my answers aloud to you!", time: "Just now" }
                  ]);
                  setSavedMessageIndices({});
                }}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"
                title="Reset Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsVoiceAssistantOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Customizer settings panel */}
          {showVoiceSettings && (
            <div className="mt-2.5 p-2.5 bg-white border border-brand-border/60 rounded-xl space-y-2 animate-fade-in shadow-inner text-left">
              <div className="flex items-center justify-between border-b border-brand-border/30 pb-1.5">
                <span className="text-[9px] font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-brand-sage animate-pulse" />
                  <span>Ava Voice Tuning</span>
                </span>
                <span className="text-[7px] text-stone-400 font-bold">SpeechSynthesis tuning</span>
              </div>

              {/* Pitch Adjuster */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[8px] font-semibold text-stone-500">Ava's Vocal Tone (Pitch)</label>
                  <span className="text-[8px] font-mono text-brand-sage font-bold">
                    {voicePitch === 0.85 ? "Comforting & Deep" : voicePitch === 1.05 ? "Warm & Caring" : "Cheerful & Bright"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: "Deep/Calm", val: 0.85 },
                    { label: "Warm/Default", val: 1.05 },
                    { label: "Cheerful/High", val: 1.25 }
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setVoicePitch(p.val)}
                      className={`py-1 rounded text-[8px] font-medium border transition-all cursor-pointer ${
                        voicePitch === p.val
                          ? "bg-brand-sage text-white border-brand-sage shadow-sm font-bold"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Adjuster */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[8px] font-semibold text-stone-500">Ava's Speech Speed (Pace)</label>
                  <span className="text-[8px] font-mono text-brand-sage font-bold">
                    {voiceRate === 0.8 ? "Relaxed & Patient" : voiceRate === 0.95 ? "Natural / Standard" : "Direct & Fast"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: "Slow/Relaxed", val: 0.8 },
                    { label: "Natural/Normal", val: 0.95 },
                    { label: "Efficient/Fast", val: 1.15 }
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setVoiceRate(s.val)}
                      className={`py-1 rounded text-[8px] font-medium border transition-all cursor-pointer ${
                        voiceRate === s.val
                          ? "bg-brand-sage text-white border-brand-sage shadow-sm font-bold"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-brand-border/30">
                <button
                  type="button"
                  onClick={() => speakResponse("Hello mama! I am speaking with your customized tone and pace options.")}
                  className="px-2 py-0.5 bg-brand-soft border border-brand-border/40 hover:bg-brand-soft/80 rounded text-[8px] text-brand-sage font-bold flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>Voice Test Audition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(false)}
                  className="text-[8px] text-stone-400 hover:text-stone-600 font-bold underline"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat History Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 flex flex-col bg-stone-50/40">
          <div className="flex-1 space-y-3">
            {voiceMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                } animate-fade-in`}
              >
                <div
                  className={`p-2.5 rounded-2xl text-[10px] leading-relaxed text-left shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#5D7052] text-white rounded-tr-none"
                      : "bg-white border border-brand-border/60 text-stone-800 rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                <div className="flex items-center space-x-2 mt-0.5 px-1">
                  <span className="text-[7px] text-stone-400 font-bold">{msg.time}</span>
                  
                  {/* Direct integration to save clinical recommendation to daily Pregnancy Journal! */}
                  {msg.sender === "ava" && (
                    <button
                      type="button"
                      onClick={() => saveAvaRecommendationToJournal(msg.text, i)}
                      className={`text-[7px] font-bold flex items-center space-x-1 px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                        savedMessageIndices[i]
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "text-brand-sage hover:bg-brand-soft/40 border border-brand-border/40 bg-white"
                      }`}
                      title="Save this advice directly to your pregnancy health journal"
                    >
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>{savedMessageIndices[i] ? "Saved to Journal! 📓" : "Add to Journal"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isVoiceLoading && (
              <div className="flex flex-col mr-auto items-start max-w-[85%]">
                <div className="p-2.5 rounded-2xl text-[10px] bg-white border border-brand-border/60 text-stone-400 rounded-tl-none flex items-center space-x-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-brand-sage rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-brand-sage rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-brand-sage rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Real-time Interim speech recognition feedback bubble */}
        {interimTranscript && (
          <div className="mx-3 my-1 p-2 bg-[#5E7053]/5 border border-brand-border/40 rounded-xl text-left animate-fade-in shrink-0">
            <p className="text-[8px] font-mono text-[#8C8375] font-bold uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>Hearing Voice...</span>
            </p>
            <p className="text-[10px] italic text-stone-600 leading-normal font-medium pl-2.5 mt-0.5 text-left">
              "{interimTranscript}"
            </p>
          </div>
        )}

        {/* Dynamic Category Tabs Selector */}
        <div className="px-3 pt-2 pb-1 flex justify-start items-center space-x-1 overflow-x-auto whitespace-nowrap shrink-0 border-t border-brand-border/30 select-none bg-[#F9F6F0]/20">
          {[
            { id: "skin" as const, label: "Skincare Filters" },
            { id: "diet" as const, label: "Diet & Nutrition" },
            { id: "care" as const, label: "Symptoms & Meds" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSuggestionCategory(cat.id)}
              className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                suggestionCategory === cat.id
                  ? "bg-brand-sage text-white border-brand-sage"
                  : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Suggestions Quick Buttons filtered by category */}
        <div className="px-3 pb-1.5 bg-[#F9F6F0]/50 overflow-x-auto whitespace-nowrap flex items-center space-x-1.5 shrink-0 select-none">
          {suggestions[suggestionCategory].map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendVoiceMessage(sug)}
              className="inline-block px-2 py-0.5 bg-white hover:bg-brand-soft border border-brand-border/50 rounded-full text-[9px] font-medium text-stone-600 hover:text-brand-sage transition-all shadow-sm cursor-pointer shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Dynamic Voice Waveform visualizer */}
        <div className="bg-[#F9F6F0]/80 py-2.5 px-4 flex justify-center items-center space-x-2 border-t border-brand-border/30 shrink-0 select-none">
          <div className="flex items-center space-x-1 h-4">
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
              let heightClass = "h-1";
              let animClass = "";
              if (isListening) {
                animClass = "animate-pulse";
                heightClass = bar % 2 === 0 ? "h-3" : "h-4.5";
              } else if (isAvaSpeaking) {
                animClass = "animate-bounce";
                heightClass = bar % 2 === 0 ? "h-4.5" : "h-3";
              } else if (isVoiceLoading) {
                animClass = "animate-pulse";
                heightClass = "h-2.5";
              }
              return (
                <span
                  key={bar}
                  className={`w-0.5 rounded-full bg-brand-sage transition-all duration-300 ${heightClass} ${animClass}`}
                  style={{
                    animationDelay: `${bar * 0.12}s`,
                    animationDuration: isListening ? "0.5s" : isVoiceLoading ? "1.0s" : "0.75s"
                  }}
                />
              );
            })}
          </div>
          <span className="text-[8px] font-mono font-bold text-[#8C8375] uppercase tracking-wider pl-1">
            {isListening
              ? "Mic Active (Ava is hearing)"
              : isAvaSpeaking
                ? "Ava is Speaking (Custom Speech)"
                : isVoiceLoading
                  ? "Ava is processing..."
                  : "Tap microphone below to talk"}
          </span>
        </div>

        {/* Controls and Keyboard Fallback */}
        <div className="bg-[#F9F6F0] p-2.5 border-t border-brand-border/50 shrink-0 flex flex-col space-y-1.5">
          <div className="flex items-center space-x-2">
            {/* Click to Talk Toggle */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 shadow-md cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-brand-sage text-white hover:bg-brand-sage/95"
              }`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Keyboard fallback input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendVoiceMessage(voiceInput);
              }}
              className="flex-1 flex items-center space-x-1.5 bg-white border border-brand-border rounded-xl p-0.5 shadow-inner"
            >
              <input
                type="text"
                value={voiceInput}
                onChange={(e) => setVoiceInput(e.target.value)}
                placeholder={isListening ? "Speak now or type..." : "Ask Ava about safety..."}
                className="flex-1 bg-transparent px-2 py-0.5 text-[10px] focus:outline-none placeholder-stone-400 text-left"
              />
              <button
                type="submit"
                disabled={!voiceInput.trim()}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  voiceInput.trim() ? "bg-brand-sage text-white" : "text-stone-300"
                }`}
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
          
          <p className="text-[7px] text-stone-400 font-semibold leading-tight text-center">
            Mic works best in secure contexts. Adjust speech synthesizers above!
          </p>
        </div>
      </div>
    );
  };

  // Content for the developer blueprint copyable panels
  const blueprintData = {
    hero: {
      title: "1. Above the Fold (Hero Section)",
      layout: "Left-to-right split on desktop, stacked on mobile. Left side contains clean value proposition, trust signals, and direct action triggers. Right side presents an interactive smartphone container simulating the core product scanner in real-time.",
      headline: "Expecta: Instant Product Safety Answers When You Need Them Most",
      subheadline: "Scan any beauty ingredient, food label, or over-the-counter medicine. Cross-reference clinical databases in 2 seconds. Get clear, dynamic pregnancy and breastfeeding verdicts at the shelf.",
      heroImageDesc: "Interactive iPhone frame with a green laser scanning sweep across a skincare label. Decodes text instantly into a simple maternal dashboard (🟢 Safe, 🟡 Caution, 🔴 Avoid) with clinical reasoning.",
      primaryCta: "Claim Your Early Access - $99 Lifetime",
      socialProof: "Over 5,000 expectant moms registered in early access. Trusted by Certified Nurse Midwives."
    },
    pain: {
      title: "2. Problem / Pain Section",
      headline: "The First-Trimester Anxiety Loop is Real",
      bullets: [
        { title: "The Search Engine Maze", desc: "A pregnancy search brings up outdated forums, generic blogs, and conflicting advice from random parenting threads." },
        { title: "Shelf Indecision", desc: "Standing in the grocery aisle for 30 minutes, Googling 15-letter chemical compounds, and guessing which ingredients are safe." },
        { title: "Safety Drift", desc: "Ingredients safe in your second trimester might be caution-restricted in your third, or strictly prohibited while breastfeeding." }
      ],
      visualTreatment: "A comparative flow-chart graphic contrasting 'The Search Route' (Frantic Googling → Forum Disagreements → Residual Anxiety) vs 'The Expecta Route' (Camera Scan → Instant Analysis → Clinical Peace of Mind)."
    },
    solution: {
      title: "3. Solution Overview",
      headline: "Instant Clinical Clarity, Right at the Store Shelf",
      valueProp: "Expecta parses complex physical packaging text and instantly links active compounds directly to clinical trials, ACOG papers, MotherToBaby factsheets, and LactMed summaries. No forum chatter, no guessing—just verified toxicology facts formatted for mothers.",
      bullets: [
        { title: "Dynamic Maternity Profiles", desc: "Safety ratings automatically adjust as you move from early conception, through nursing, to toddlerhood." },
        { title: "Clear Clinical Citations", desc: "We translate high-level toxicity data into friendly, readable summaries with direct links to academic databases." },
        { title: "Obstetrician-Approved Alternatives", desc: "Never hit a dead end. If an ingredient is unsafe, we recommend safe, equivalent options on the spot." }
      ]
    },
    howItWorks: {
      title: "4. How It Works (Process)",
      headline: "Scan to Safe in 3 Simple Steps",
      steps: [
        { step: "1", title: "Point Your Camera", desc: "Snap a photo of the ingredients panel on any bottle, container, or medicine box while shopping." },
        { step: "2", title: "Instant AI Toxicology Check", desc: "Our OCR parser extracts compounds and matches them against our proprietary safety database." },
        { step: "3", title: "Get Your Reassuring Verdict", desc: "View an instant safety rating, clinical thresholds, and obstetrician-approved alternative recommendations." }
      ]
    },
    features: {
      title: "5. Features / Benefits Grid",
      features: [
        { name: "Live Camera OCR Scanner", desc: "Recognizes complex, small-font chemical lists on rounded bottles under difficult retail lighting." },
        { name: "Dynamic Safety Profiles", desc: "Personalizes ingredient safety tolerances depending on your exact week of pregnancy or breastfeeding status." },
        { name: "Clinical Evidence Grounding", desc: "Links directly to ACOG, LactMed, FDA Pregnancy categories, and clinical journals—zero AI hallucination." },
        { name: "Alternative Recommendation Engine", desc: "Instantly suggests certified pregnancy-safe beauty and health alternatives when active cosmetics are flagged." }
      ]
    },
    socialProof: {
      title: "6. Social Proof Section",
      headline: "Loved by Moms, Backed by Medical Professionals",
      testimonials: [
        {
          quote: "I scanned all my skincare on day one of finding out I was pregnant. Expecta flagged two salicylic and retinol products I would have kept using! Absolutely priceless peace of mind.",
          author: "Sarah Montgomery, 14 Weeks Pregnant",
          role: "Verified Early User"
        },
        {
          quote: "My patients spend hours on forums searching ingredient safety. Expecta streamlines that search using clinical databases instead of hearsay. I now recommend it to everyone at their first prenatal visit.",
          author: "Dr. Elena Rostova, OBGYN",
          role: "Maternal Health Consultant"
        }
      ]
    },
    pricing: {
      title: "7. Pricing & Value Ladder",
      tiers: [
        {
          name: "Pregnancy Safety Guide",
          price: "Free",
          billing: "One-Time Download",
          bestFor: "Moms-to-be researching basic safety rules",
          features: ["Top 30 skincare ingredients to avoid", "Medication substitution checklist", "Printable diaper-bag reference guide", "10 times smartphone barcode/OCR scans"]
        },
        {
          name: "Scanner Early Access",
          price: "$99",
          billing: "Lifetime Access (Special)",
          bestFor: "Anxious moms wanting immediate peace of mind",
          features: ["Unlimited OCR bottle scanning", "Dynamic maternity safety profile", "Alternative ingredient recommender", "Access to early beta community", "Lifetime database updates included"]
        },
        {
          name: "Continuous Updates",
          price: "$9.99",
          billing: "per month",
          bestFor: "Multi-pregnancy journeys & continuous updates",
          features: ["Weekly ingredient database sync", "Direct Ask-a-Toxicologist portal", "Pediatric safety thresholds (postpartum)"]
        }
      ]
    },
    faq: {
      title: "8. FAQ & Objection Handling",
      items: [
        { q: "Is Expecta a certified medical device?", a: "Expecta is an educational reference application. All verdicts are grounded strictly in academic databases (MotherToBaby, LactMed, ACOG, FDA), but should never replace direct consultation with your personal obstetrician or midwife." },
        { q: "How does the app handle ingredients that have conflicting safety studies?", a: "We adopt a stance of absolute caution. If clinical trials disagree, we flag the compound as 'Caution' or 'Avoid' and outline the specific conflict so you and your doctor can make an informed choice." },
        { q: "Can I use the scanner while breastfeeding?", a: "Yes. Our database contains extensive profiles from LactMed tracking systemic absorption and breastmilk excretion thresholds for thousands of medications and cosmetics." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige font-sans text-[#2D332D] selection:bg-brand-sage/20 selection:text-brand-sage antialiased">
      
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-brand-beige/95 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-sage rounded-lg flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <div>
                <span className="font-sans font-semibold text-lg tracking-tight uppercase text-brand-terracotta">Expecta</span>
                <span className="block text-[9px] font-mono tracking-wider uppercase text-stone-400 -mt-1">Safety Scanner</span>
              </div>
            </div>

            {/* Middle Navigation - Clean Minimalism Menu style */}
            <nav className="hidden lg:flex gap-8 text-xs font-semibold uppercase tracking-wider text-[#6A6A6A]">
              <a href="#how-it-works" onClick={() => setViewMode("landing")} className="hover:text-brand-sage transition-colors">How it Works</a>
              <a href="#features" onClick={() => setViewMode("landing")} className="hover:text-brand-sage transition-colors">Science</a>
              <a href="#pricing" onClick={() => setViewMode("landing")} className="hover:text-brand-sage transition-colors">Pricing</a>
              <a href="#faq" onClick={() => setViewMode("landing")} className="hover:text-brand-sage transition-colors">FAQ</a>
            </nav>

            {/* Middle Nav - Interactive Mode Switch */}
            <div className="hidden md:flex items-center bg-brand-soft p-1 rounded-full border border-brand-border">
              <button 
                onClick={() => setViewMode("landing")}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 ${
                  viewMode === "landing" 
                    ? "bg-brand-sage text-white shadow-sm" 
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Interactive Page
              </button>
              <button 
                onClick={() => setViewMode("blueprint")}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 ${
                  viewMode === "blueprint" 
                    ? "bg-brand-sage text-white shadow-sm" 
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Developer Spec
              </button>
            </div>

            {/* Right Side Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="#pricing"
                onClick={() => setViewMode("landing")}
                className="px-5 py-2 bg-brand-sage text-white rounded-full text-xs font-semibold hover:bg-brand-sage/95 transition-all shadow-sm"
              >
                Download App
              </a>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-600 hover:text-stone-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-beige border-b border-brand-border px-4 pt-2 pb-4 space-y-3">
            <div className="flex flex-col space-y-1 bg-brand-soft p-1 rounded-xl">
              <button 
                onClick={() => { setViewMode("landing"); setMobileMenuOpen(false); }}
                className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === "landing" ? "bg-brand-sage text-white" : "text-stone-600"
                }`}
              >
                Interactive Page
              </button>
              <button 
                onClick={() => { setViewMode("blueprint"); setMobileMenuOpen(false); }}
                className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === "blueprint" ? "bg-brand-sage text-white" : "text-stone-600"
                }`}
              >
                Developer Spec
              </button>
            </div>
            <div className="pt-2 border-t border-brand-border flex flex-col space-y-2 text-xs uppercase font-semibold tracking-wider">
              <a 
                href="#how-it-works" 
                onClick={() => { setViewMode("landing"); setMobileMenuOpen(false); }}
                className="block text-center py-2 text-stone-700 hover:text-brand-sage"
              >
                How It Works
              </a>
              <a 
                href="#pricing" 
                onClick={() => { setViewMode("landing"); setMobileMenuOpen(false); }}
                className="block text-center py-2 text-stone-700 hover:text-brand-sage"
              >
                Pricing Plans
              </a>
              <a 
                href="#pricing" 
                onClick={() => { setViewMode("landing"); setMobileMenuOpen(false); }}
                className="block text-center py-2.5 bg-brand-sage text-white rounded-full font-bold shadow-sm"
              >
                Download App
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Page Content */}
      <AnimatePresence mode="wait">
        {viewMode === "landing" ? (
          
          /* LIVE STARTUP LANDING PAGE VIEW */
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* HERO SECTION */}
            <header className="relative pt-12 pb-20 md:py-24 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                  
                  {/* Left Hero copy */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-soft border border-brand-border rounded-full text-[11px] font-bold uppercase tracking-widest text-brand-sage">
                      <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
                      Clinical Safety Verification
                    </div>
                    
                    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-brand-terracotta tracking-tight">
                      Stop second-guessing<br/>
                      <span className="text-brand-sage">the product shelf.</span>
                    </h1>
                    
                    <p className="text-lg text-[#6A6A6A] leading-relaxed max-w-[500px]">
                      Scan any product barcode or chemical ingredients label to get an instant, clinical-grade safety verdict for your pregnancy. Science-backed answers, not forum threads.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                      <a 
                        href="#scanner-box"
                        className="px-8 py-4 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white font-bold rounded-xl text-center shadow-lg shadow-black/5 transition-all flex items-center justify-center space-x-2"
                      >
                        <span>Try the Live Scan Demo</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      <div className="flex flex-col justify-center text-left pl-2">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-stone-300 border-2 border-brand-beige flex items-center justify-center text-[10px] font-bold text-stone-600">SM</div>
                          <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-brand-beige flex items-center justify-center text-[10px] font-bold text-amber-800">JL</div>
                          <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-brand-beige flex items-center justify-center text-[10px] font-bold text-emerald-800">CR</div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#8A8A8A] mt-1">Trusted by 12,400+ moms</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Hero: Interactive Smartphone Frame containing Scanner Demo */}
                  <div id="scanner-box" className="lg:col-span-5 flex justify-center lg:justify-end relative">
                    {/* Sand/Soft colored card background with Dot Grid overlay */}
                    <div className="absolute inset-y-0 -inset-x-6 sm:-inset-x-12 bg-brand-soft rounded-3xl border border-brand-border z-0 overflow-hidden hidden sm:block">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#5D7052 0.7px, transparent 0.7px)", backgroundSize: "24px 24px" }}></div>
                    </div>

                    {/* Floating Trust Card */}
                    <div className="absolute bottom-16 -left-16 z-20 bg-white p-5 rounded-2xl shadow-xl border border-brand-border max-w-[210px] hidden xl:block text-left">
                       <p className="text-[13px] font-serif italic text-brand-terracotta mb-3 leading-relaxed">"I no longer spend an hour in the pharmacy aisle searching ingredients on Google."</p>
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-sage flex items-center justify-center text-[10px] text-white font-bold">S</div>
                          <div className="text-[10px] font-bold text-stone-800">Sarah J., 2nd Trimester</div>
                       </div>
                    </div>
                    
                    <div className="relative z-10 w-full max-w-[340px] bg-brand-terracotta p-3 rounded-[44px] shadow-2xl shadow-stone-950/40 border-4 border-stone-800">
                      
                      {/* Phone Screen Container */}
                      <div className="relative bg-white rounded-[34px] overflow-hidden min-h-[580px] border border-stone-800 flex flex-col">
                        
                        {/* Phone StatusBar */}
                        <div className="bg-brand-soft text-brand-terracotta/80 px-6 pt-7 pb-2.5 flex justify-between items-center text-[10px] font-mono border-b border-brand-border font-bold uppercase tracking-wider">
                          <span>Expecta Core v1.2</span>
                          <span className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse-slow"></span>
                            <span>Live Database</span>
                          </span>
                        </div>

                        {/* Switchable tab screen content */}
                        <div className="flex-1 flex flex-col min-h-0 relative">
                          {activePhoneTab === "dashboard" && renderDashboardTab()}
                          {activePhoneTab === "history" && renderScanHistoryTab()}
                          {activePhoneTab === "journal" && renderJournalTab()}
                          {activePhoneTab === "saved" && renderSavedProductsTab()}

                          {activePhoneTab === "scanner" && (
                            <div className="flex-1 p-4 flex flex-col space-y-3 overflow-y-auto min-h-0">
                          
                          {/* Instructions */}
                          <div className="bg-brand-soft p-3 rounded-2xl border border-brand-border text-left">
                            <p className="text-xs font-semibold text-brand-sage flex items-center space-x-1.5">
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Clinical Scan Sandbox</span>
                            </p>
                            <p className="text-[11px] text-stone-600 mt-1 leading-normal">
                              Select a typical retail product below or write custom ingredients to test our toxicological scan matching.
                            </p>
                          </div>

                          {/* Mode switches (Presets vs Custom vs Camera/Upload Scanner) */}
                          <div className="flex bg-stone-200/60 p-1 rounded-lg text-[10px] sm:text-xs font-medium gap-0.5">
                            <button 
                              type="button"
                              onClick={() => { setScanMode("presets"); setIsCustomMode(false); }}
                              className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                                scanMode === "presets" ? "bg-white text-stone-800 shadow-sm font-semibold" : "text-stone-500 hover:text-stone-800"
                              }`}
                            >
                              Presets
                            </button>
                            <button 
                              type="button"
                              onClick={() => { setScanMode("custom"); setIsCustomMode(true); }}
                              className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                                scanMode === "custom" ? "bg-white text-stone-800 shadow-sm font-semibold" : "text-stone-500 hover:text-stone-800"
                              }`}
                            >
                              Text
                            </button>
                            <button 
                              type="button"
                              onClick={() => { setScanMode("camera"); setIsCustomMode(false); }}
                              className={`flex-1 py-1.5 rounded-md text-center transition-all flex items-center justify-center space-x-1 ${
                                scanMode === "camera" ? "bg-white text-stone-800 shadow-sm font-semibold" : "text-stone-500 hover:text-stone-800"
                              }`}
                            >
                              <Camera className="w-3 h-3 text-brand-sage" />
                              <span>Live Scan</span>
                            </button>
                          </div>

                          {/* Form/Selector Section */}
                          <div className="text-left flex-1 flex flex-col justify-between">
                            {scanMode === "presets" && (
                              <div className="space-y-2">
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                                  Select Store Item to Scan
                                </label>
                                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                                  {PRODUCT_PRESETS.map((p, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handlePresetScan(idx)}
                                      disabled={isScanning}
                                      className={`w-full p-2 rounded-xl text-left border text-xs transition-all flex justify-between items-center ${
                                        selectedPreset === idx && scanMode === "presets"
                                          ? "bg-brand-sage/5 border-brand-sage text-brand-sage font-semibold"
                                          : "bg-white border-brand-border hover:border-brand-sage/40 text-stone-700"
                                      }`}
                                    >
                                      <div>
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-[10px] text-stone-400 font-normal">{p.category}</p>
                                      </div>
                                      <Scan className="w-3.5 h-3.5 text-stone-400" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {scanMode === "custom" && (
                              <form onSubmit={handleCustomScan} className="space-y-2.5 w-full">
                                <div>
                                  <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                                    Product Name
                                  </label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Anti-Wrinkle Essence"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    required
                                    disabled={isScanning}
                                    className="w-full mt-1 p-2 border border-brand-border rounded-lg text-xs bg-white focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                                    Ingredients List
                                  </label>
                                  <textarea 
                                    placeholder="Water, Glycerin, Retinol, Sodium Benzoate..."
                                    rows={3}
                                    value={customIngredients}
                                    onChange={(e) => setCustomIngredients(e.target.value)}
                                    required
                                    disabled={isScanning}
                                    className="w-full mt-1 p-2 border border-brand-border rounded-lg text-xs bg-white focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={isScanning || !customName.trim() || !customIngredients.trim()}
                                  className="w-full py-2 bg-brand-terracotta hover:bg-brand-terracotta/90 disabled:bg-stone-300 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                >
                                  Submit Toxicological Scan
                                </button>
                              </form>
                            )}

                            {scanMode === "camera" && (
                              <div className="space-y-3 flex-1 flex flex-col justify-between w-full">
                                {/* Video element or captured photo display */}
                                <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-stone-950 aspect-video flex flex-col items-center justify-center text-center">
                                  {isCameraActive ? (
                                    <video 
                                      ref={videoRef} 
                                      className="w-full h-full object-cover" 
                                      playsInline 
                                      muted 
                                    />
                                  ) : capturedPhoto ? (
                                    <img 
                                      src={capturedPhoto} 
                                      alt="Captured label" 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="p-4 text-stone-500">
                                      <Camera className="w-8 h-8 mx-auto mb-2 text-stone-600 animate-pulse-slow" />
                                      <p className="text-[11px] font-semibold text-stone-400">Scan product packaging</p>
                                      <p className="text-[9px] text-stone-500 mt-0.5 leading-normal">Position ingredient labels inside frame</p>
                                    </div>
                                  )}

                                  {/* Torch/Flashlight toggle button overlay */}
                                  {isCameraActive && isTorchSupported && (
                                    <button
                                      type="button"
                                      onClick={toggleTorch}
                                      className="absolute top-3 right-3 p-2 bg-stone-900/80 hover:bg-stone-800 text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-sage pointer-events-auto shadow-md border border-stone-700/50 z-10"
                                      title={isTorchOn ? "Turn off Flash" : "Turn on Flash"}
                                    >
                                      <Zap className={`w-3.5 h-3.5 ${isTorchOn ? "text-yellow-400 fill-yellow-400 animate-pulse" : "text-stone-300"}`} />
                                    </button>
                                  )}

                                  {/* High-Fidelity Scanning Quality badge */}
                                  <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-stone-900/80 rounded-md text-[8px] font-mono font-semibold text-emerald-400 tracking-wider uppercase border border-emerald-500/20 flex items-center space-x-1 z-10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>HD Auto-Focus</span>
                                  </div>

                                  {/* Holographic scanner layout details inside camera viewfinder */}
                                  {isCameraActive && (
                                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
                                      <div className="flex justify-between">
                                        <div className="w-3 h-3 border-t-2 border-l-2 border-brand-sage"></div>
                                        <div className="w-3 h-3 border-t-2 border-r-2 border-brand-sage"></div>
                                      </div>
                                      {/* Scanner horizontal sweep line animation */}
                                      <div className="w-full h-0.5 bg-brand-sage/60 animate-bounce"></div>
                                      <div className="flex justify-between">
                                        <div className="w-3 h-3 border-b-2 border-l-2 border-brand-sage"></div>
                                        <div className="w-3 h-3 border-b-2 border-r-2 border-brand-sage"></div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {cameraError && (
                                  <p className="text-[10px] text-red-500 font-medium leading-tight text-center">{cameraError}</p>
                                )}

                                {/* Action Buttons for Camera tab */}
                                <div className="space-y-1.5">
                                  {isCameraActive ? (
                                    <div className="flex gap-1.5">
                                      <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="flex-1 py-1.5 bg-brand-terracotta text-white rounded-lg text-xs font-bold hover:bg-brand-terracotta/90 transition-all flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                                      >
                                        <Camera className="w-3.5 h-3.5" />
                                        <span>Capture Photo</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="py-1.5 px-3 bg-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-300 transition-all cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : capturedPhoto ? (
                                    <div className="flex gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => runImageScan(capturedPhoto)}
                                        disabled={isScanning}
                                        className="flex-1 py-1.5 bg-brand-sage text-white rounded-lg text-xs font-bold hover:bg-brand-sage/95 transition-all flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                                      >
                                        <Scan className="w-3.5 h-3.5 animate-pulse" />
                                        <span>Analyze Ingredients</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={startCamera}
                                        disabled={isScanning}
                                        className="py-1.5 px-2 bg-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-300 transition-all cursor-pointer"
                                      >
                                        Retake
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={startCamera}
                                      className="w-full py-1.5 bg-brand-sage text-white rounded-lg text-xs font-bold hover:bg-brand-sage/95 transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                                    >
                                      <Camera className="w-3.5 h-3.5" />
                                      <span>Use Live Camera</span>
                                    </button>
                                  )}

                                  {/* Custom Photo Upload Fallback */}
                                  {!isCameraActive && (
                                    <div className="relative flex items-center justify-center border border-dashed border-stone-300 rounded-lg py-1.5 bg-stone-50 hover:bg-stone-100/50 cursor-pointer transition-colors text-center">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={isScanning}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                      />
                                      <p className="text-[10px] text-stone-500 font-medium flex items-center justify-center space-x-1.5">
                                        <Upload className="w-3 h-3 text-stone-400" />
                                        <span>Or upload a label photo</span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Trigger for presets when first viewing */}
                          {scanMode === "presets" && !scanHasRun && (
                            <button
                              onClick={() => handlePresetScan(0)}
                              className="w-full py-2.5 bg-brand-sage hover:bg-brand-sage/95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm mt-4 animate-pulse cursor-pointer"
                            >
                              <Scan className="w-4 h-4" />
                              <span>Scan Selected Item Now</span>
                            </button>
                          )}
                        </div>

                          {/* Recent Scans Component */}
                          {recentScans.length > 0 && (
                            <div className="text-left space-y-1.5 py-2.5 px-0.5 border-t border-brand-border/40">
                              <p className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold flex items-center space-x-1">
                                <History className="w-3 h-3 text-brand-sage" />
                                <span>Recent Scans</span>
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {recentScans.map((scan, sIdx) => (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => handleRecentScanClick(scan)}
                                    disabled={isScanning}
                                    className="px-2.5 py-1 bg-brand-soft hover:bg-brand-sage/10 text-[10px] text-stone-700 hover:text-brand-sage border border-brand-border rounded-full font-medium transition-all truncate max-w-[90px] text-center cursor-pointer"
                                    title={`Re-evaluate ${scan.productName}`}
                                  >
                                    {scan.productName}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Analysis Display Area inside Screen */}
                          <div className="relative border-t border-brand-border pt-3 min-h-[220px]">
                            
                            {/* SCANNING ACTIVE SIMULATION */}
                            {isScanning && (
                              <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center p-4">
                                <div className="relative w-16 h-16 border-2 border-brand-sage rounded-full flex items-center justify-center mb-3">
                                  <RefreshCw className="w-8 h-8 text-brand-sage animate-spin" />
                                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 animate-bounce"></div>
                                </div>
                                <span className="text-xs font-semibold text-brand-sage">AI SCANNER BUSY</span>
                                <span className="text-[10px] text-stone-500 mt-1 max-w-[200px] animate-pulse">
                                  {scanStepText}
                                </span>
                              </div>
                            )}

                            {/* SCAN RESULT PRESENTATION */}
                            {!isScanning && scanResult && (
                              <div className="text-left space-y-2.5">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-xs font-bold text-stone-900 leading-tight">
                                      {scanResult.productName}
                                    </h4>
                                    <p className="text-[10px] text-stone-400 font-mono">Verdict Index: {scanResult.overallScore}/100</p>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getVerdictBadgeStyles(scanResult.verdict).bg}`}>
                                    {scanResult.verdict}
                                  </span>
                                </div>

                                {/* Verdict Alert Box */}
                                <div className={`p-2 rounded-xl border text-[11px] leading-relaxed flex items-start space-x-2 ${getVerdictBadgeStyles(scanResult.verdict).bg}`}>
                                  {scanResult.verdict === "SAFE" ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : scanResult.verdict === "CAUTION" ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  )}
                                  <div>
                                    <p className="font-semibold">{getVerdictBadgeStyles(scanResult.verdict).label}</p>
                                    <p className="text-[10px] text-stone-600 mt-0.5">{scanResult.reasoningSummary}</p>
                                  </div>
                                </div>

                                {/* Trimester Safety Indicators */}
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="bg-brand-soft p-1.5 rounded-lg border border-brand-border">
                                    <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Pregnancy</p>
                                    <p className="text-xs font-semibold text-stone-800">{scanResult.pregnancySafety}</p>
                                  </div>
                                  <div className="bg-brand-soft p-1.5 rounded-lg border border-brand-border">
                                    <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Breastfeeding</p>
                                    <p className="text-xs font-semibold text-stone-800">{scanResult.breastfeedingSafety}</p>
                                  </div>
                                </div>

                                {/* Detailed Ingredient Breakdown */}
                                <div className="space-y-1.5">
                                  <p className="text-[9px] font-mono uppercase tracking-wider text-stone-500">Ingredient Audit</p>
                                  <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1">
                                    {scanResult.ingredientsAnalyzed.map((ing, i) => (
                                      <div key={i} className="p-1.5 bg-white rounded-lg border border-brand-border text-[10px] leading-normal">
                                        <div className="flex justify-between font-semibold text-stone-800">
                                          <span>{ing.name}</span>
                                          <span className={
                                            ing.status === "SAFE" ? "text-emerald-600" :
                                            ing.status === "CAUTION" ? "text-amber-600" : "text-rose-600"
                                          }>{ing.status}</span>
                                        </div>
                                        <p className="text-[9px] text-stone-500 mt-0.5">{ing.description}</p>
                                        {ing.alternatives && ing.alternatives !== "N/A" && (
                                          <p className="text-[9px] text-emerald-700 mt-0.5 italic">
                                            Safe Alternatives: {ing.alternatives}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* IDLE STATE */}
                            {!isScanning && !scanResult && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <Scan className="w-10 h-10 text-stone-300 animate-pulse-slow mb-2" />
                                <span className="text-xs font-semibold text-stone-500">Ready to Scan</span>
                                <span className="text-[10px] text-stone-400 mt-1 max-w-[180px]">
                                  Choose a store product or write custom ingredients, then click Scan.
                                </span>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      {/* Floating Voice Assistant Trigger inside Phone Screen */}
                      {!isVoiceAssistantOpen && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsVoiceAssistantOpen(true);
                            startListening();
                          }}
                          className="absolute bottom-16 right-4 w-9 h-9 rounded-full bg-brand-terracotta hover:bg-brand-terracotta/95 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer border border-white/20"
                          title="Talk to Ava"
                        >
                          <div className="relative">
                            <Mic className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E3A390] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E3A390]"></span>
                            </span>
                          </div>
                        </button>
                      )}

                      {/* Voice Assistant Overlay Component */}
                      {isVoiceAssistantOpen && renderVoiceAssistantOverlay()}

                    </div>

                        {/* Persistent Bottom Navigation Bar */}
                        <div className="bg-[#F9F6F0] border-t border-brand-border/60 py-1.5 px-1 flex justify-around items-center shrink-0 z-10 shadow-inner">
                          <button
                            type="button"
                            onClick={() => setActivePhoneTab("dashboard")}
                            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-xl ${
                              activePhoneTab === "dashboard"
                                ? "text-brand-sage font-bold scale-110"
                                : "text-stone-400 hover:text-stone-700"
                            }`}
                          >
                            <Activity className="w-4 h-4 mb-0.5" />
                            <span className="text-[8px] tracking-tight font-medium">Home</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivePhoneTab("scanner")}
                            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-xl relative ${
                              activePhoneTab === "scanner"
                                ? "text-brand-sage font-bold scale-110"
                                : "text-stone-400 hover:text-stone-700"
                            }`}
                          >
                            <Scan className="w-4 h-4 mb-0.5" />
                            <span className="text-[8px] tracking-tight font-medium">Scanner</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivePhoneTab("history")}
                            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-xl ${
                              activePhoneTab === "history"
                                ? "text-brand-sage font-bold scale-110"
                                : "text-stone-400 hover:text-stone-700"
                            }`}
                          >
                            <History className="w-4 h-4 mb-0.5" />
                            <span className="text-[8px] tracking-tight font-medium">History</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivePhoneTab("journal")}
                            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-xl ${
                              activePhoneTab === "journal"
                                ? "text-brand-sage font-bold scale-110"
                                : "text-stone-400 hover:text-stone-700"
                            }`}
                          >
                            <BookOpen className="w-4 h-4 mb-0.5" />
                            <span className="text-[8px] tracking-tight font-medium">Journal</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivePhoneTab("saved")}
                            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-xl relative ${
                              activePhoneTab === "saved"
                                ? "text-red-500 font-bold scale-110"
                                : "text-stone-400 hover:text-red-500/80"
                            }`}
                          >
                            <Heart className={`w-4 h-4 mb-0.5 ${activePhoneTab === "saved" ? "fill-red-500 text-red-500" : ""}`} />
                            <span className="text-[8px] tracking-tight font-medium">Saved</span>
                            {savedProducts.length > 0 && (
                              <span className="absolute top-0 right-3 bg-red-500 text-white text-[7px] w-3 h-3 flex items-center justify-center rounded-full font-bold">
                                {savedProducts.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </header>

            {/* TRUST INDICATORS STRIP */}
            <section className="bg-brand-soft py-12 border-y border-brand-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  
                  <div className="space-y-1">
                    <p className="text-3xl font-serif font-bold text-brand-sage">50,000+</p>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-stone-500">Compounds Analyzed</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-serif font-bold text-brand-sage">100%</p>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-stone-500">Clinically Documented</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-serif font-bold text-brand-sage">12,400+</p>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-stone-500">Active Mother Cohort</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-serif font-bold text-brand-sage">ACOG & FDA</p>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-stone-500">Sourced Guidelines</p>
                  </div>

                </div>
              </div>
            </section>

            {/* PROBLEM / PAIN SECTION */}
            <section id="how-it-works" className="py-20 md:py-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-bold">The Maternal Dilemma</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-terracotta mt-2 leading-tight">
                    The First-Trimester Anxiety Loop is Real
                  </h2>
                  <p className="text-stone-600 mt-4 leading-relaxed">
                    Stand in front of any retail product shelf, deciphering a complex chemical ingredient list, and feel total peace of mind. Expecta removes the toxicological mystery from your daily routine.
                  </p>
                </div>

                {/* Pain Points Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Side: Specific Pain Points */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-brand-border">
                      <div className="w-10 h-10 rounded-xl bg-brand-soft border border-brand-border flex items-center justify-center text-brand-sage shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-serif font-bold text-stone-900">The Forum Conjecture Maze</h4>
                        <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                          Parenting forums are full of well-intentioned but conflicting advice. One mom swears an ingredient is safe, another links a blog saying it caused an allergic emergency.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-brand-border">
                      <div className="w-10 h-10 rounded-xl bg-brand-soft border border-brand-border flex items-center justify-center text-brand-sage shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-serif font-bold text-stone-900">The 20-Letter Ingredient Blindspot</h4>
                        <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                          Cosmetics list names like "Retinyl Palmitate" or "Salicylic Acid". It requires a biochemistry degree to research which ones cross the placenta or enter breastmilk.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-brand-border">
                      <div className="w-10 h-10 rounded-xl bg-brand-soft border border-brand-border flex items-center justify-center text-brand-sage shrink-0">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-serif font-bold text-stone-900">The Trimester Safety Drift</h4>
                        <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                          Certain active substances are safe in early weeks but carry severe safety warnings as you enter your third trimester or transition to breastfeeding.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Right Side: Visual Flow Comparison */}
                  <div className="lg:col-span-6 bg-brand-soft p-8 rounded-3xl border border-brand-border">
                    <h3 className="font-serif font-semibold text-lg text-brand-sage text-left mb-6 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-brand-terracotta" />
                      <span>Seeking Safe Product Verdicts</span>
                    </h3>
                    
                    <div className="space-y-6 text-left">
                      
                      {/* Old way */}
                      <div className="relative pl-6 pb-6 border-l-2 border-dashed border-stone-300">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-terracotta"></div>
                        <span className="text-[10px] font-mono text-brand-terracotta font-bold uppercase tracking-wider">The Old Way (Anxiety)</span>
                        <h5 className="font-serif font-bold text-stone-800 mt-1">1 Hour of Deciphering Google</h5>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                          Squinting at tiny back-label text → Typos in search engines → Conflicting Reddit threads → residual second-guessing and purchasing anxiety.
                        </p>
                      </div>

                      {/* New way */}
                      <div className="relative pl-6">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-sage ring-4 ring-brand-sage/20"></div>
                        <span className="text-[10px] font-mono text-brand-sage font-bold uppercase tracking-wider">The Expecta Way (Clarity)</span>
                        <h5 className="font-serif font-bold text-stone-800 mt-1">2-Second OCR Smartphone Scan</h5>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                          Point phone camera → Instant parsing → Absolute clinical grading from peer-reviewed databases on the shelf → Complete peace of mind.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* INTERACTIVE VALUE PROPOSITION / SOLUTION SECTION */}
            <section id="features" className="bg-brand-sage text-brand-beige py-20 md:py-28 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent)]"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Side Text */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-soft font-bold">Clinically-Driven Solution</span>
                    <h2 className="font-serif font-bold text-3xl sm:text-4xl leading-tight">
                      Instant Clinical Verdicts, Customized for Your Maternity Timeline
                    </h2>
                    <p className="text-brand-beige/80 leading-relaxed text-sm">
                      Unlike static forums or outdated lists, Expecta processes raw ingredients and updates risk thresholds based on your trimester or postpartum state.
                    </p>

                    {/* Interactive Profile Selector Demo */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl space-y-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-brand-soft font-bold">
                        Select Maternity Stage to see Threshold adjustments:
                      </p>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {(["1st", "2nd", "3rd", "nursing"] as const).map((stage) => (
                          <button
                            key={stage}
                            onClick={() => setMaternityStage(stage)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              maternityStage === stage 
                                ? "bg-brand-terracotta text-white shadow" 
                                : "bg-white/10 hover:bg-white/15 text-brand-beige"
                            }`}
                          >
                            {stage === "nursing" ? "Nursing" : `${stage} Trim.`}
                          </button>
                        ))}
                      </div>

                      {/* Display safety thresholds depending on selected trimester */}
                      <div className="p-3 bg-white/10 rounded-xl text-xs leading-relaxed text-left text-brand-beige/90">
                        {maternityStage === "1st" && (
                          <p>
                            <span className="font-serif font-semibold text-brand-beige">1st Trimester Core Filters:</span> Maximum developmental sensitivity. Strictly flags high-absorption retinoids, synthetic fragrances of concern, and pain medications linked to early embryogenesis disruptions.
                          </p>
                        )}
                        {maternityStage === "2nd" && (
                          <p>
                            <span className="font-serif font-semibold text-brand-beige">2nd Trimester Core Filters:</span> Organogenesis completed. Some skincare ingredients transition to caution status under strictly controlled percentages (e.g. low-dose cosmetic glycolic washes).
                          </p>
                        )}
                        {maternityStage === "3rd" && (
                          <p>
                            <span className="font-serif font-semibold text-brand-beige">3rd Trimester Core Filters:</span> Crucial hemodynamic adjustments. Strictly flags NSAIDs (like Ibuprofen) which are contraindicated due to risk of premature closure of the fetal heart valve.
                          </p>
                        )}
                        {maternityStage === "nursing" && (
                          <p>
                            <span className="font-serif font-semibold text-brand-beige">Lactation & Postpartum Filters:</span> Focuses on serum-to-milk excretion ratios, infant GI absorption index, and LactMed ratings to prevent hazardous infant chemical exposure.
                          </p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Side Key Benefits List */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-brand-terracotta text-brand-beige flex items-center justify-center shrink-0 mt-1 text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg">Dynamic Trimester Database</h4>
                        <p className="text-sm text-brand-beige/80 mt-1">
                          Safety consensus shifts. Our database maps ingredients with clinical safety thresholds that adjust to your baby's current developmental stage.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-brand-terracotta text-brand-beige flex items-center justify-center shrink-0 mt-1 text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg">Obstetrician-Approved Safe Alternatives</h4>
                        <p className="text-sm text-brand-beige/80 mt-1">
                          Expecta never leaves you in a bind. When a chemical skincare or medication is flagged unsafe, we instantly suggest verified, equivalent replacements.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-brand-terracotta text-brand-beige flex items-center justify-center shrink-0 mt-1 text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg">No AI Hallucinations</h4>
                        <p className="text-sm text-brand-beige/80 mt-1">
                          Our database rules are grounded in real peer-reviewed scientific journals, toxicological analyses, and medical guidelines, complete with citation references.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </section>

            {/* HOW IT WORKS (PROCESS SECTION) */}
            <section className="py-20 md:py-28 bg-brand-soft/50 border-b border-brand-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-bold">User Experience</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-terracotta mt-2 leading-tight">
                    Simple and Clear: Scan to Safe in 3 Steps
                  </h2>
                  <p className="text-stone-500 mt-4">
                    Designed to meet you right at the shelf where buying decisions happen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  
                  {/* Step 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-brand-border relative text-left">
                    <div className="absolute top-4 right-4 text-6xl font-serif font-extrabold text-stone-100 select-none">
                      01
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-soft border border-brand-border text-brand-sage flex items-center justify-center font-bold mb-6">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">Point Your Camera</h4>
                    <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                      Simply hold your phone camera in front of the ingredients list on any beauty product, label, or cold medication bottle.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-brand-border relative text-left">
                    <div className="absolute top-4 right-4 text-6xl font-serif font-extrabold text-stone-100 select-none">
                      02
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-soft border border-brand-border text-brand-sage flex items-center justify-center font-bold mb-6">
                      <Database className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">Toxicological Cross-Reference</h4>
                    <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                      Our OCR technology extracts chemical nomenclature and cross-references active compounds against medical databases in real-time.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-brand-border relative text-left">
                    <div className="absolute top-4 right-4 text-6xl font-serif font-extrabold text-stone-100 select-none">
                      03
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-soft border border-brand-border text-brand-sage flex items-center justify-center font-bold mb-6">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">Get Clear Safety Verdict</h4>
                    <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                      Review a clean color-coded dashboard: safe, caution, or avoid, with a friendly clinical summary of the reason and safe suggestions.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* FEATURES GRID SECTION */}
            <section className="py-20 md:py-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-bold">Engineered for Accuracy</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-terracotta mt-2 leading-tight">
                    Powerful Features Made Humble and Helpful
                  </h2>
                  <p className="text-stone-500 mt-4 text-sm">
                    Advanced toxicology algorithms paired with human, maternal-focused design.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                  
                  <div className="p-6 bg-white rounded-2xl border border-brand-border space-y-3">
                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-sage border border-brand-border">
                      <Scan className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Label OCR Scanning Engine</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Optimized optical character recognition that handles cylindrical cosmetics bottles, curved plastic, and glossy packages.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-brand-border space-y-3">
                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-sage border border-brand-border">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Trimester Adaptation Profile</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Dynamically updates ingredient restrictions based on gestational progress, safeguarding development trimesters.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-brand-border space-y-3">
                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-sage border border-brand-border">
                      <Database className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Citations & Clinical Grounds</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Every rating includes direct references to verified academic databases, so you can easily review toxicological literature.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-brand-border space-y-3">
                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-sage border border-brand-border">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Alternative Product Library</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Never leaves you empty-handed. When a personal care item is flagged as unsafe, get immediate safe suggestions.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-brand-border space-y-3">
                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-sage border border-brand-border">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Lactation Guard Mode</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Transitions safety thresholds automatically post-conception to filter out breastmilk excretion hazards.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-brand-border space-y-3">
                    <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-sage border border-brand-border">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Continuous Database Updates</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Medical guidelines shift constantly. Expecta updates database files continuously to encompass new academic research.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* SOCIAL PROOF SECTION */}
            <section className="bg-brand-soft py-20 md:py-28 border-y border-brand-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-bold">User Endorsements</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-terracotta mt-2 leading-tight">
                    Peace of Mind Trusted by Expectant Families
                  </h2>
                  <p className="text-stone-500 mt-4 text-sm">
                    Read reviews from mothers and healthcare professionals testing early versions of the scanner.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  
                  <div className="bg-white p-8 rounded-2xl border border-brand-border flex flex-col justify-between shadow-sm relative">
                    <div className="absolute top-6 right-8 text-5xl text-brand-sage/10 font-serif font-bold">“</div>
                    <p className="text-stone-600 italic leading-relaxed text-sm relative z-10 font-serif">
                      "I scanned all my bathroom skincare on day one. Expecta flagged two salicylic acid products and a retinol cream I would have kept using without a second thought! Absolute lifesaver."
                    </p>
                    <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-brand-border">
                      <div className="w-10 h-10 rounded-full bg-brand-sage/10 text-brand-sage flex items-center justify-center font-bold text-xs uppercase border border-brand-border">
                        SM
                      </div>
                      <div>
                        <p className="font-serif font-bold text-stone-900 text-sm">Sarah Montgomery</p>
                        <p className="text-xs text-stone-400 font-medium">14 Weeks Pregnant • Pilot Beta User</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-brand-border flex flex-col justify-between shadow-sm relative">
                    <div className="absolute top-6 right-8 text-5xl text-brand-sage/10 font-serif font-bold">“</div>
                    <p className="text-stone-600 italic leading-relaxed text-sm relative z-10 font-serif">
                      "As an OBGYN, my patients spend hours on Google searching product safety. Expecta streamlines that search beautifully using verified clinical databases. I highly recommend it at first prenatal visits."
                    </p>
                    <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-brand-border">
                      <div className="w-10 h-10 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center font-bold text-xs uppercase border border-brand-border">
                        ER
                      </div>
                      <div>
                        <p className="font-serif font-bold text-stone-900 text-sm">Dr. Elena Rostova, OBGYN</p>
                        <p className="text-xs text-stone-400 font-medium">Maternal Health Specialist & Consultant</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* PRICING SECTION */}
            <span id="pricing" className="block h-1"></span>
            <section className="py-20 md:py-28 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-bold">Flexible Value Tiers</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-terracotta mt-2 leading-tight">
                    Pricing Built to Support Your Pregnancy Journey
                  </h2>
                  <p className="text-stone-500 mt-4 text-sm">
                    Invest in clarity and safe habits. No hidden boundaries, cancel anytime.
                  </p>

                  {/* Toggle Annual/Monthly */}
                  <div className="inline-flex items-center space-x-3 mt-6 bg-brand-soft p-1.5 rounded-full border border-brand-border">
                    <button 
                      onClick={() => setBillingPeriod("monthly")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        billingPeriod === "monthly" ? "bg-brand-sage text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setBillingPeriod("annual")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        billingPeriod === "annual" ? "bg-brand-sage text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      Annual (Save 30%)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  
                  {/* Bait: Free Guide */}
                  <div className="bg-white p-8 rounded-2xl border border-brand-border flex flex-col justify-between text-left">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-stone-800">Pregnancy Safety Guide</h4>
                      <p className="text-[10px] text-brand-sage font-mono font-bold uppercase tracking-widest mt-1">Bait Offer</p>
                      <p className="text-xs text-stone-500 mt-4 leading-relaxed">
                        Downloadable PDF manual containing crucial safety regulations for expecting mothers.
                      </p>
                      <div className="mt-6 flex items-baseline">
                        <span className="text-4xl font-serif font-bold text-stone-900">$0</span>
                        <span className="text-xs text-stone-400 ml-2">free download</span>
                      </div>
                      
                      <ul className="mt-8 space-y-3.5 text-xs text-stone-500">
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Top 30 cosmetic ingredients to avoid</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Medication substitution checklist</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Printable diaper bag resource</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>10 times smartphone barcode/OCR scans</span>
                        </li>
                      </ul>
                    </div>
                    
                    <button className="w-full mt-8 py-3 bg-brand-soft hover:opacity-90 border border-brand-border text-stone-700 rounded-xl text-xs font-bold transition-colors">
                      Download PDF Guide
                    </button>
                  </div>

                  {/* Middle: Lifetime Core scanner (Early access) */}
                  <div className="bg-white p-8 rounded-2xl border-2 border-brand-sage flex flex-col justify-between text-left relative shadow-lg">
                    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-brand-sage text-white text-[10px] uppercase font-mono tracking-widest px-4 py-1 rounded-full font-bold">
                      Most Popular Offer
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-sage flex items-center space-x-1.5">
                        <span>Scanner Early Access</span>
                        <Sparkles className="w-4 h-4 text-brand-terracotta" />
                      </h4>
                      <p className="text-[10px] text-brand-terracotta font-mono font-bold uppercase tracking-widest mt-1">One-Time Lifetime Early Access</p>
                      <p className="text-xs text-stone-500 mt-4 leading-relaxed font-serif italic">
                        Full access to the active scanner engine, maternity profile adaptors, and obstetrician recommendations.
                      </p>
                      <div className="mt-6 flex items-baseline">
                        <span className="text-4xl font-serif font-bold text-stone-900">$99</span>
                        <span className="text-xs text-stone-400 ml-2">one-time investment</span>
                      </div>
                      <p className="text-[10px] text-brand-terracotta font-semibold mt-1">Normal retail price: $149 - $199</p>
 
                      <ul className="mt-8 space-y-3.5 text-xs text-stone-500">
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Unlimited smartphone barcode/OCR scans</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Adjustable maternity safety profile</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Equivalent safe ingredient recommender</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Direct links to clinical medical citations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Early pilot user beta community access</span>
                        </li>
                      </ul>
                    </div>
 
                    <button className="w-full mt-8 py-3 bg-brand-terracotta hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                      Claim Early Access ($99)
                    </button>
                  </div>

                  {/* Backend: Monthly subscription updates */}
                  <div className="bg-white p-8 rounded-2xl border border-brand-border flex flex-col justify-between text-left">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-stone-800">Continuous Database Support</h4>
                      <p className="text-[10px] text-brand-sage font-mono font-bold uppercase tracking-widest mt-1">Continuity Program</p>
                      <p className="text-xs text-stone-500 mt-4 leading-relaxed">
                        Keeps your safety databases synchronizing with newly issued toxicological papers and child safety ratings.
                      </p>
                      <div className="mt-6 flex items-baseline">
                        <span className="text-4xl font-serif font-bold text-stone-900">
                          {billingPeriod === "monthly" ? "$9.99" : "$5.99"}
                        </span>
                        <span className="text-xs text-stone-400 ml-2">/ month {billingPeriod === "annual" && "billed annually"}</span>
                      </div>
 
                      <ul className="mt-8 space-y-3.5 text-xs text-stone-500">
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Weekly updates of restricted compounds</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Lactation database integration</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Ask-A-Prenatal-Toxicologist portal</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-sage shrink-0" />
                          <span>Direct pediatric safety sync postpartum</span>
                        </li>
                      </ul>
                    </div>
 
                    <button className="w-full mt-8 py-3 bg-brand-soft hover:opacity-90 border border-brand-border text-stone-700 rounded-xl text-xs font-bold transition-colors">
                      Subscribe to Database Sync
                    </button>
                  </div>

                </div>

              </div>
            </section>

            {/* EXPANDABLE FAQ SECTION */}
            <section className="py-20 bg-brand-soft border-t border-brand-border">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                <div className="text-center mb-16">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-bold">Common Queries</span>
                  <h2 className="font-serif text-3xl text-brand-terracotta mt-2 leading-tight">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: "Is Expecta a certified medical device?",
                      a: "No. Expecta is an educational reference platform. All ingredient verdicts are direct mappings from peer-reviewed databases (such as MotherToBaby, LactMed, ACOG, and FDA classifications). It is designed to assist your shopping confidence, but should never replace direct consultation with your personal obstetrician or midwife."
                    },
                    {
                      q: "How does the app handle ingredients with conflicting scientific studies?",
                      a: "Our algorithm enforces absolute clinical caution. If studies disagree or evidence is incomplete, the app flags the compound with a Caution or Avoid warning, detailing the exact nature of the scientific dispute so you and your doctor can easily decide."
                    },
                    {
                      q: "Can I use the scanner while breastfeeding?",
                      a: "Yes. Expecta's database incorporates extensive postpartum and lactation records sourced from LactMed, tracking active compound excretion ratios and infant gastrointestinal absorption indexes."
                    },
                    {
                      q: "Does it work on physical barcodes, or just the text labels?",
                      a: "Version one scans both! If a product is registered in our barcode database, pointing your camera at the barcode pulls the formulation instantly. If the product is not in our database, our OCR scan maps the raw ingredients list directly off the physical label."
                    },
                    {
                      q: "How do I access the lifetime early offer?",
                      a: "Our Early Access Sandbox is open now for $99. This triggers immediate, unlimited scanning on our pilot backend database and guarantees free, lifetime updates to all future versions without monthly continuity fees."
                    }
                  ].map((faq, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-xl border border-brand-border overflow-hidden transition-all text-left"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-5 flex justify-between items-center text-left hover:bg-brand-soft/20 transition-colors focus:outline-none"
                      >
                        <span className="font-serif font-bold text-stone-900 pr-4">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-brand-sage transition-transform duration-200 shrink-0 ${expandedFaq === idx ? "transform rotate-180" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-5 pt-0 text-xs text-stone-600 border-t border-brand-border bg-brand-soft/40 leading-relaxed font-serif italic">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* FINAL CTA SECTION */}
            <section className="bg-brand-sage text-white py-20 relative overflow-hidden border-t border-brand-border">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,122,91,0.12),transparent)]"></div>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
                
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
                  Never Guess Your Safety Thresholds Again
                </h2>
                
                <p className="text-sm sm:text-base text-brand-soft max-w-3xl mx-auto leading-relaxed font-serif italic">
                  Join 5,000+ early expectant mothers establishing stress-free grocery habits. Secure your early lifetime access for just $99 today.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="#scanner-box"
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-terracotta hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition-all text-center"
                  >
                    Try Sandbox Scanner
                  </a>
                  <a 
                    href="#pricing"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 transition-all text-center"
                  >
                    Claim Lifetime Early Access ($99)
                  </a>
                </div>

                <p className="text-xs text-brand-soft/70 pt-2 font-mono">
                  🛡️ 14-day absolute money-back safety guarantee. Grounded in peer-reviewed science.
                </p>

              </div>
            </section>

          </motion.div>
        ) : (
          
          /* DEVELOPER BLUEPRINT SPEC VIEW */
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            
            {/* Spec Header */}
            <div className="bg-brand-sage text-brand-beige p-8 rounded-3xl text-left space-y-4 mb-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-terracotta/15 rounded-full filter blur-2xl transform translate-x-12 -translate-y-12"></div>
              
              <div className="inline-block bg-brand-terracotta/20 border border-brand-terracotta/30 rounded-full px-3 py-1 text-brand-terracotta text-xs font-mono font-semibold uppercase">
                Ready for Hand-off to Developer or AI Builder
              </div>
              
              <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
                Expecta Landing Page Blueprint & Technical Spec
              </h1>
              
              <p className="text-brand-beige/80 text-sm max-w-4xl leading-relaxed">
                This blueprint organizes all landing page copy, layout guidelines, user psychological triggers, and technical components. Use the <strong>Copy Section</strong> buttons to easily import separate sections directly into your development workflow.
              </p>
            </div>

            {/* Interactive Blueprint Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* Left Column: Guidelines, Color Codes, Fonts */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-white p-6 rounded-2xl border border-brand-border space-y-4">
                  <h3 className="font-serif font-bold text-stone-900 border-b border-brand-border pb-2 text-base">
                    Aesthetic & Style Pairing
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-mono text-[10px] text-stone-400 uppercase font-bold">Recommended Palette</p>
                      <div className="grid grid-cols-4 gap-2 mt-1.5">
                        <div className="space-y-1 text-center">
                          <div className="h-8 rounded bg-[#FDFCFB] border border-brand-border"></div>
                          <span className="font-mono text-[9px]">#FDFCFB</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <div className="h-8 rounded bg-[#5D7052]"></div>
                          <span className="font-mono text-[9px]">#5D7052</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <div className="h-8 rounded bg-[#C97A5B]"></div>
                          <span className="font-mono text-[9px]">#C97A5B</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <div className="h-8 rounded bg-[#EAE7E2]"></div>
                          <span className="font-mono text-[9px]">#EAE7E2</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] text-stone-400 uppercase font-bold mt-3">Typography Pairing</p>
                      <ul className="mt-1 space-y-1 text-stone-600 leading-normal font-serif italic">
                        <li><strong>Display:</strong> Lora (Display Serif)</li>
                        <li><strong>Body:</strong> Inter (Modern Sans)</li>
                        <li><strong>Accents:</strong> JetBrains Mono</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] text-stone-400 uppercase font-bold mt-3">Copywriting Guidelines</p>
                      <ul className="mt-1 list-disc list-inside space-y-1 text-stone-600 leading-relaxed">
                        <li><strong>Tone:</strong> Clinical yet highly reassuring</li>
                        <li><strong>Reading Level:</strong> 8th grade accessibility</li>
                        <li><strong>Scannability:</strong> Broad bullet points, color-coded badges, large display numbers</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-brand-border space-y-4">
                  <h3 className="font-serif font-bold text-stone-900 border-b border-brand-border pb-2 text-base">
                    Technical Architecture
                  </h3>
                  
                  <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                    <p>
                      <strong>Backend Interface:</strong> Full-stack architecture (Express proxying Gemini SDK) to prevent leaking critical secret API keys to browser scripts.
                    </p>
                    <p>
                      <strong>Database Moat:</strong> Aggregates MotherToBaby factsheets, LactMed API entries, ACOG publications, and clinical trials on a category-by-category basis.
                    </p>
                    <p>
                      <strong>Form Handling:</strong> Supports both manual raw chemical listing textarea input and high-definition mobile optical character recognition scanning.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Complete Copy Sections */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Hero section blueprint */}
                <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                  <div className="bg-brand-soft px-6 py-4 border-b border-brand-border flex justify-between items-center">
                    <h3 className="font-serif font-bold text-brand-sage text-base">
                      {blueprintData.hero.title}
                    </h3>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(blueprintData.hero, null, 2), "hero")}
                      className="px-3 py-1 bg-white border border-brand-border hover:border-brand-sage text-[11px] font-semibold rounded-lg transition-all flex items-center space-x-1 text-stone-600 hover:text-brand-sage cursor-pointer"
                    >
                      {copiedSection === "hero" ? <Check className="w-3.5 h-3.5 text-brand-sage" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "hero" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Layout Instruction</p>
                      <p className="mt-1">{blueprintData.hero.layout}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Primary Headline</p>
                      <p className="mt-1 font-semibold text-brand-sage text-sm">{blueprintData.hero.headline}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Subheadline</p>
                      <p className="mt-1">{blueprintData.hero.subheadline}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Hero Interactive Content Spec</p>
                      <p className="mt-1">{blueprintData.hero.heroImageDesc}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Primary CTA Button</p>
                      <p className="mt-1 font-semibold text-brand-terracotta">{blueprintData.hero.primaryCta}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Social Proof</p>
                      <p className="mt-1">{blueprintData.hero.socialProof}</p>
                    </div>
                  </div>
                </div>

                {/* Problem Section Blueprint */}
                <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                  <div className="bg-brand-soft px-6 py-4 border-b border-brand-border flex justify-between items-center">
                    <h3 className="font-serif font-bold text-brand-sage text-base">
                      {blueprintData.pain.title}
                    </h3>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(blueprintData.pain, null, 2), "pain")}
                      className="px-3 py-1 bg-white border border-brand-border hover:border-brand-sage text-[11px] font-semibold rounded-lg transition-all flex items-center space-x-1 text-stone-600 hover:text-brand-sage cursor-pointer"
                    >
                      {copiedSection === "pain" ? <Check className="w-3.5 h-3.5 text-brand-sage" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "pain" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Section Headline</p>
                      <p className="mt-1 font-semibold text-brand-sage text-sm">{blueprintData.pain.headline}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Pain Points copywriting</p>
                      <div className="mt-2 space-y-2.5">
                        {blueprintData.pain.bullets.map((bullet, i) => (
                          <div key={i} className="pl-3 border-l-2 border-brand-terracotta">
                            <p className="font-semibold text-stone-900">{bullet.title}</p>
                            <p className="text-stone-600 mt-0.5">{bullet.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Pain Section Visual Element</p>
                      <p className="mt-1">{blueprintData.pain.visualTreatment}</p>
                    </div>
                  </div>
                </div>

                {/* Solution Overview Blueprint */}
                <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                  <div className="bg-brand-soft px-6 py-4 border-b border-brand-border flex justify-between items-center">
                    <h3 className="font-serif font-bold text-brand-sage text-base">
                      {blueprintData.solution.title}
                    </h3>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(blueprintData.solution, null, 2), "solution")}
                      className="px-3 py-1 bg-white border border-brand-border hover:border-brand-sage text-[11px] font-semibold rounded-lg transition-all flex items-center space-x-1 text-stone-600 hover:text-brand-sage cursor-pointer"
                    >
                      {copiedSection === "solution" ? <Check className="w-3.5 h-3.5 text-brand-sage" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "solution" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Section Headline</p>
                      <p className="mt-1 font-semibold text-brand-sage text-sm">{blueprintData.solution.headline}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Value Proposition Explanation</p>
                      <p className="mt-1">{blueprintData.solution.valueProp}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Core Benefits</p>
                      <div className="mt-2 space-y-2.5">
                        {blueprintData.solution.bullets.map((bullet, i) => (
                          <div key={i} className="pl-3 border-l-2 border-emerald-600">
                            <p className="font-semibold text-stone-900">{bullet.title}</p>
                            <p className="text-stone-600 mt-0.5">{bullet.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* How it Works Blueprint */}
                <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                  <div className="bg-brand-soft px-6 py-4 border-b border-brand-border flex justify-between items-center">
                    <h3 className="font-serif font-bold text-brand-sage text-base">
                      {blueprintData.howItWorks.title}
                    </h3>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(blueprintData.howItWorks, null, 2), "howItWorks")}
                      className="px-3 py-1 bg-white border border-brand-border hover:border-brand-sage text-[11px] font-semibold rounded-lg transition-all flex items-center space-x-1 text-stone-600 hover:text-brand-sage cursor-pointer"
                    >
                      {copiedSection === "howItWorks" ? <Check className="w-3.5 h-3.5 text-brand-sage" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "howItWorks" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Section Headline</p>
                      <p className="mt-1 font-semibold text-brand-sage text-sm">{blueprintData.howItWorks.headline}</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 font-mono text-[10px] uppercase tracking-wider text-stone-400">Sequence Steps</p>
                      <div className="mt-2 space-y-3">
                        {blueprintData.howItWorks.steps.map((step, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <span className="w-5 h-5 rounded-full bg-brand-sage text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {step.step}
                            </span>
                            <div>
                              <p className="font-semibold text-stone-900">{step.title}</p>
                              <p className="text-stone-600 mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Blueprint */}
                <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                  <div className="bg-brand-soft px-6 py-4 border-b border-brand-border flex justify-between items-center">
                    <h3 className="font-serif font-bold text-brand-sage text-base">
                      {blueprintData.pricing.title}
                    </h3>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(blueprintData.pricing, null, 2), "pricing")}
                      className="px-3 py-1 bg-white border border-brand-border hover:border-brand-sage text-[11px] font-semibold rounded-lg transition-all flex items-center space-x-1 text-stone-600 hover:text-brand-sage cursor-pointer"
                    >
                      {copiedSection === "pricing" ? <Check className="w-3.5 h-3.5 text-brand-sage" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "pricing" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
                    <div className="space-y-4">
                      {blueprintData.pricing.tiers.map((tier, i) => (
                        <div key={i} className="p-4 bg-brand-soft/50 rounded-xl border border-brand-border">
                          <div className="flex justify-between items-start border-b pb-2 mb-2">
                            <div>
                              <p className="font-bold text-stone-900 text-sm">{tier.name}</p>
                              <p className="text-[10px] text-stone-400 font-mono">Best for: {tier.bestFor}</p>
                            </div>
                            <p className="font-bold text-brand-terracotta text-sm">{tier.price} <span className="text-[10px] font-normal text-stone-500">{tier.billing}</span></p>
                          </div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Included Core Features:</p>
                          <ul className="mt-1 list-disc list-inside space-y-0.5 text-stone-600 pl-1">
                            {tier.features.map((feat, fIdx) => (
                              <li key={fIdx}>{feat}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ blueprint */}
                <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                  <div className="bg-brand-soft px-6 py-4 border-b border-brand-border flex justify-between items-center">
                    <h3 className="font-serif font-bold text-brand-sage text-base">
                      {blueprintData.faq.title}
                    </h3>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(blueprintData.faq, null, 2), "faq")}
                      className="px-3 py-1 bg-white border border-brand-border hover:border-brand-sage text-[11px] font-semibold rounded-lg transition-all flex items-center space-x-1 text-stone-600 hover:text-brand-sage cursor-pointer"
                    >
                      {copiedSection === "faq" ? <Check className="w-3.5 h-3.5 text-brand-sage" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "faq" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
                    <div className="space-y-3.5">
                      {blueprintData.faq.items.map((item, i) => (
                        <div key={i} className="space-y-1">
                          <p className="font-semibold text-stone-900">Q: {item.q}</p>
                          <p className="text-stone-600 pl-4 border-l border-stone-200">A: {item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-brand-soft text-stone-600 pt-16 pb-12 border-t border-brand-border text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-brand-border">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-stone-900">
                <div className="w-8 h-8 rounded-lg bg-brand-sage flex items-center justify-center text-white">
                  <Scan className="w-4.5 h-4.5" />
                </div>
                <span className="font-serif font-bold text-lg tracking-tight">Expecta</span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-stone-500">
                AI-powered pregnancy and nursing safety scanner that decodes raw ingredient packaging against certified medical consensus databases. Built with care for expectant mothers.
              </p>
            </div>

            <div>
              <h5 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-4">Maternal Resources</h5>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-brand-sage transition-colors">MotherToBaby Guidelines</a></li>
                <li><a href="#" className="hover:text-brand-sage transition-colors">LactMed Database Portal</a></li>
                <li><a href="#" className="hover:text-brand-sage transition-colors">ACOG Prenatal Guidelines</a></li>
                <li><a href="#" className="hover:text-brand-sage transition-colors">FDA Pregnancy Classifications</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-4">Company</h5>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-brand-sage transition-colors">About our Database Moat</a></li>
                <li><a href="#" className="hover:text-brand-sage transition-colors">Clinical Advisory Board</a></li>
                <li><a href="#" className="hover:text-brand-sage transition-colors">Privacy & HIPAA Security</a></li>
                <li><a href="#" className="hover:text-brand-sage transition-colors">Early Sandbox Access</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-4">Medical Disclaimer</h5>
              <p className="text-[11px] leading-relaxed text-stone-400">
                All Expecta database grades represent general clinical consensus and toxicological trials. They do not constitute direct medical advice. Always consult your obstetrician, certified nurse midwife, or clinical practitioner for personalized guidelines.
              </p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 space-y-4 sm:space-y-0">
            <p>© 2026 Expecta Inc. All maternal rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-brand-sage transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-brand-sage transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-sage transition-colors">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
