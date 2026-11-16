import { ImageResponse } from "next/og";

export const alt = "Depthyard. Concrete, gravel, mulch, and paint quantities.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f0e6",
          color: "#1c1915",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a3412" }}>
          Depthyard
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
          Concrete, gravel, mulch, and paint quantities
        </div>
        <div style={{ fontSize: 28, color: "#5e584e" }}>Cubic yards, bags, tons, and gallons.</div>
      </div>
    ),
    { ...size },
  );
}
