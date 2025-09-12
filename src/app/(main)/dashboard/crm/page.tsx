import { InsightCards } from "../camaras/_components/insight-cards";
import { OperationalCards } from "../camaras/_components/operational-cards";
import { OverviewCards } from "../camaras/_components/overview-cards";
import { TableCards } from "../camaras/_components/table-cards";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards />
      <InsightCards />
      <OperationalCards />
      <TableCards />
    </div>
  );
}
