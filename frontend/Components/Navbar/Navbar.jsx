"use client";

import { useState } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaEthereum } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-[#004d40] text-yellow-200 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-2">
            <FaEthereum className="text-yellow-300 text-2xl" />
            <span className="font-bold text-xl tracking-wide">EthAnnex</span>
          </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 text-yellow-200">
              <a href="#about" className="hover:text-white transition-colors">About Us</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
              <a href="#freshprincetimeline" className="hover:text-white transition-colors">Begin Journey</a>
            </nav>
            {/* Wallet Connect Button */}
            <div className="hidden md:flex items-center space-x-4">
              <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus="full"
              />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-yellow-200 p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#004d40] pb-4 px-4">
            <nav className="flex flex-col space-y-3">
              <a href="#about" className="hover:text-white transition-colors py-2">About Us</a>
              <a href="#features" className="hover:text-white transition-colors py-2">Features</a>
              <a href="#faq" className="hover:text-white transition-colors py-2">FAQs</a>
              <a href="#timeline" className="hover:text-white transition-colors py-2">Begin Journey</a>
              <button className="px-4 py-2 rounded-md border border-yellow-200 text-yellow-200 hover:bg-yellow-200 hover:text-[#004d40] transition-colors mt-2">
                Login
              </button>
              <button className="px-4 py-2 rounded-md bg-yellow-200 text-[#004d40] hover:bg-yellow-100 transition-colors flex items-center justify-center">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </button>
            </nav>
          </div>
        )}
      </header>
  );
}