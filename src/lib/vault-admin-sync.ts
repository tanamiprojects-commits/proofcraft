export interface VaultResetTicket {
  id: string;
  userEmail: string;
  requestType: "recover_with_key" | "full_wipe_reset";
  verificationNote: string;
  status: "pending" | "approved" | "rejected";
  approvalCode: string;
  createdAt: string;
}

export interface VaultGovernancePolicy {
  enabled: boolean;
  notice: string;
  requireAdminForReset: boolean;
}
