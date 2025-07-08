import { FaUserMd, FaHeartbeat, FaClinicMedical, FaBrain, FaXRay } from 'react-icons/fa'

export default function AboutUs() {
  const services = [
    {
      icon: <FaUserMd className="text-4xl text-blue-600" />,
      title: "Expert Consultations",
      description: "Board-certified specialists providing personalized care",
      image: "https://i.pinimg.com/736x/1e/c3/63/1ec363db9598a75130f66966aacbc810.jpg"
    },
    {
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      title: "Cardiac Care",
      description: "Advanced heart health diagnostics and treatments",
      image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      icon: <FaClinicMedical className="text-4xl text-green-600" />,
      title: "Primary Care",
      description: "Comprehensive health services for all ages",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      icon: <FaBrain className="text-4xl text-purple-600" />,
      title: "Neurology",
      description: "Specialized care for nervous system disorders",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      icon: <FaXRay className="text-4xl text-yellow-600" />,
      title: "Diagnostic Imaging",
      description: "State-of-the-art radiology services",
      image: "https://images.unsplash.com/photo-1581595210415-c288f4604a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Our Healthcare Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Committed to excellence in medical care through innovation, compassion, and expertise.
          </p>
        </div>
      </div>

      {/* Services Showcase */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>    b    
      </div>

      {/* Mission Statement */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8">
            To provide exceptional, patient-centered healthcare that improves lives through 
            cutting-edge medicine, compassionate service, and community partnership.
          </p>
          <div className="relative h-64 rounded-xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1551601651-bc60f254d532?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Medical team discussing treatment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}