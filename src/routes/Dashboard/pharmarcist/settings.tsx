import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePharmacistProfile, useUpdatePharmacist } from '@/hooks/pharmacist';
import { createFileRoute } from '@tanstack/react-router';

export default function PharmacistSettings() {
  const { data: pharmacist, isLoading } = usePharmacistProfile();
  const updatePharmacist = useUpdatePharmacist();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    licenseNumber: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (pharmacist) {
      setForm({
        firstName: pharmacist.user?.firstName || '',
        lastName: pharmacist.user?.lastName || '',
        email: pharmacist.user?.email || '',
        phoneNumber: pharmacist.user?.phoneNumber || '',
        licenseNumber: pharmacist.licenseNumber || '',
      });
    }
  }, [pharmacist]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacist?.id) return;
    updatePharmacist.mutate(
      {
        pharmacistId: pharmacist.id,
        pharmacistData: { license_number: form.licenseNumber }, // Only licenseNumber is updatable in backend
      },
      {
        onSuccess: () => setMessage('Profile updated successfully!'),
        onError: () => setMessage('Failed to update profile.'),
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h1 className="text-2xl font-bold mb-4">General Settings</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={updatePharmacist.isPending}
            >
              {updatePharmacist.isPending ? 'Updating...' : 'Update Profile'}
            </button>
            {message && <div className="text-center text-sm mt-2">{message}</div>}
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute('/Dashboard/pharmarcist/settings')({
  component: PharmacistSettings,
}); 