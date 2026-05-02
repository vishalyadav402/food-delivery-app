import { supabase } from "./supabase";

export const uploadToStorage = async (file, bucket) => {
  try {
    console.log("📂 FILE RECEIVED:", file);

    if (!file) {
      alert("No file selected ❌");
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    console.log("📤 Uploading:", fileName);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ UPLOAD ERROR:", error);
      alert(error.message); // IMPORTANT
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log("✅ FINAL PUBLIC URL:", data.publicUrl);

    return data.publicUrl;
  } catch (err) {
    console.error("🔥 UPLOAD CRASH:", err);
    alert("Upload crashed ❌");
    return null;
  }
};