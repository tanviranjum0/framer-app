import { ImageResponse } from "next/og";

/**
 * Social card, generated at build time.
 *
 * Rendering it here means there is no static 1200×630 PNG to keep in sync
 * with the copy, and no extra asset in `public/`.
 */
export const alt = "Motion Lab — production-ready animation patterns for React";
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
          justifyContent: "space-between",
          background: "#04090a",
          padding: "72px",
          fontFamily: "sans-serif",
          // Matches the gridded plane used across the site.
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#5ff2c0",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#8da3a4",
            }}
          >
            Motion Lab
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 112,
              fontWeight: 600,
              letterSpacing: -5,
              lineHeight: 1,
              color: "#e9f2f1",
              display: "flex",
            }}
          >
            Motion,{" "}
            <span style={{ color: "#5ff2c0", marginLeft: 24 }}>engineered.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#8da3a4",
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            Twelve scroll, drag and spring interaction patterns for React —
            compositor-only, touch-aware, reduced-motion safe.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 22,
            color: "#536466",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 28,
          }}
        >
          <span>Next.js 16</span>
          <span>Motion for React</span>
          <span>Tailwind CSS 4</span>
        </div>
      </div>
    ),
    size,
  );
}
