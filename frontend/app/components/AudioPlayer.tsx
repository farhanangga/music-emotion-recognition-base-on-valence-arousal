interface Props {
  audioUrl: string;
  fileName: string;
}

export default function AudioPlayer({
  audioUrl,
  fileName,
}: Props) {
  return (
    <div
      className="
      rounded-3xl
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      p-6
    "
    >
      <h2
        className="
        text-lg
        font-bold
        mb-4
      "
      >
        Audio Preview
      </h2>

      <p
        className="
        text-sm
        opacity-70
        mb-4
        truncate
      "
      >
        {fileName}
      </p>

      <audio
        controls
        className="
        w-full
      "
      >
        <source
          src={audioUrl}
        />

        Browser tidak mendukung
        audio player.
      </audio>
    </div>
  );
}