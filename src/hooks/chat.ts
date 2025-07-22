import { useMutation } from "@tanstack/react-query";
import { Ava } from "@/api/chat";

export const useAiModel = () => {
  return useMutation({
    mutationFn: Ava,
    mutationKey: ['aiModel'],
  });
};