import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import logo from "../../src/assets/logo.png";
import { Link } from "react-router-dom";

// Separate functional component for download button
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

export default function Hero() {
  return (
    <section className="bg-teal-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              One Stop Solution for Crypto Management
            </h1>
            <p className="text-xl text-teal-100">
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

          {/* Right Section */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-teal-400 rounded-lg blur-lg opacity-30"></div>
              <div className="relative bg-teal-800 p-6 rounded-lg shadow-xl">
                <div className="space-y-4">
                  <img src={logo} alt="Platform Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
