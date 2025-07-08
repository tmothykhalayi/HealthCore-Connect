import { Link } from '@tanstack/react-router'
import { 
  FaUserMd, 
  FaProcedures, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaChartLine,
  FaPills,
  FaFileMedical,
  FaHospitalUser,
  FaPrescriptionBottleAlt,
  FaUserInjured,
  FaMoneyBill
} from 'react-icons/fa'
import { MdDashboard, MdLocalPharmacy } from 'react-icons/md'

interface SideNavProps {
  role: 'admin' | 'doctor' | 'patient' | 'pharmacist'
}

export default function SideNav({ role }: SideNavProps) {
  // Common navigation items
  const commonNavItems = [
    { 
      icon: <MdDashboard size={20} />, 
      label: 'Dashboard', 
      to: '/dashboard' 
    },
    // { 
    //   icon: <FaCalendarAlt size={18} />, 
    //   label: 'Appointments', 
    //   to: '/dashboard/appointments' 
    // },
  ]

  // Role-specific navigation items
  const roleNavItems = {
    admin: [
      { icon: <FaUserFriends size={18} />, label: 'Users', to: '/dashboard/admin/users' },
       { icon: <FaUserInjured size={18} />, label: 'Patients', to: '/dashboard/admin/patients' },
        { icon: <FaUserMd size={18} />, label: 'Doctors', to: '/dashboard/admin/doctors' },
        { icon: <FaCalendarAlt size={18} />, label: 'Appointments', to: '/dashboard/admin/appointments' },
        { icon: <FaPrescriptionBottleAlt size={18} />, label: 'Prescriptions', to: '/dashboard/admin/prescriptions' },
        { icon: <MdLocalPharmacy size={20} />, label: 'Pharmacy Orders', to: '/dashboard/admin/pharmacy_orders' },
        { icon: <FaMoneyBill size={18} />, label: 'Payments', to: '/dashboard/admin/payments' },
        { icon: <FaPills/>, label: 'Medicines', to: '/dashboard/admin/medicines' },
        { icon: <FaFileMedical size={18} />, label: 'Records', to: '/dashboard/admin/records' },

    ],
    doctor: [
      { icon: <FaUserInjured size={18} />, label: 'Patients', to: '/dashboard/doctor/patients' },
      { icon: <FaFileMedical size={18} />, label: 'Records', to: '/dashboard/doctor/records' },
      { icon: <FaPrescriptionBottleAlt size={18} />, label: 'Prescriptions', to: '/dashboard/doctor/prescriptions' },
    ],
    patient: [
      { icon: <FaUserMd size={18} />, label: 'Doctors', to: '/dashboard/patient/doctors' },
      { icon: <FaPills/>, label: 'Medicines', to: '/dashboard/patient/medicines' },
      { icon: <FaCalendarAlt size={18} />, label: 'Appointments', to: '/dashboard/patient/appointments' },

      
    ],
    pharmacist: [
      { icon: <MdLocalPharmacy size={20} />, label: 'Pharmacy Orders', to: '/dashboard/pharmacist/pharmacy_orders' },
      { icon: <FaPrescriptionBottleAlt size={18} />, label: 'Prescriptions', to: '/dashboard/pharmacist/prescriptions' },
      { icon: <FaHospitalUser size={18} />, label: 'Patients', to: '/dashboard/pharmacist/patients' },
      { icon: <FaChartLine size={18} />, label: 'Records', to: '/dashboard/pharmacist/records' },
      { icon: <FaMoneyBill size={18} />, label: 'Payments', to: '/dashboard/pharmacist/payments' },

    ]
  }

  const navItems = [...commonNavItems, ...(roleNavItems[role] || [])]

  return (
    <nav className="h-full bg-white border-r border-gray-200 flex flex-col">
      

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 group"
                activeProps={{ className: 'bg-blue-100 text-blue-600' }}
              >
                <span className="text-gray-500 group-hover:text-blue-600 mr-3">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}