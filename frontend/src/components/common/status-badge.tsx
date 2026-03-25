import { cn } from "@/lib/utils";

type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "graduated"
  | "suspended"
  | "withdrawn"
  | "present"
  | "absent"
  | "late"
  | "excused"
  | "paid"
  | "overdue"
  | "accepted"
  | "rejected"
  | "reviewing"
  | "interview"
  | "enrolled"
  | "on_leave";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: "Actif", className: "bg-success-100 text-success-700" },
  inactive: { label: "Inactif", className: "bg-muted text-muted-foreground" },
  pending: { label: "En attente", className: "bg-warning-100 text-warning-700" },
  completed: { label: "Termine", className: "bg-success-100 text-success-700" },
  cancelled: { label: "Annule", className: "bg-error-100 text-error-700" },
  graduated: { label: "Diplome", className: "bg-primary-100 text-primary-700" },
  suspended: { label: "Suspendu", className: "bg-error-100 text-error-700" },
  withdrawn: { label: "Retire", className: "bg-muted text-muted-foreground" },
  present: { label: "Present", className: "bg-success-100 text-success-700" },
  absent: { label: "Absent", className: "bg-error-100 text-error-700" },
  late: { label: "En retard", className: "bg-warning-100 text-warning-700" },
  excused: { label: "Excuse", className: "bg-primary-100 text-primary-700" },
  paid: { label: "Paye", className: "bg-success-100 text-success-700" },
  overdue: { label: "En retard", className: "bg-error-100 text-error-700" },
  accepted: { label: "Admis", className: "bg-success-100 text-success-700" },
  rejected: { label: "Refuse", className: "bg-error-100 text-error-700" },
  reviewing: { label: "En revue", className: "bg-warning-100 text-warning-700" },
  interview: { label: "Entretien", className: "bg-primary-100 text-primary-700" },
  enrolled: { label: "Inscrit", className: "bg-success-100 text-success-700" },
  on_leave: { label: "En conge", className: "bg-warning-100 text-warning-700" },
};

interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  className?: string;
}

export function StatusBadge({ status, customLabel, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", config.className.replace("bg-", "bg-").replace("-100", "-500"))} />
      {customLabel || config.label}
    </span>
  );
}

export type { StatusType };
