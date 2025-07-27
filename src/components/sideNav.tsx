import { Link } from '@tanstack/react-router'
import {
  FaCalendarAlt,
  FaChartLine,
  FaFileMedical,
  FaHospitalUser,
  FaMoneyBill,
  FaPills,
  FaPrescriptionBottleAlt,
  FaProcedures,
  FaUserFriends,
  FaUserInjured,
  FaUserMd,
  FaCog,
} from 'react-icons/fa'
import { MdDashboard, MdLocalPharmacy } from 'react-icons/md'
import useAuthStore from '@/store/auth'

interface SideNavProps {
  role: 'admin' | 'doctor' | 'patient' | 'pharmacist'
  onNavigate?: () => void
}

export default function SideNav({ role, onNavigate }: SideNavProps) {
  // Role-specific navigation items
  const roleNavItems = {
    admin: [
      {
        icon: <MdDashboard size={20} />,
        label: 'Dashboard',
        to: '/Dashboard/admin/dashboard',
      },
      {
        icon: <FaUserFriends size={18} />,
        label: 'Users',
        to: '/Dashboard/admin/users',
      },
      {
        icon: <FaUserInjured size={18} />,
        label: 'Patients',
        to: '/Dashboard/admin/patients',
      },
      {
        icon: <FaUserMd size={18} />,
        label: 'Doctors',
        to: '/Dashboard/admin/doctors',
      },
      {
        icon: <MdLocalPharmacy size={20} />,
        label: 'Pharmacists',
        to: '/Dashboard/admin/pharmacists',
      },
      {
        icon: <FaCalendarAlt size={18} />,
        label: 'Appointments',
        to: '/Dashboard/admin/appointments',
      },
      {
        icon: <MdLocalPharmacy size={20} />,
        label: 'Pharmacy Orders',
        to: '/Dashboard/admin/pharmacy_orders',
      },
      {
        icon: <FaMoneyBill size={18} />,
        label: 'Payments',
        to: '/Dashboard/admin/payments',
      },
      {
        icon: <FaPills />,
        label: 'Medicines',
        to: '/Dashboard/admin/medicines',
      },
      {
        icon: <FaFileMedical size={18} />,
        label: 'Records',
        to: '/Dashboard/admin/records',
      },
    ],
    doctor: [
      {
        icon: <MdDashboard size={20} />,
        label: 'Dashboard',
        to: '/Dashboard/doctor',
      },
      {
        icon: <FaCalendarAlt size={18} />,
        label: 'Appointments',
        to: '/Dashboard/doctor/appointments',
      },
      {
        icon: <FaUserInjured size={18} />,
        label: 'Patients',
        to: '/Dashboard/doctor/patient',
      },
      {
        icon: <FaFileMedical size={18} />,
        label: 'Medical Records',
        to: '/Dashboard/doctor/records',
      },
      {
        icon: <FaCog size={18} />,
        label: 'Settings',
        to: '/Dashboard/doctor/settings',
      },
    ],
    patient: [
      
     {
        icon: <FaCalendarAlt size={18} />,
        label: 'Appointments',
        to: '/Dashboard/patient/appointments',
      },
      {
        icon: <FaFileMedical size={18} />,
        label: 'Medical Records',
        to: '/Dashboard/patient/medical-records',
      },
      {
        icon: <FaPills />,
        label: 'Medicines',
        to: '/Dashboard/patient/medicines/',
      },
      {
        icon: <MdLocalPharmacy size={20} />,
        label: 'Orders',
        to: '/Dashboard/patient/orders',
      },
      {
        icon: <FaUserMd size={18} />,
        label: 'Doctors',
        to: '/Dashboard/patient/doctors/',
      },
      {
        icon: <FaProcedures size={18} />,
        label: 'General Settings',
        to: '/Dashboard/patient/settings',
      },
    ],
    pharmacist: [
      {
        icon: <MdLocalPharmacy size={20} />,
        label: 'Pharmacy Orders',
        to: '/Dashboard/pharmarcist/pharmacy_orders',
      },
      {
        icon: <FaHospitalUser size={18} />,
        label: 'Patients',
        to: '/Dashboard/pharmarcist/patients',
      },
      {
        icon: <FaChartLine size={18} />,
        label: 'Records',
        to: '/Dashboard/pharmarcist/records',
      },
      {
        icon: <FaPills />,
        label: 'Medicines',
        to: '/Dashboard/pharmarcist/medicines',
      },
      {
        icon: <FaMoneyBill size={18} />,
        label: 'Payments',
        to: '/Dashboard/pharmarcist/payments',
      },
      {
        icon: <FaCog size={18} />,
        label: 'General Settings',
        to: '/Dashboard/pharmarcist/settings',
      },
    ],
  }

  const navItems = [...(roleNavItems[role] || [])]

  return (
    <nav className="sticky top-0 h-screen z-30 bg-amber-100 shadow flex flex-col">
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-500 group"
                activeProps={{ className: 'bg-blue-100 text-blue-600' }}
                onClick={onNavigate}
              >
                <span className="text-gray-500 group-hover:text-blue-600 mr-3">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
              {/* Remove the extra logout button for pharmacist */}
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = '/login';
              }}
              className="w-full mt-2 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex justify-center text-center"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
