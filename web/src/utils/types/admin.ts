export type DelegateType =
  | ""
  | "all"
  | "single_delegate"
  | "team_delegate"
  | "faculty_advisor"
  | "observer";
export type TimeWave = "all" | "earlybird" | "regular" | "late";

export interface MUNDelegate {
  mun_delegate_email: string;
  mun_delegate_name: string;
  type?: string | null;
  pair?: string | null;
  council?: string | null;
  country?: string | null;
  confirmed: "confirmed" | "rejected" | "pending";
  confirmed_date?: string | null;
  council_date?: string | null;
  insert_date: string;
  participant_type: string;
}

export interface TeamDelegateGroup {
  mun_team_id?: string | null;
  mun_team_lead: string;
  delegates: MUNDelegate[];
  delegate_count: number;
}

export interface TeamPaymentSummary {
  mun_team_id?: string | null;
  mun_team_lead: string;
  team_payments: PaymentResponseWithTeam[];
  total_amount: number;
  payment_count: number;
  pending_count: number;
  paid_count: number;
  failed_count: number;
}

export interface PaymentResponseWithTeam {
  payment_id: string;
  mun_delegate_email: string;
  mun_team_id?: string | null;
  package: string;
  payment_file: string;
  payment_status: "pending" | "paid" | "failed";
  payment_date: string;
  payment_amount: number;
  participant_type: string;
}

export interface TeamPositionPaperGroup {
  mun_team_id?: string | null;
  mun_team_lead: string;
  position_papers: PositionPaper[];
  paper_count: number;
}

export interface PositionPaper {
  mun_delegate_email: string;
  submission_file: string;
  submission_date: string;
  submission_status: "submitted" | "approved" | "rejected";
}
