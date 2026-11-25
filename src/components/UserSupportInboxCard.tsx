"use client";
import React, { useCallback, useEffect, useState } from "react";
import { MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TicketItem {
  id: string;
  category: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

interface Props {
  userId: string | null;
  isHe: boolean;
  compact?: boolean;
}

export default function UserSupportInboxCard({ userId, isHe, compact = false }: Props) {
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  const loadTickets = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("support_tickets")
      .select("id, category, message, status, admin_reply, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6);
    setTickets((data as TicketItem[]) || []);
  }, [userId]);

  useEffect(() => {
    loadTickets();
    const onSync = () => loadTickets();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [loadTickets]);

  if (!userId || tickets.length === 0) return null;
  const visible = compact ? tickets.filter((t) => Boolean(t.admin_reply)) : tickets;
  if (visible.length === 0) return null;

  return (
    <div
      dir={isHe ? "rtl" : "ltr"}
      className="card-surface"
      style={{
        padding: 14,
        marginTop: compact ? 0 : 12,
        marginBottom: compact ? 16 : 0,
        textAlign: isHe ? "right" : "left",
        border: "1px solid rgba(56,189,248,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <MessageSquare size={15} color="#38bdf8" />
        <strong style={{ fontSize: 13, color: "#f8fafc" }}>
          {isHe ? "\u05EA\u05D9\u05D1\u05EA \u05E4\u05E0\u05D9\u05D5\u05EA \u05D5\u05EA\u05E9\u05D5\u05D1\u05D5\u05EA \u05E6\u05D5\u05D5\u05EA \u05D4\u05EA\u05DE\u05D9\u05DB\u05D4" : "Support Inbox & Admin Replies"}
        </strong>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map((tk) => (
          <div key={tk.id} style={{ padding: "9px 11px", borderRadius: 9, background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{tk.category}</span>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: tk.admin_reply ? "#34d399" : "#fbbf24", display: "inline-flex", alignItems: "center", gap: 3 }}>
                {tk.admin_reply ? <><CheckCircle2 size={11} /> {isHe ? "\u05E0\u05E2\u05E0\u05D4" : "REPLIED"}</> : <><Clock size={11} /> {isHe ? "\u05D1\u05D8\u05D9\u05E4\u05D5\u05DC" : "OPEN"}</>}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: tk.admin_reply ? 6 : 0 }}>{tk.message}</div>
            {tk.admin_reply && (
              <div style={{ padding: "7px 9px", borderRadius: 8, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", fontSize: 12, color: "#6ee7b7" }}>
                <strong>{isHe ? "\u05EA\u05E9\u05D5\u05D1\u05EA \u05D4\u05D0\u05D3\u05DE\u05D9\u05DF:" : "Admin Reply:"}</strong> {tk.admin_reply}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}