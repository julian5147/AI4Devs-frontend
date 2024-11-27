export interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

export interface InterviewStep {
  id: number;
  name: string;
  interviewFlowId: number;
  interviewTypeId: number;
  orderIndex: number;
}

export interface InterviewFlow {
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  };
}

export interface Process {
  interviewFlow: InterviewFlow;
}
