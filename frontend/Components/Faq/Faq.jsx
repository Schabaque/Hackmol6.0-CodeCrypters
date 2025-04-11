"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

// FAQ Item Component
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-teal-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <FaqItem
            question="What is EthAnnex?"
            answer="EthAnnex is a platform for fast, secure Ethereum transactions, trading, and portfolio management. We provide tools for both beginners and advanced users to manage their crypto assets."
          />
          <FaqItem
            question="How secure is the platform?"
            answer="We implement bank-grade security measures including multi-signature wallets, cold storage for the majority of assets, advanced encryption, and regular security audits by third-party experts."
          />
          <FaqItem
            question="What are the transaction fees?"
            answer="Our platform charges a competitive 0.01% fee per transaction. We also optimize gas fees to ensure you're getting the best rates on the Ethereum network."
          />
          <FaqItem
            question="Which wallets are supported?"
            answer="We support MetaMask, WalletConnect, Coinbase Wallet, and most major Ethereum wallets. You can connect your existing wallet or create a new one through our platform."
          />
          <FaqItem
            question="How do I get started?"
            answer="Simply click on the 'Get Started' button, create an account, connect your wallet, and you're ready to go. The entire process takes less than 5 minutes."
          />
        </div>
      </div>
    </section>
  )
}
