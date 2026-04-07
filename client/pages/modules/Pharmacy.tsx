import Placeholder from "../Placeholder";
import { Pill } from "lucide-react";

export default function Pharmacy() {
  return (
    <Placeholder
      title="Pharmacy Management"
      description="Complete pharmacy inventory system with stock management, automated alerts, supplier management, and purchase order creation."
      icon={<Pill className="w-10 h-10" />}
    />
  );
}
