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
  FaUserInjured
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
    { 
      icon: <FaCalendarAlt size={18} />, 
      label: 'Appointments', 
      to: '/dashboard/appointments' 
    },
  ]

  // Role-specific navigation items
  const roleNavItems = {
    admin: [
      { icon: <FaUserFriends size={18} />, label: 'Staff', to: '/dashboard/admin/staff' },
      { icon: <FaChartLine size={18} />, label: 'Analytics', to: '/dashboard/admin/analytics' },
    ],
    doctor: [
      { icon: <FaUserInjured size={18} />, label: 'Patients', to: '/dashboard/doctor/patients' },
      { icon: <FaFileMedical size={18} />, label: 'Records', to: '/dashboard/doctor/records' },
      { icon: <FaPrescriptionBottleAlt size={18} />, label: 'Prescriptions', to: '/dashboard/doctor/prescriptions' },
    ],
    patient: [
      { icon: <FaUserMd size={18} />, label: 'Doctors', to: '/dashboard/patient/doctors' },
      { icon: <FaProcedures size={18} />, label: 'Treatments', to: '/dashboard/patient/treatments' },
    ],
    pharmacist: [
      { icon: <MdLocalPharmacy size={20} />, label: 'Inventory', to: '/dashboard/pharmacist/inventory' },
      { icon: <FaPills size={18} />, label: 'Dispense', to: '/dashboard/pharmacist/dispense' },
    ]
  }

  const navItems = [...commonNavItems, ...(roleNavItems[role] || [])]

  return (
    <nav className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FaHospitalUser className="text-blue-600" size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">MediCare Hospital</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>
      </div>

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