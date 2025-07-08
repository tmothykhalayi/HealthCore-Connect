import type { TPatient } from "@/Types/types";

export const getPatientsFn = async (page = 1, limit = 10, search = ''): Promise<{
  patients: TPatient[];
  total: number;
}> => {
  const response = await fetch(`/api/patients?page=${page}&limit=${limit}&search=${search}`);
  const data = await response.json();
  return {
    patients: data.patients,
    total: data.total,
  };
};

export const deletePatientFn = async (patientId: number): Promise<void> => {
  const response = await fetch(`/api/patients/${patientId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete patient');
  }
};
