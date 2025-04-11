export default function Stats() {
  return (
    <section className="py-12 bg-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl md:text-4xl font-bold text-teal-600">$2B+</p>
            <p className="text-gray-600">Trading Volume</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl md:text-4xl font-bold text-teal-600">120K+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl md:text-4xl font-bold text-teal-600">15M+</p>
            <p className="text-gray-600">Transactions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl md:text-4xl font-bold text-teal-600">99.9%</p>
            <p className="text-gray-600">Uptime</p>
          </div>
        </div>
      </div>
    </section>
  )
}
