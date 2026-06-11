import { ImageResponse } from "next/og";

// Runtime edge evita o bug do @vercel/og no Windows (fileURLToPath/Invalid URL).
export const runtime = "edge";

// Imagem de compartilhamento social (OG + Twitter). Gerada pelo Next.
export const alt = "TOCSOLAR Energia Solar — Energia solar que realmente economiza";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#1A1A1A",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              backgroundColor: "#F59E0B",
            }}
          />
          TOCSOLAR Energia Solar
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: 40,
            maxWidth: 900,
          }}
        >
          <span style={{ marginRight: 16 }}>Energia solar que</span>
          <span style={{ color: "#F59E0B" }}>realmente economiza</span>
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "#cccccc", marginTop: 28 }}>
          Do orçamento à instalação — Fortaleza/CE
        </div>
      </div>
    ),
    { ...size },
  );
}
