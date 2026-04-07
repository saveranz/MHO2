import Placeholder from "../Placeholder";
import { Receipt } from "lucide-react";

export default function Billing() {
  return (
    <Placeholder
      title="Billing & Payments"
      description="Comprehensive billing system with flexible discount management, multiple payment types, automatic invoicing, and instant receipt generation."
      icon={<Receipt className="w-10 h-10" />}
    />
  );
}
