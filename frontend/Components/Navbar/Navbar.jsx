"use client";

import { useState } from "react";
import { Menu, X, Wallet, EclipseIcon as Ethereum } from "lucide-react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, usePublicClient } from "wagmi";
import { formatEther } from "viem";
import logo from "../../src/assets/logo1.png";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-teal-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
           
            <image className="h-8 w-8 mr-2" src={logo} alt="" />
            <span className="font-bold text-xl">EthAnnex</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-white hover:text-teal-200 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-teal-200 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-teal-200 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-white hover:text-teal-200 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className=" flex items-center space-x-4">
          
              <div className=" flex gap-2 justify-center items-center">
                <ConnectButton
                  showBalance={false}
                  chainStatus="icon"
                  accountStatus="full"
                />
              </div>
           
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white p-2">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-teal-800 pb-4 px-4">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              className="text-white hover:text-teal-200 transition-colors py-2"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-teal-200 transition-colors py-2"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-teal-200 transition-colors py-2"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-white hover:text-teal-200 transition-colors py-2"
            >
              FAQ
            </a>
            <button className="px-4 py-2 rounded-md bg-transparent border border-teal-200 text-teal-200 hover:bg-teal-200 hover:text-teal-800 transition-colors mt-2">
              Login
            </button>
            <button className="px-4 py-2 rounded-md bg-teal-200 text-teal-800 hover:bg-teal-100 transition-colors flex items-center justify-center">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
