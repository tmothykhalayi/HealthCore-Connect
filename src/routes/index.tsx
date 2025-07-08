import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
 
   
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="block text-blue-600">HealthCare+</span>
              <span className="block">Your Gateway to Optimal</span>
              <span className="block">Health Solutions</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl">
              Our platform serves as your gateway to a healthier life, offering personalized
              guidance, valuable insights, and support for your well-being.
            </p>

            
          </div>

          {/* Right Column - Image */}
          <div className="relative h-100 lg:h-full">
            <img
              className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
              src="https://i.pinimg.com/736x/1e/c3/63/1ec363db9598a75130f66966aacbc810.jpg"
              alt="Happy doctor with patient"
            />
          </div>
        </div>
      </div>
    </div>
  )
}