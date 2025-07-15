import { createPatientFn, deletePatientFn, getPatientsFn } from "@/API/patients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPatientQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['patients', page, limit, search],
    queryFn: () => getPatientsFn(page, limit, search),
  });
}

// hooks/patientsHook.ts
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatientFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['patients'],
        exact: false
      });
      // Optional: Add a success notification
      alert('Patient created successfully!');
    },
    onError: (error: Error) => {
      console.error('Creation error:', error);
      alert(`Error creating patient: ${error.message}`);
    }
  });
}

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatientFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export const useGetSinglePatient = (patientId: number) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatientsFn(patientId),
    enabled: !!patientId, // Only fetch if patientId exists
  });
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatientFn, // Assuming createPatientFn can also handle updates
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.patient_id] });
    },
  });
}