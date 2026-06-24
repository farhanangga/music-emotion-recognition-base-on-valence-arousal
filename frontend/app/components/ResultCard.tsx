interface Props {
  valence: number;
  arousal: number;
  emotion: string;
}

export default function ResultCard({
  valence,
  arousal,
  emotion,
}: Props) {
  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl p-6">
      <h2 className="font-bold text-lg mb-5">
        Emotion Analysis
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-cyan-500/10">
          <p className="text-sm opacity-60">
            Valence
          </p>

          <h3 className="text-3xl font-bold">
            {valence.toFixed(2)}
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-purple-500/10">
          <p className="text-sm opacity-60">
            Arousal
          </p>

          <h3 className="text-3xl font-bold">
            {arousal.toFixed(2)}
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-green-500/10">
          <p className="text-sm opacity-60">
            Emotion
          </p>

          <h3 className="text-2xl font-bold">
            {emotion}
          </h3>
        </div>
      </div>
    </div>
  );
}