interface DelegateRegistration {
  mun_delegates: {
    mun_delegate_email: string;
    type?: string;
    council?: string;
    country?: string;
    participant_type: "single_delegate" | "observer" | "faculty_advisor" | "team_delegate";
  };
  biodata_responses: BiodataResponse[];
  health_responses: HealthResponse[];
  mun_responses: MunResponse[];
}

interface BiodataResponse {
  biodata_question_id: number;
  delegate_email: string;
  biodata_answer_text: string;
}

interface HealthResponse {
  health_question_id: number;
  delegate_email: string;
  health_answer_text: string;
}

interface MunResponse {
  mun_question_id: number;
  delegate_email: string;
  mun_answer_text: string;
}

export type { DelegateRegistration, BiodataResponse, HealthResponse, MunResponse };
