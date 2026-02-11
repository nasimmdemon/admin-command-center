import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Client {
  id: number;
  name: string;
  clientName: string;
  status: string;
  paid: string;
}

interface ClientStatusTableProps {
  clients: Client[];
}

export const ClientStatusTable = ({ clients }: ClientStatusTableProps) => (
  <>
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Client Name</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Paid</th>
            <th className="text-right p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, i) => (
            <motion.tr
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
              className="border-b last:border-0 hover:bg-secondary/30 transition-colors duration-300"
            >
              <td className="p-4 font-medium text-foreground">{c.name}</td>
              <td className="p-4 text-muted-foreground">{c.clientName}</td>
              <td className="p-4">
                <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>{c.status}</span>
              </td>
              <td className="p-4 text-foreground">{c.paid}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="outline" size="sm" className="text-xs">Close</Button>
                <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="md:hidden p-4 space-y-3">
      {clients.map((c) => (
        <div key={c.id} className="rounded-lg border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">{c.name}</span>
            <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>{c.status}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{c.clientName}</span>
            <span>{c.paid}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs flex-1">Close</Button>
            <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
          </div>
        </div>
      ))}
    </div>
  </>
);
