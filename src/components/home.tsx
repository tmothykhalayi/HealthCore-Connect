
export default function HealthcareHome() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-24">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Welcome to <span className="text-blue-600">HealthCare+</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your trusted partner in health and wellness. We're committed to providing compassionate care that puts you first.
            </p>
            <div className="space-y-4">
              <p className="text-gray-700">
                Experience healthcare that understands your needs and delivers exceptional results.
              </p>
              <p className="text-gray-700">
                Where your wellbeing is our highest priority.
              </p>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Doctor and patient having a consultation"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}