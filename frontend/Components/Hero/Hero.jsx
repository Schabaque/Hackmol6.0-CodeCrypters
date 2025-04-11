import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEthereum } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const particles = Array.from({ length: 20 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
  }, []);

  const backgroundVariants = {
    animate: {
      background: [
        "linear-gradient(45deg, #14B8A6, #0F766E, #0D9488)",
        "linear-gradient(45deg, #0F766E, #0D9488, #14B8A6)",
        "linear-gradient(45deg, #0D9488, #14B8A6, #0F766E)"
      ],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotateY: [0, 180, 360],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const particleVariants = {
    animate: (i) => ({
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
      transition: {
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        repeatType: "reverse",
        delay: i * 0.1
      }
    })
  };

  function DownloadWalletButton() {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <a href="https://metamask.io/download" target="_blank" rel="noopener noreferrer">
        <button
          className="px-6 py-3 w-[300px] hover:underline rounded-lg bg-transparent border border-teal-200 text-teal-200 font-medium transition-colors hover:bg-teal-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? "Download now!" : "Don’t have a crypto wallet?"}
        </button>
      </a>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Teal gradient background with animation */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={backgroundVariants}
        animate={!reducedMotion ? "animate" : ""}
      />

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-white">
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="mb-12"
            variants={floatingVariants}
            animate={!reducedMotion ? "animate" : ""}
          >
            <FaEthereum className="text-white text-8xl md:text-9xl drop-shadow-glow" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to the Future of
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 via-amber-200 to-orange-500">
  Decentralized Finance
</span>

          </h1>

          <p className="text-lg md:text-xl text-teal-100 max-w-2xl mb-12">
             Trade, Exchange, and manage your Ethereum assets with our powerful AI integrated platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard">
              <button className="px-6 py-3 rounded-lg bg-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <DownloadWalletButton />
          </div>
        </div>
      </main>

      {/* Glowing floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariants}
            animate={!reducedMotion ? "animate" : ""}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Slide-in mobile menu (optional) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-screen w-64 bg-gray-900 z-50 p-6"
          >
            <div className="flex flex-col space-y-6">
              <button className="text-white hover:text-gray-300 transition-colors text-left">
                Features
              </button>
              <button className="text-white hover:text-gray-300 transition-colors text-left">
                Developers
              </button>
              <button className="text-white hover:text-gray-300 transition-colors text-left">
                Community
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
