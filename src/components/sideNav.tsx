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
  FaMoneyBill,
} from 'react-icons/fa'
import { MdDashboard, MdLocalPharmacy } from 'react-icons/md'

interface SideNavProps {
  role: 'admin' | 'doctor' | 'patient' | 'pharmacist'
}

export default function SideNav({ role }: SideNavProps) {
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
        icon: <FaCalendarAlt size={18} />,
        label: 'Appointments',
        to: '/Dashboard/admin/appointments',
      },
      {
        icon: <FaPrescriptionBottleAlt size={18} />,
        label: 'Prescriptions',
        to: '/Dashboard/admin/prescriptions',
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
        label: 'Records',
        to: '/Dashboard/doctor/records',
      },
      {
        icon: <FaPrescriptionBottleAlt size={18} />,
        label: 'Prescriptions',
        to: '/Dashboard/doctor/prescriptions',
      },
    ],
    patient: [
      {
        icon: <FaUserMd size={18} />,
        label: 'Doctors',
        to: '/Dashboard/patient/doctors',
      },
      {
        icon: <FaPills />,
        label: 'Medicines',
        to: '/Dashboard/patient/medicines',
      },
      {
        icon: <FaCalendarAlt size={18} />,
        label: 'Appointments',
        to: '/Dashboard/patient/appointments',
      },
      {
        icon: <MdLocalPharmacy size={20} />,
        label: 'Pharmacy Orders',
        to: '/Dashboard/patient/pharmacy_orders',
      },
    ],
    pharmacist: [
      {
        icon: <MdLocalPharmacy size={20} />,
        label: 'Pharmacy Orders',
        to: '/Dashboard/pharmarcist/pharmacy_orders',
      },
      {
        icon: <FaPrescriptionBottleAlt size={18} />,
        label: 'Prescriptions',
        to: '/Dashboard/pharmarcist/prescriptions',
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
        icon: <FaMoneyBill size={18} />,
        label: 'Payments',
        to: '/Dashboard/pharmarcist/payments',
      },
    ],
  }

  const navItems = [...(roleNavItems[role] || [])]

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
