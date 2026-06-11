import { ImageResponse } from "next/og";

// Runtime edge evita o bug do @vercel/og no Windows (fileURLToPath/Invalid URL).
export const runtime = "edge";

// Favicon gerado — marca grafite com "sol" laranja.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1A1A",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 9999,
            backgroundColor: "#F59E0B",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
