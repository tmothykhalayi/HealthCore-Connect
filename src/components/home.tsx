
export default function HealthcareHome() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-24">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Welcome to <span className="text-blue-600 ">HealthCare+</span>
            </h1>
            <p className="text-xl text-gray-600  mb-8">
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
              src="https://i.pinimg.com/736x/1e/c3/63/1ec363db9598a75130f66966aacbc810.jpg"
              alt="Doctor and patient having a consultation"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      
    </div>
  )
}