import { Candidate, Process } from "../types/position";

const API_URL = "http://localhost:3010";

export const getInterviewFlow = async (
  positionId: string
): Promise<Process> => {
  const response = await fetch(
    `${API_URL}/position/${positionId}/interviewFlow`
  );
  if (!response.ok) {
    throw new Error("Error al obtener el flujo de entrevista");
  }
  return response.json();
};

export const getCandidates = async (
  positionId: string
): Promise<Candidate[]> => {
  const response = await fetch(`${API_URL}/position/${positionId}/candidates`);
  if (!response.ok) {
    throw new Error("Error al obtener los candidatos");
  }
  return response.json();
};

export const updateCandidateStep = async (
  candidateId: string,
  applicationId: string,
  newStepId: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/candidate/${candidateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationId,
      currentInterviewStep: newStepId,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la etapa del candidato");
  }
};
