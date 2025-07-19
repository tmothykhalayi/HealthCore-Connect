import { Link, useParams } from 'react-router-dom'
import { TbFirstAidKit } from 'react-icons/tb'
import { IoArrowForward } from 'react-icons/io5'
import { useGetDoctors } from '@/hooks/doctorHook'

const Doctor = () => {
  const params = useParams<{ doctorId: string }>()
  const { data: doctorsData, isLoading, error } = useGetDoctors()

  // Safely extract doctors array
  const doctors = Array.isArray(doctorsData)
    ? doctorsData
    : Array.isArray(doctorsData?.data)
      ? doctorsData.data
      : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold mb-2">Error Loading Doctor</h2>
          <p>Failed to load doctor information. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header Section */}
      <section className="py-8 px-4 bg-indigo-950 text-purple-400 lg:px-16 lg:py-20">
        {doctors.map((doctor: any) => {
          if (doctor.id.toString() === params.doctorId)
            return (
              <div className="flex flex-col items-center md:flex-row">
                <img
                  src={
                    doctor.profileImage || '/assets/images/doctors/doctor-1.jpg'
                  }
                  className="h-96 mb-6 object-cover object-top rounded-2xl border-8 md:order-2 lg:w-1/3"
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                />

                <div className="w-full flex flex-col gap-y-2 md:order-1 md:w-fit md:mr-auto md:gap-y-4">
                  <h1 className="text-4xl font-playfair-display italic xl:text-6xl">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h1>
                  <p className="mb-4 text-2xl text-purple-800 font-bold xl:mb-8 xl:text-3xl xl:font-semibold">
                    {doctor.specialization}
                  </p>

                  <div className="flex items-center justify-between [&_p]:font-semibold [&_span]:text-teal-300">
                    <div className="flex flex-col">
                      <p>Experience</p>
                      <span>{doctor.yearsOfExperience}+</span>
                    </div>

                    <div className="px-8 flex flex-col border-l border-r border-purple-900">
                      <p>License</p>
                      <span>{doctor.licenseNumber}</span>
                    </div>

                    <div className="flex flex-col">
                      <p>Consultation Fee</p>
                      <span>${doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
        })}
      </section>

      {/* Details Section */}
      <section className="py-8 px-4 text-purple-950 md:px-40 lg:py-20 lg:px-80">
        <div className="mb-8 flex flex-col gap-y-4">
          <p>
            <span className="font-bold">Biography: </span>
            Dr. Esthy Ambetsa is a seasoned rheumatologist with over 12 years of
            dedicated experience in diagnosing and treating a wide range of
            rheumatic diseases. With a passion for improving patients' quality
            of life, Dr. Ambetsa has established himself as a leading expert in
            the field. After completing him medical degree at OSU, Dr.Ambetsa
            pursued specialized training in rheumatology, recognizing the
            complexity and challenges of managing autoimmune and musculoskeletal
            disorders. His commitment to excellence led him to undertake
            rigorous residency and fellowship programs at renowned institutions,
            where he honed his skills in the diagnosis and management of
            conditions such as rheumatoid arthritis, lupus, osteoarthritis, and
            gout, among others.
          </p>
          <p>
            In addition to his clinical practice, Dr.Ambetsa is actively
            involved in research and education, staying abreast of the latest
            advancements in rheumatology to ensure his patients receive the most
            cutting-edge care available. He has authored numerous publications
            in peer-reviewed journals and frequently presents his research
            findings at national and international conferences.
          </p>
          <p>
            Dr.Ambetsa is board-certified in rheumatology and maintains
            affiliations with several professional organizations, including the
            American College of Rheumatology and the Rheumatology Research
            Foundation. Patients seeking expert care and compassionate support
            for rheumatic conditions can trust in Dr. Esthy Ambetsa's expertise
            and dedication to improving their health and well-being.
          </p>
        </div>

        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Specialties</h2>

          <div className="mb-8 flex flex-col gap-y-2 [&>span]:flex [&>span]:items-center [&>span]:gap-x-2 [&>span]:text-lg">
            <span>
              <TbFirstAidKit className="text-2xl" /> Dentistry
            </span>

            <span>
              <TbFirstAidKit className="text-2xl" /> Cosmetic Dentistry
            </span>

            <span>
              <TbFirstAidKit className="text-2xl" /> Emergency Dentistry
            </span>

            <span>
              <TbFirstAidKit className="text-2xl" /> Laser Dentistry
            </span>

            <span>
              <TbFirstAidKit className="text-2xl" /> Endodontics
            </span>
          </div>

          <div className="flex flex-col gap-4 [&>*]:text-lg md:flex-row">
            <Link
              to={'/contact'}
              className="w-fit flex items-center gap-x-2 py-4 px-8 text-white font-semibold bg-teal-500 rounded-lg hover:bg-teal-600 ease-in-out duration-200 active:scale-95"
            >
              Make an Appointment <IoArrowForward className="text-xl" />
            </Link>

            <div className="w-fit py-4 px-8 text-teal-500 font-semibold border-2 border-teal-500 rounded-lg">
              07-12345678
            </div>
          </div>
        </div>
      </section>

      {/* Other Doctors */}
      <section className="py-8 px-4 text-purple-950 lg:px-16 lg:py-20">
        <h3 className="mb-8 font-semibold text-4xl text-balance md:text-5xl">
          Other{' '}
          <span className="font-playfair-display italic text-purple-400">
            Doctors
          </span>
        </h3>

        <div className="flex flex-col gap-4 md:flex-row">
          {doctors.slice(0, 3).map((doctor: any) => (
            <Link
              key={doctor.id}
              to={`/doctors/${doctor.id}`}
              className="w-full"
            >
              <div className="mb-8 p-2 flex flex-col gap-y-2 bg-purple-100 text-purple-900 rounded-2xl shadow-sm sm:p-4 md:max-w-96">
                <img
                  src={
                    doctor.profileImage || '/assets/images/doctors/doctor-1.jpg'
                  }
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                  className="w-full min-w-60 h-64 object-cover object-top rounded-2xl sm:min-w-64"
                />
                <h3 className="text-2xl font-bold">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="mb-4">{doctor.specialization}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Doctor
