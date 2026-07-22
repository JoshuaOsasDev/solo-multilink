"use client";
import Link from "next/link";

export default function Whatsapp() {
  const message = encodeURIComponent(
    "Hello Solo Multi-Link 👋, I would like to make an enquiry about your services.",
  );

  return (
    <div
      style={{
        position: "fixed",
        right: "4px",
        bottom: "10px",
        zIndex: 50,
      }}
    >
      <Link
        href={`https://wa.me/+2347061199435?text=${message}`}
        target="_blank"
        style={{
          position: "relative",
          display: "flex",
          width: "56px",
          height: "56px",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          textDecoration: "none",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Pulse animation */}
        <span
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "#25D366",
            opacity: 0.4,
            animation: "ping 1.5s infinite",
          }}
        />

        {/* WhatsApp Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          style={{
            width: "28px",
            height: "28px",
            zIndex: 10,
          }}
        >
          <path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.887.755 5.705 2.188 8.19L.036 32l7.597-2.114A15.905 15.905 0 0 0 16 32c8.837 0 16-7.163 16-16.396C32 7.559 24.837.396 16 .396zm0 29.302c-2.54 0-5.03-.676-7.2-1.955l-.516-.305-4.506 1.252 1.203-4.392-.335-.536A13.55 13.55 0 0 1 2.45 16.4c0-7.472 6.078-13.55 13.55-13.55s13.55 6.078 13.55 13.55-6.078 13.55-13.55 13.55zm7.443-10.17c-.407-.204-2.407-1.188-2.78-1.323-.373-.136-.644-.204-.915.204-.271.407-1.051 1.323-1.289 1.595-.237.271-.475.305-.881.102-.407-.204-1.72-.634-3.275-2.02-1.21-1.08-2.027-2.414-2.264-2.82-.237-.407-.025-.627.178-.83.183-.182.407-.475.61-.712.203-.237.271-.407.407-.678.136-.271.068-.509-.034-.712-.102-.204-.915-2.203-1.254-3.016-.33-.793-.665-.686-.915-.699l-.78-.014c-.271 0-.712.102-1.085.509-.373.407-1.424 1.39-1.424 3.39 0 2 1.458 3.93 1.661 4.203.203.271 2.87 4.383 6.956 6.146.973.419 1.73.669 2.322.856.976.311 1.865.267 2.566.162.783-.117 2.407-.983 2.747-1.932.339-.949.339-1.763.237-1.932-.102-.169-.373-.271-.78-.475z" />
        </svg>
      </Link>

      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          70% {
            transform: scale(1.8);
            opacity: 0;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @media (min-width: 768px) {
          div {
            bottom: 40px;
          }
        }
      `}</style>
    </div>
  );
}
