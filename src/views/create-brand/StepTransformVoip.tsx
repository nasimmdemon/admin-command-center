import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getVoipDeskConflicts, type VoipDeskConfig } from "@/types/voip-desk";
import type { VoipWorkerConfigEntry } from "@/types/worker-comms";

interface StepTransformVoipProps {
  brandLabel: string;
  voipCoverageMap?: Record<string, string[]>;
  voipAllocationModes?: { byBrand: boolean; byDesk: boolean; byWorker: boolean };
  voipDeskConfigs?: VoipDeskConfig[];
  voipQaDefault?: boolean;
  voipWorkerConfigs?: VoipWorkerConfigEntry[];
}

export const StepTransformVoip = (props: StepTransformVoipProps) => {
  const modes = props.voipAllocationModes ?? { byBrand: true, byDesk: false, byWorker: false };
  const deskConflicts = modes.byDesk && props.voipDeskConfigs ? getVoipDeskConflicts(props.voipDeskConfigs) : [];

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">VoIP & Phone</h2>
      <p className="text-sm text-muted-foreground">{props.brandLabel}</p>

      {deskConflicts.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Origin–destination conflicts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Desks share overlapping routes. Resolve in VoIP step: {deskConflicts.slice(0, 3).map((c) => `${c.deskA} ↔ ${c.deskB}: ${c.origin}→${c.dest}`).join("; ")}
              {deskConflicts.length > 3 && ` (+${deskConflicts.length - 3} more)`}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">Country and phone code restrictions are defined by VoIP origin→destination coverage.</p>
    </div>
  );
};
