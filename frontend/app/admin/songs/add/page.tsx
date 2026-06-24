"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import UploadCard from "@/app/components/uploadCard";
import AudioPlayer from "@/app/components/AudioPlayer";
import Footer from "@/app/components/Footer";

import { supabase } from "@/app/lib/supabase";

export default function AddSongPage() {
const router = useRouter();

const [authChecked, setAuthChecked] =
useState(false);

const fileInputRef =
useRef<HTMLInputElement>(null);

const [title, setTitle] =
useState("");

const [singer, setSinger] =
useState("");

const [genre, setGenre] =
useState("");

const [file, setFile] =
useState<File | null>(null);

const [audioUrl, setAudioUrl] =
useState("");

const [valence, setValence] =
useState<number | null>(null);

const [arousal, setArousal] =
useState<number | null>(null);

const [
loadingPredict,
setLoadingPredict,
] = useState(false);

const [
loadingSave,
setLoadingSave,
] = useState(false);

useEffect(() => {
const isAuth =
localStorage.getItem("auth");

if (!isAuth) {
  router.push("/login");
} else {
  setAuthChecked(true);
}

}, [router]);

useEffect(() => {
return () => {
if (audioUrl) {
URL.revokeObjectURL(audioUrl);
}
};
}, [audioUrl]);

function handleFile(
selectedFile: File
) {
if (audioUrl) {
URL.revokeObjectURL(audioUrl);
}

const previewUrl =
  URL.createObjectURL(
    selectedFile
  );

setFile(selectedFile);
setAudioUrl(previewUrl);

setValence(null);
setArousal(null);
}

function handleFileSelect(
e: React.ChangeEvent<HTMLInputElement>
) {
if (!e.target.files?.length)
return;

handleFile(
  e.target.files[0]
);

}

function handleDrop(
e: React.DragEvent<HTMLDivElement>
) {
e.preventDefault();

const droppedFile =
  e.dataTransfer.files[0];

if (!droppedFile)
  return;

handleFile(droppedFile);

}

function handleDragOver(
e: React.DragEvent<HTMLDivElement>
) {
e.preventDefault();
}

async function analyzeEmotion() {
if (!file) return;

try {
  setLoadingPredict(true);

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
     `${process.env.NEXT_PUBLIC_API_MER_URL}/predict`,
      {
        method: "POST",
        body: formData,
      }
    );

  if (!response.ok) {
    throw new Error(
      "Prediction failed"
    );
  }

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      "Prediction failed"
    );
  }

  setValence(
    Number(data.valence)
  );

  setArousal(
    Number(data.arousal)
  );

} catch (error) {
  console.error(error);

  alert(
    "Failed to analyze emotion."
  );

} finally {
  setLoadingPredict(false);
}

}

async function saveSong() {
if (
!title.trim() ||
!singer.trim() ||
!genre.trim()
) {
alert(
"Please complete all information."
);
return;
}

if (!file) {
  alert(
    "Please upload audio."
  );
  return;
}

if (
  valence === null ||
  arousal === null
) {
  alert(
    "Please analyze emotion first."
  );
  return;
}

try {
  setLoadingSave(true);

  const fileName =
    `${Date.now()}-${file.name}`;

  const filePath =
    `songs/${fileName}`;

  const {
    error: uploadError,
  } =
    await supabase.storage
      .from("audioStorage")
      .upload(
        filePath,
        file
      );

  if (uploadError) {
    console.error(
      "UPLOAD ERROR:",
      uploadError
    );

    throw new Error(
      uploadError.message ||
      "Upload failed"
    );
  }

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from("audioStorage")
      .getPublicUrl(
        filePath
      );

  const publicUrl =
    publicUrlData.publicUrl;

  const { error } =
    await supabase
      .from("music")
      .insert({
        title,
        singer,
        genre,
        valence,
        arousal,
        audio_url:
          publicUrl,
      });

  if (error) {
    console.error(
      "INSERT ERROR:",
      error
    );

    throw new Error(
      error.message ||
      "Insert failed"
    );
  }

  alert(
    "Song added successfully."
  );

  setTitle("");
  setSinger("");
  setGenre("");

  setFile(null);

  if (audioUrl) {
    URL.revokeObjectURL(
      audioUrl
    );
  }

  setAudioUrl("");

  setValence(null);
  setArousal(null);

  if (
    fileInputRef.current
  ) {
    fileInputRef.current.value =
      "";
  }

} catch (error) {
  console.error(error);

  alert(
    "Failed to save song."
  );

} finally {
  setLoadingSave(false);
}

}

if (!authChecked) {
return ( <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white"> <Loader2 className="animate-spin" /> </div>
);
}

return ( <main className="min-h-screen bg-[#050816] text-white p-6 relative overflow-hidden">

  <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px]" />

  <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[180px]" />

  <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={
          handleFileSelect
        }
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-8">
          Add New Song
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT */}

          <div className="space-y-6">

            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">

              <h2 className="text-xl font-bold mb-5">
                Song Information
              </h2>

              <div className="space-y-4">

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="Song Title"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
                />

                <input
                  value={singer}
                  onChange={(e) =>
                    setSinger(
                      e.target.value
                    )
                  }
                  placeholder="Singer"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
                />

                <input
                  value={genre}
                  onChange={(e) =>
                    setGenre(
                      e.target.value
                    )
                  }
                  placeholder="Genre"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
                />
              </div>
            </div>

            <UploadCard
              file={file}
              onClick={() =>
                fileInputRef.current?.click()
              }
              onDrop={
                handleDrop
              }
              onDragOver={
                handleDragOver
              }
            />
          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">

              <h2 className="text-xl font-bold mb-5">
                Audio Preview
              </h2>

              {audioUrl &&
              file ? (
                <AudioPlayer
                  audioUrl={
                    audioUrl
                  }
                  fileName={
                    file.name
                  }
                />
              ) : (
                <div className="h-28 flex items-center justify-center text-white/50">
                  No audio selected
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">

              <h2 className="text-xl font-bold mb-5">
                Emotion Analysis
              </h2>

              <button
                onClick={
                  analyzeEmotion
                }
                disabled={
                  !file ||
                  loadingPredict
                }
                className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 disabled:opacity-50 flex items-center justify-center"
              >
                {loadingPredict ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Analyze Emotion"
                )}
              </button>

              <div className="grid grid-cols-2 gap-4 mt-5">

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">
                    Valence
                  </p>

                  <p className="text-3xl font-bold">
                    {valence !==
                    null
                      ? valence.toFixed(
                          3
                        )
                      : "-"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">
                    Arousal
                  </p>

                  <p className="text-3xl font-bold">
                    {arousal !==
                    null
                      ? arousal.toFixed(
                          3
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={saveSong}
              disabled={
                loadingSave
              }
              className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingSave ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Save Song
                </>
              )}
            </button>

          </div>
        </div>
      </div>
      <Footer/>
</main>

);
}
