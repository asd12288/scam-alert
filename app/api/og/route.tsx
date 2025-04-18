import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get dynamic parameters from the request
  const title = searchParams.get("title") || "Scam Protector";
  const description =
    searchParams.get("description") ||
    "Detect online scams and protect yourself";
  const type = searchParams.get("type") || "default";

  // Load the custom font
  const interBold = await fetch(
    new URL("../../../public/fonts/Inter-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const interRegular = await fetch(
    new URL("../../../public/fonts/Inter-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  // Generate different OG images based on type
  switch (type) {
    case "scan":
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8fafc",
              backgroundImage:
                "radial-gradient(circle at 25px 25px, #e0e7ff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e0e7ff 2%, transparent 0%)",
              backgroundSize: "100px 100px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                width: "80%",
                maxWidth: "900px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div
                  style={{
                    marginLeft: "16px",
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#2563eb",
                  }}
                >
                  Scam Protector
                </div>
              </div>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "16px",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#64748b",
                  textAlign: "center",
                  maxWidth: "800px",
                }}
              >
                {description}
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: "Inter",
              data: interBold,
              style: "normal",
              weight: 700,
            },
            {
              name: "Inter",
              data: interRegular,
              style: "normal",
              weight: 400,
            },
          ],
        }
      );

    case "guide":
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#eff6ff",
              backgroundImage:
                "linear-gradient(45deg, #dbeafe 25%, transparent 25%), linear-gradient(-45deg, #dbeafe 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dbeafe 75%), linear-gradient(-45deg, transparent 75%, #dbeafe 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                width: "80%",
                maxWidth: "900px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div
                  style={{
                    marginLeft: "16px",
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#2563eb",
                  }}
                >
                  Scam Protector
                </div>
              </div>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "16px",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#64748b",
                  textAlign: "center",
                  maxWidth: "800px",
                }}
              >
                {description}
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: "Inter",
              data: interBold,
              style: "normal",
              weight: 700,
            },
            {
              name: "Inter",
              data: interRegular,
              style: "normal",
              weight: 400,
            },
          ],
        }
      );

    default:
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle at 25px 25px, #f0f9ff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f9ff 2%, transparent 0%)",
              backgroundSize: "100px 100px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div
                style={{
                  marginLeft: "24px",
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                Scam Protector
              </div>
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#64748b",
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              {description}
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: "Inter",
              data: interBold,
              style: "normal",
              weight: 700,
            },
            {
              name: "Inter",
              data: interRegular,
              style: "normal",
              weight: 400,
            },
          ],
        }
      );
  }
}
