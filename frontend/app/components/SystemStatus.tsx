interface Props {
  status: string;
}

export default function SystemStatus({
  status,
}: Props) {
  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl p-6">
      <h2 className="font-bold mb-5">
        System
      </h2>

      <div className="flex items-center justify-between">
        <span>Backend API</span>

        <span
          className={
            status === "Online"
              ? "text-green-400"
              : "text-red-400"
          }
        >
          ● {status}
        </span>
      </div>
    </div>
  );
}