interface Props {
  valence?: number;
  arousal?: number;
}

export default function EmotionMap({
  valence = 0,
  arousal = 0,
}: Props) {

  const valenceScaled = valence;
  const arousalScaled = arousal;

  const x = ((valenceScaled + 1) / 2) * 100;
  const y = ((1 - arousalScaled) / 2) * 100;

  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl p-6 border border-white/10">
      <h2 className="font-bold mb-4">
        Valence-Arousal Space
      </h2>

      <div className="relative h-64 rounded-2xl border border-white/10 overflow-hidden">
        
        {/* GRID CROSS */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-white/10" />
        <div className="absolute top-1/2 left-0 h-px w-full bg-white/10" />

        {/* QUADRANT LABELS */}
        <div className="absolute top-3 right-3 text-xs opacity-70">
          Happy / Excited
        </div>

        <div className="absolute top-3 left-3 text-xs opacity-70">
          Angry / Tense
        </div>

        <div className="absolute bottom-3 left-3 text-xs opacity-70">
          Sad
        </div>

        <div className="absolute bottom-3 right-3 text-xs opacity-70">
          Relaxed
        </div>

        {/* CENTER POINT (0,0) */}
        <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />

        {/* USER POINT */}
        <div
          className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 transition-all duration-500"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* TRAIL */}
        <div
          className="absolute w-8 h-8 bg-cyan-400/20 rounded-full blur-md"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* VALUE DISPLAY */}
      <div className="mt-4 text-sm opacity-70 flex justify-between">
        <span>Valence: {valenceScaled.toFixed(2)}</span>
        <span>Arousal: {arousalScaled.toFixed(2)}</span>
      </div>
    </div>
  );
}