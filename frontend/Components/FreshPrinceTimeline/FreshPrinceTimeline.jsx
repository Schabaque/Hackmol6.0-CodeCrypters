"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useAnimation } from "framer-motion"

const steps = [
  {
    id: 1,
    text: "New Here? Let's create a Wallet",
    hoverText: "Don't worry, simpler than setting up GPay!",
    icon: "wallet",
    side: "left",
  },
  {
    id: 2,
    text: "Just connect your wallet to the app!",
    hoverText: "One-click connection to start your journey",
    icon: "connect",
    side: "right",
  },
  {
    id: 3,
    text: "Add your Favorite Contacts to transfer seamlessly!",
    hoverText: "Just enter name and wallet address ex-> 0xx122",
    icon: "contacts",
    side: "left",
  },
  {
    id: 4,
    text: "Execute transactions with simple commands!",
    hoverText: 'Just type "send", enter the name and amount to send',
    icon: "transaction",
    side: "right",
  },
  {
    id: 5,
    text: "Want better gas prices? Dive right into it!",
    hoverText: "Our AI finds the best gas prices for your transactions",
    icon: "gas",
    side: "left",
  },
  {
    id: 6,
    text: "Start trading!",
    hoverText: "Real-time analysis to hold, buy or sell a click away!",
    icon: "trade",
    side: "right",
  },
]

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const IconConnect = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const IconContacts = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
)

const IconTransaction = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
  </svg>
)

const IconGas = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const IconTrade = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const getIcon = (iconName) => {
  switch (iconName) {
    case "wallet":
      return <IconWallet />
    case "connect":
      return <IconConnect />
    case "contacts":
      return <IconContacts />
    case "transaction":
      return <IconTransaction />
    case "gas":
      return <IconGas />
    case "trade":
      return <IconTrade />
    default:
      return <IconWallet />
  }
}

// Crypto Coin Component
const CryptoCoin = ({ scrollYProgress }) => {
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1440])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1.2, 1.2, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [50, window.innerHeight - 150])
  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      window.innerWidth * 0.5 - 30,
      window.innerWidth * 0.3 - 30,
      window.innerWidth * 0.7 - 30,
      window.innerWidth * 0.3 - 30,
      window.innerWidth * 0.7 - 30,
      window.innerWidth * 0.5 - 30,
    ],
  )

  const coinSpring = useSpring(y, { stiffness: 100, damping: 20 })
  const rotateSpring = useSpring(rotate, { stiffness: 60, damping: 15 })

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        x,
        y: coinSpring,
        rotate: rotateSpring,
        scale,
      }}
    >
      <div className="relative w-16 h-16">
        {/* Front face of coin */}
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-xl"
          style={{
            boxShadow: "0 0 30px rgba(234, 179, 8, 0.6)",
          }}
        >
          <div className="text-teal-900 font-bold text-xl">₿</div>
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full bg-white opacity-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Trailing particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-300"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{
              opacity: [0.7, 0],
              scale: [1, 0.5],
              x: [0, (i % 2 === 0 ? -1 : 1) * (i + 1) * 10],
              y: [0, (i % 3 === 0 ? -1 : 1) * (i + 1) * 15],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Animated background particles
const BackgroundParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-300 opacity-20"
          style={{
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 10,
          }}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i + 20}
          className="absolute rounded-full bg-yellow-400 opacity-20"
          style={{
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -150],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  )
}

export default function CryptoOnboarding() {
  const [hoveredStep, setHoveredStep] = useState(null)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Refs for each step to check if they're in view
  const stepRefs = useRef([])
  // const stepControls = steps.map(() => useAnimation()) // HOOK MOVED

  // Initialize step refs
  useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, steps.length)
  }, [])

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  // Glowing effect for timeline
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.8, 0.2])
  const glowSpread = useTransform(scrollYProgress, [0, 0.5, 1], [5, 15, 5])

  // Timeline progress
  const pathLength = useTransform(scrollYProgress, [0, 0.9], [0, 1])

  const [stepControls, setStepControls] = useState(steps.map(() => useAnimation()))

  // Check if steps are in view and animate them
  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            stepControls[index].start({
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.1,
              },
            })
          }
        },
        { threshold: 0.3 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect()
      })
    }
  }, [stepControls])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden">
      {/* Animated background */}
      <BackgroundParticles />

      {/* Parallax background elements */}
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ y: backgroundY }}>
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-teal-400 opacity-5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-yellow-400 opacity-5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-teal-300 opacity-5 blur-3xl" />
      </motion.div>

      {/* Rolling coin animation */}
      <CryptoCoin scrollYProgress={scrollYProgress} />

      <motion.div ref={containerRef} className="max-w-4xl w-full mx-auto relative z-10">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-100 to-yellow-200"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Crypto</span>{" "}
          Journey
        </motion.h1>

        <div className="relative">
          {/* Timeline line with glow effect */}
          <motion.div
            className="hidden md:block w-1 absolute h-full left-1/2 transform -translate-x-1/2 overflow-hidden"
            style={{
              boxShadow: useTransform(
                glowSpread,
                (value) => `0 0 ${value}px ${value / 2}px rgba(45, 212, 191, ${glowOpacity.get()})`,
              ),
            }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-b from-teal-300 via-teal-400 to-yellow-400"
              style={{
                scaleY: pathLength,
                originY: 0,
              }}
            />
          </motion.div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              ref={(el) => (stepRefs.current[index] = el)}
              className="mb-24 relative"
              initial={{ opacity: 0, y: 100 }}
              animate={stepControls[index]}
              onHoverStart={() => setHoveredStep(step.id)}
              onHoverEnd={() => setHoveredStep(null)}
            >
              <div
                className={`flex flex-col ${step.side === "left" ? "md:flex-row" : "md:flex-row-reverse"} items-center`}
              >
                {/* Content card with enhanced glass effect */}
                <motion.div
                  className={`w-full md:w-5/12 ${step.side === "left" ? "md:pr-8" : "md:pl-8"}`}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <motion.div
                    className="p-6 rounded-xl shadow-2xl border border-teal-400/30 relative overflow-hidden"
                    style={{
                      background: "rgba(8, 47, 73, 0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                    initial={{ x: step.side === "left" ? -50 : 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent pointer-events-none" />

                    {/* Shimmering effect */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background:
                          "linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.15) 50%, transparent 55%)",
                        backgroundSize: "200% 200%",
                      }}
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "mirror",
                        ease: "linear",
                      }}
                    />

                    <h3 className="text-xl font-bold text-teal-100 mb-2 relative z-10">{step.text}</h3>

                    {hoveredStep === step.id && step.hoverText && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                      >
                        <p className="text-yellow-300 text-sm">{step.hoverText}</p>

                        {/* Animated underline */}
                        <motion.div
                          className="h-0.5 bg-gradient-to-r from-yellow-300 to-yellow-500 mt-2"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Center icon with enhanced effects */}
                <motion.div
                  className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 border-4 border-teal-900 my-4 md:my-0 z-20"
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                    boxShadow: "0 0 20px 5px rgba(45, 212, 191, 0.5)",
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  {/* Pulsing effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-teal-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0.2, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />

                  <motion.div className="text-white relative z-10">{getIcon(step.icon)}</motion.div>
                </motion.div>
              </div>

              {/* Enhanced particle effects */}
              {step.id % 2 === 1 && (
                <>
                  <motion.div
                    className="absolute"
                    style={{
                      left: step.side === "left" ? "40%" : "60%",
                      top: "50%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [0, -30],
                      x: step.side === "left" ? [0, -30] : [0, 30],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      repeatType: "loop",
                      delay: index * 0.3,
                    }}
                  >
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-300/50" />
                  </motion.div>

                  {/* Additional particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-teal-300"
                      style={{
                        left: step.side === "left" ? `${40 + i * 5}%` : `${60 - i * 5}%`,
                        top: `${50 + (i % 2 === 0 ? -i * 5 : i * 5)}%`,
                      }}
                      animate={{
                        opacity: [0, 0.7, 0],
                        scale: [0, 1, 0],
                        y: [0, -20 * (i + 1)],
                        x: step.side === "left" ? [0, -10 * (i + 1)] : [0, 10 * (i + 1)],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            className="relative px-10 py-5 overflow-hidden group bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-teal-900 font-bold rounded-full text-lg shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 30px rgba(250, 204, 21, 0.7)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shine effect */}
            <motion.span
              className="absolute top-0 left-0 w-full h-full bg-white opacity-30"
              style={{
                clipPath: "polygon(0% 0%, 30% 0%, 10% 100%, 0% 100%)",
              }}
              animate={{
                left: ["0%", "130%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
              }}
            />

            {/* Button text with glow */}
            <span className="relative z-10 drop-shadow-lg">Start Your Crypto Journey</span>

            {/* Pulsing glow */}
            <motion.span
              className="absolute inset-0 rounded-full opacity-30"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(250, 204, 21, 0)",
                  "0 0 0 20px rgba(250, 204, 21, 0.3)",
                  "0 0 0 40px rgba(250, 204, 21, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
