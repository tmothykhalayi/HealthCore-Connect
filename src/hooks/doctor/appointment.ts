import { deleteAppointmentFn, getAppointmentsFn } from "@/API/doctor API/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAppointmentsQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['appointments', page],
    queryFn: () => getAppointmentsFn(page),
  });
}

export const useGetAppointmentsByIdQuery = (appointmentId: number) => {
  return useQuery({
    queryKey: ['appointments', appointmentId],
    queryFn: () => getAppointmentsFn(appointmentId),
  });
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAppointmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}