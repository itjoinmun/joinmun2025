import { 
  TeamDelegateGroup, 
  TeamPaymentSummary, 
  TeamPositionPaperGroup, 
  AmalgamatedResponse,
  DelegateType,
  TimeWave 
} from "@/utils/types/admin";

const API_BASE_URL = "http://localhost:8080/api/v1/admin";

// Participant actions
export const approveParticipantRegistration = async (participantEmail: string) => {
  const response = await fetch(`${API_BASE_URL}/dashboard/update-participant-status`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_email: participantEmail }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to approve registration: ${response.statusText}`);
  }
  
  return response.json();
};

export const updateDelegateCountryAndCouncil = async (
  delegateEmail: string,
  country: string,
  council: string
) => {
  const response = await fetch(`${API_BASE_URL}/dashboard/update-participant-cc`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      delegate_email: delegateEmail,
      country,
      council 
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update country and council: ${response.statusText}`);
  }
  
  return response.json();
};

export const approvePayment = async (delegateEmail: string) => {
  const response = await fetch(`${API_BASE_URL}/payment/update-payment-status`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delegate_email: delegateEmail }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to approve payment: ${response.statusText}`);
  }
  
  return response.json();
};

// Data fetching functions
export const getDelegatesByTeam = async (
  delegateType: DelegateType = '',
  timeWave: TimeWave = '',
  limit: number = 50,
  offset: number = 0
): Promise<{ delegates_by_team: TeamDelegateGroup[]; total_teams: number }> => {
  const params = new URLSearchParams({
    delegate_type: delegateType,
    time: timeWave,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/page/delegates?${params}`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch delegates: ${response.statusText}`);
  }
  
  return response.json();
};

export const getPaymentsByTeam = async (
  delegateType: DelegateType = '',
  timeWave: TimeWave = '',
  limit: number = 50,
  offset: number = 0
): Promise<{ payments_by_team: Record<string, TeamPaymentSummary[]>; total_payments: number }> => {
  const params = new URLSearchParams({
    delegate_type: delegateType,
    time: timeWave,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/page/payments?${params}`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch payments: ${response.statusText}`);
  }
  
  return response.json();
};

export const getPositionPapersByTeam = async (
  timeWave: TimeWave = '',
  limit: number = 50,
  offset: number = 0
): Promise<{ papers_by_team: TeamPositionPaperGroup[]; total_teams: number }> => {
  const params = new URLSearchParams({
    time: timeWave,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/page/position-paper?${params}`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch position papers: ${response.statusText}`);
  }
  
  return response.json();
};

export const downloadResponsesCSV = async (
  delegateType: DelegateType = '',
  limit: number = 1000,
  offset: number = 0
): Promise<void> => {
  const params = new URLSearchParams({
    delegate_type: delegateType || 'all',
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/page/responses?${params}`, {
    method: "GET",
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to download responses: ${response.statusText}`);
  }
  
  // Get filename from Content-Disposition header
  const contentDisposition = response.headers.get('Content-Disposition');
  const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'responses.csv';
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
