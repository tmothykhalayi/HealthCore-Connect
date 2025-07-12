import { useGetDoctorQuery } from "@/hooks/patients/doctorHook";
import { Link } from "@tanstack/react-router";

type Doctor = {
  doctor_id: number;
  name: string;
  specialization: string;
  email: string;
  availability: string;
  consultation_fee?: number;
  img?: string | null;
};

const DoctorsList = () => {
  const { data: doctors, isLoading, isError } = useGetDoctorQuery();
  
  console.log("Doctors data:", doctors);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading doctors data</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doctor: Doctor) => (
          <DoctorCard key={doctor.doctor_id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  // Use the image from the API if available, otherwise use placeholder
  const imageUrl = doctor.img || "https://i.pinimg.com/736x/8e/5b/6a/8e5b6a2191656c1ac5d4571577870170.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={doctor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = "https://i.pinimg.com/736x/8e/5b/6a/8e5b6a2191656c1ac5d4571577870170.jpg";
          }}
        />
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {doctor.name}
        </h2>
        <p className="text-blue-600 font-medium mb-1">
          {doctor.specialization}
        </p>
        
        <div className="mt-4 space-y-2 text-gray-600">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {doctor.email}
          </p>
          
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {doctor.availability}
          </p>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            Ksh {doctor.consultation_fee?.toLocaleString() ?? "Not specified"}
          </span>
          
          <Link to = "/dashboard/patient/doctors/appointmentsForm" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;