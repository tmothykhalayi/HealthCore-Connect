import { useGetDoctorQuery } from "@/hooks/patients/doctorHook";
import { useQueryClient } from "@tanstack/react-query";

type Doctor = {
  doctor_id: string;
  name: string;
  specialization: string;
  email: string;
  availability: string;
  license_number: string;
  consultation_fee?: number;
};

const DoctorsList = () => {
  const { data: doctors, isLoading, isError, error } = useGetDoctorQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doctor: Doctor) => (
          <DoctorCard key={doctor.doctor_id} doctor={doctor} />
        ))}
      </div>

    );
  }
};

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  // Construct image URL - assuming your API serves images at /images/doctors/{doctor_id}.jpg
  const imageUrl = `${"https://i.pinimg.com/736x/8e/5b/6a/8e5b6a2191656c1ac5d4571577870170.jpg"}/images/doctors/${doctor.doctor_id}.jpg`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={doctor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if the doctor image doesn't exist
            e.currentTarget.src = "/images/doctor-placeholder.jpg";
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
          
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            License: {doctor.license_number}
          </p>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            ₦{doctor.consultation_fee?.toLocaleString()}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;