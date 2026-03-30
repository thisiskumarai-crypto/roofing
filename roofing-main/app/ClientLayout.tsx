"use client"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { Nav, Footer, RoofingBackground, CustomCursor, FloatingChat } from "./components"

const E = [0.16, 1, 0.3, 1] as const;
const SF = { fontFamily: "'Satoshi', sans-serif" };

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = pathname === "/" ? "home" : pathname.replace("/", "") as any;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <RoofingBackground />
      <CustomCursor />
      <FloatingChat />
      <div style={{ position: "relative", zIndex: 4 }}>
        <Nav current={current} />
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => setTimeout(() => window.scrollTo(0, 0), 50)}>
          <motion.main key={pathname}
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.99 }}
            transition={{ duration: 0.4, ease: E }}>
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  )
}
