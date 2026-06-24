"use client";

import { useRef, useState, useEffect } from "react";

import Navbar from "@/app/components/navbar";
import UploadCard from "@/app/components/uploadCard";
import ResultCard from "@/app/components/ResultCard";
import ModelInfo from "@/app/components/ModelInfo";
import SystemStatus from "@/app/components/SystemStatus";
import EmotionMap from "@/app/components/EmotionMap";
import AudioPlayer from "@/app/components/AudioPlayer";
import Footer from "@/app/components/Footer";

export default function Home() {
  
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] =
    useState(true);

  const [file, setFile] =
    useState<File | null>(null);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [apiStatus, setApiStatus] =
    useState("Checking...");

  const [result, setResult] = useState<{
    success: boolean;
    valence: number;
    arousal: number;
  } | null>(null);

  useEffect(() => {
    checkBackend();
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  async function checkBackend() {
    try {
      const res = await fetch(
        "http://localhost:8000/health"
      );

      if (res.ok) {
        setApiStatus("Online");
      } else {
        setApiStatus("Offline");
      }
    } catch {
      setApiStatus("Offline");
    }
  }

  function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    const selectedFile =
      e.target.files[0];

    setFile(selectedFile);

    setAudioUrl(
      URL.createObjectURL(
        selectedFile
      )
    );

    setResult(null);
  }

  function handleDrop(
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();

    const droppedFile =
      e.dataTransfer.files[0];

    if (!droppedFile) return;

    setFile(droppedFile);

    setAudioUrl(
      URL.createObjectURL(
        droppedFile
      )
    );

    setResult(null);
  }

  function handleDragOver(
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
  }

  async function handlePredict() {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const response = await fetch(
        "http://localhost:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  function getEmotion(
    valence: number,
    arousal: number
  ) {
    const V_THRESHOLD = 0.5;
    const A_THRESHOLD = 0.5;

    // Q1: High Valence, High Arousal
    if (
      valence >= V_THRESHOLD &&
      arousal >= A_THRESHOLD
    ) {
      return "Happy / Excited";
    }

    // Q2: Low Valence, High Arousal
    if (
      valence < V_THRESHOLD &&
      arousal >= A_THRESHOLD
    ) {
      return "Angry / Tense";
    }

    // Q3: Low Valence, Low Arousal
    if (
      valence < V_THRESHOLD &&
      arousal < A_THRESHOLD
    ) {
      return "Sad";
    }

    // Q4: High Valence, Low Arousal
    return "Relaxed";
  }

  return (
    <main
      className={`min-h-screen relative overflow-hidden transition-all duration-300
        ${
          darkMode
            ? "bg-[#050816] text-white"
            : "bg-slate-100 text-black"
        }
      `}
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px]"/>
      <div className=" absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[180px]"/>
      {/* NAVBAR */}
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() =>
          setDarkMode(!darkMode)
        }
      />
      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <div className=" inline-flex px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm">
            AI Music Emotion Recognition
          </div>
          <h1 className=" mt-6 text-5xl font-bold">
            Analyze Emotion From Music
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-slate-400">
            Detect emotional characteristics of music using a Convolutional
            Neural Network with Valence-Arousal representation.
          </p>
        </div>
      </section>
      {/* HIDDEN INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <UploadCard
              file={file}
              onClick={() =>fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
            {audioUrl && file && (
              <AudioPlayer audioUrl={audioUrl} fileName={file.name}/>
            )}
            <button
              disabled={!file || loading}
              onClick={handlePredict}
              className=" w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 
              font-semibold hover:scale-[1.01] transition disabled:opacity-50">
              {loading ? (
                <div className="flex items-center justify-center gap-3 ">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Analyzing Music...
                </div>
              ) : (
                "Analyze Emotion"
              )}
            </button>
            {result?.success && (
              <ResultCard
                valence={result.valence}
                arousal={result.arousal}
                emotion={getEmotion(result.valence,result.arousal)}/>
              )}
          </div>
          {/* RIGHT */}
          <div className="space-y-6">
            <SystemStatus status={apiStatus}/>
            <div
              className=" rounded-3xl bg-white/5 backdrop-blur-xl p-6  " >
              <h2 className=" font-bold mb-5">Dataset Summary</h2>
              <div className=" grid grid-cols-2gap-4">
                <div>
                  <p className="text-sm opacity-60">  Input</p>
                  <p className="font-bold">Mel Spectrogram</p>
                </div>
                <div>
                  <p className="text-sm opacity-60"> Output</p>
                  <p className="font-bold"> Valence + Arousal</p>
                </div>
                <div>
                  <p className="text-sm opacity-60">Sample Rate </p>
                  <p className="font-bold"> 22050 Hz</p>
                </div>
                <div>
                  <p className="text-sm opacity-60">Duration</p>
                  <p className="font-bold">30 Seconds</p>
                </div>
              </div>
            </div>
            <ModelInfo />
            <EmotionMap valence={result?.valence} arousal={result?.arousal}/>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
