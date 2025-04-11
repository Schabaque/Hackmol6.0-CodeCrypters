import { Zap, Shield, BarChart3 } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EthAnnex</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform offers the best experience for Ethereum transactions with industry-leading features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-teal-50 p-8 rounded-xl">
            <div className="bg-teal-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-teal-800" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600">
              Execute transactions in seconds with our optimized gas fee calculations and direct blockchain
              integration.
            </p>
          </div>

          <div className="bg-teal-50 p-8 rounded-xl">
            <div className="bg-teal-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-teal-800" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Beginner friendly!</h3>
            <p className="text-gray-600">
              Your assets are protected with multi-signature wallets, cold storage, and advanced encryption.
            </p>
          </div>

          <div className="bg-teal-50 p-8 rounded-xl">
            <div className="bg-teal-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <BarChart3 className="h-7 w-7 text-teal-800" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Advanced Analytics</h3>
            <p className="text-gray-600">
              Track your portfolio performance with real-time charts, historical data, and predictive insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
