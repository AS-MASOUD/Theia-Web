import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { PublicHeader, PublicFooter } from "@/components/layout/public-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theia Finance — سامانه هوشمند مدیریت دارایی و ثروت شخصی",
  description: "دیده‌بان زنده بازارها، محاسبه گر دارایی‌ها، استهلاک وام و هوش مصنوعی تصمیم‌گیری مالی شخصی.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Theia Finance — مشاور هوشمند مدیریت مالی و سرمایه‌گذاری",
    description: "سامانه یکپارچه مدیریت سبد دارایی، بودجه‌بندی و پایش جریان نقدینگی شخصی",
    url: "https://theia-finance.ir",
    siteName: "Theia Finance",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#0D0E10] text-[#E8E8E8] min-h-screen flex flex-col selection:bg-[#F0AE55]/20 selection:text-[#F0AE55]" suppressHydrationWarning>
        <Providers>
          <PublicHeader />
          <main className="flex-1 w-full">{children}</main>
          <PublicFooter />
        </Providers>
      </body>
    </html>
  );
}
