import { ArrowRight, EclipseIcon as Ethereum } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-teal-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Fast & Secure Ethereum Transactions
            </h1>
            <p className="text-xl text-teal-100">
              Trade, invest, and manage your Ethereum assets with our powerful and intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 rounded-lg bg-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 rounded-lg bg-transparent border border-teal-200 text-teal-200 font-medium hover:bg-teal-800 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-teal-400 rounded-lg blur-lg opacity-30"></div>
              <div className="relative bg-teal-800 p-6 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Quick Transaction</h3>
                  <Ethereum className="h-8 w-8 text-teal-200" />
                </div>
                <div className="space-y-4">
                  <div className="bg-teal-900 p-4 rounded-lg">
                    <label className="block text-sm text-teal-200 mb-2">Recipient Address</label>
                    <input
                      type="text"
                      className="w-full bg-teal-700 border border-teal-600 rounded px-3 py-2 text-white"
                      placeholder="0x..."
                    />
                  </div>
                  <div className="bg-teal-900 p-4 rounded-lg">
                    <label className="block text-sm text-teal-200 mb-2">Amount (ETH)</label>
                    <input
                      type="number"
                      className="w-full bg-teal-700 border border-teal-600 rounded px-3 py-2 text-white"
                      placeholder="0.0"
                    />
                  </div>
                  <button className="w-full px-4 py-3 rounded-lg bg-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors">
                    Send Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
