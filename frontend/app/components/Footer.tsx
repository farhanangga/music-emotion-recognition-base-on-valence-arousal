export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="font-bold">
            Music Emotion Recognition
          </h3>

          <p className="text-sm opacity-60 mt-1">
            CNN-Based Valence Arousal
            Emotion Detection
          </p>
        </div>

        <div className="text-sm opacity-60">
          Developed using Next.js,
          FastAPI, TensorFlow,
          Librosa and Tailwind CSS.
        </div>
      </div>
    </footer>
  );
}