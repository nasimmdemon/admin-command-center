import { ClientStatusTable } from "@/views/monitor/ClientStatusTable";
import { MOCK_CLIENTS } from "@/models/monitor-data";

export const ClientStatusTableDemo = () => (
  <div className="bg-card rounded-xl border overflow-hidden">
    <div className="p-5 border-b">
      <h2 className="font-semibold text-foreground">Client Status</h2>
    </div>
    <ClientStatusTable clients={MOCK_CLIENTS} />
  </div>
);
