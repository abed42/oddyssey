import { PRODUCT } from "@/lib/peitho/config";
import { cn } from "@/lib/utils";

// The logotype: "Odd" carries the weight (it's an odds market), the rest is light.
export function Wordmark({ className }: { className?: string }) {
  const name = PRODUCT.name;
  return (
    <span className={cn("tracking-tight text-foreground", className)}>
      <span className="font-extrabold">{name.slice(0, 3)}</span>
      <span className="font-medium">{name.slice(3)}</span>
    </span>
  );
}
