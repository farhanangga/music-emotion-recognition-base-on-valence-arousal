export default function ModelInfo() {
  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl p-6">
      <h2 className="font-bold text-lg mb-6">
        AI Model
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm opacity-60">
            Architecture
          </p>

          <p className="font-semibold mt-1">
            CNN
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm opacity-60">
            Input
          </p>

          <p className="font-semibold mt-1">
            Mel Spectrogram
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm opacity-60">
            Resolution
          </p>

          <p className="font-semibold mt-1">
            128×128
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm opacity-60">
            Output
          </p>

          <p className="font-semibold mt-1">
            V + A
          </p>
        </div>
      </div>
    </div>
  );
}