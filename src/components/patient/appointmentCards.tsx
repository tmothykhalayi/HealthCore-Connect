import { useGetAppointmentsByIdQuery } from "@/hooks/patients/appointmentHook";

interface AppointmentCardProps {
  appointment: {
    appointment_id: number;
    patient_id: number;
    doctor_id: number;
    appointment_time: string;
    status: string;
    reason: string;
    created_at: string;
  };
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Appointment #{appointment.appointment_id}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Date & Time:</span>{" "}
          {formatDate(appointment.appointment_time)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Doctor :</span> {appointment.doctor_id}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Reason:</span> {appointment.reason}
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-medium">Created:</span>{" "}
          {formatDate(appointment.created_at)}
        </p>
      </div>
    </div>
  );
};

 export const PatientAppointments = ({ patientId }: { patientId: number }) => {
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useGetAppointmentsByIdQuery(patientId);

  console.log("Appointments Data:", appointments);

  if (isLoading) {
    return <div className="text-center py-8">Loading appointments...</div>;
  }

   if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  // Check if appointments exists and is an array
  const appointmentsArray = Array.isArray(appointments) ? appointments : [appointments];

  if (!appointmentsArray || appointmentsArray.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No appointments found for this patient.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Patient Appointments
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {appointmentsArray.map((appointment) => (
          <AppointmentCard 
            key={appointment.appointment_id} 
            appointment={appointment} 
          />
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;