import { Plus_Jakarta_Sans, Manrope, Inter, Instrument_Serif, League_Spartan } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { OrgProvider } from "@/context/OrgContext";
import CreateOrgModal from "@/components/CreateOrgModal";
import JoinOrgModal from "@/components/JoinOrgModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const leagueSpartan = League_Spartan({
  variable: "--font-futura",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Meridian | Modern Project Management & Collaboration",
  description: "Enterprise project management platform with real-time kanban, smart calendar, and team communication.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${leagueSpartan.variable} ${manrope.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <OrgProvider>
            {children}
            <CreateOrgModal />
            <JoinOrgModal />
          </OrgProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
