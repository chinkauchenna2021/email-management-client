import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { AuthProvider } from "@/providers/AuthProvider"
import { QueryProvider } from '@/providers/query-provider'
 import { ToastContainer , Bounce} from 'react-toastify';

export const metadata: Metadata = {
  title: "EmailFlow - Advanced Email Management",
  description: "Professional email campaign management with advanced analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense>
            <QueryProvider>
           <AuthProvider >
               {children}
               <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                />
           </AuthProvider>
            </QueryProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
