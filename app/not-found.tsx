"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Home, Mail, FileText, ArrowLeft, Search } from "lucide-react"
import { motion, Variants } from "framer-motion"

export default function NotFound() {
  const router = useRouter()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut", // Changed from array to string
      },
    },
  }

  const floatingVariants: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity, // Changed from Number.POSITIVE_INFINITY
        ease: "easeInOut", // Changed from array to string
      },
    },
  }

  const quickLinks = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/",
      description: "Return to home",
    },
    {
      icon: Mail,
      label: "Compose Email",
      href: "/compose",
      description: "Create new email",
    },
    {
      icon: FileText,
      label: "Templates",
      href: "/templates",
      description: "Browse templates",
    },
  ]

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number with floating animation */}
        <motion.div className="mb-8" variants={floatingVariants} animate="animate">
          <div className="relative inline-block">
            <motion.h1
              className="text-[180px] md:text-[240px] font-bold leading-none bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              404
            </motion.h1>
            <motion.div className="absolute inset-0 blur-3xl opacity-20 bg-primary" variants={itemVariants} />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div className="mb-8 space-y-3" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </motion.div>

        {/* Search Icon Animation */}
        <motion.div className="mb-12 flex justify-center" variants={itemVariants}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-border bg-card flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
                transition: {
                  duration: 2,
                  repeat: Infinity, // Changed from Number.POSITIVE_INFINITY
                  ease: "easeInOut", // Changed from array to string
                },
              }}
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="group relative p-6 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">{link.label}</div>
                    <div className="text-sm text-muted-foreground">{link.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
          <Button
            size="lg"
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 border-border hover:border-primary/50 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div className="mt-16 flex justify-center gap-2" variants={itemVariants}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
                transition: {
                  duration: 1.5,
                  repeat: Infinity, // Changed from Number.POSITIVE_INFINITY
                  delay: i * 0.2,
                  ease: "easeInOut", // Changed from array to string
                },
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}