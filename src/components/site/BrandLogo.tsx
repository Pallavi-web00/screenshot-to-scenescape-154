import logo from "@/assets/devops-manager-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="DevOps Manager LLP"
      width={480}
      height={160}
      className={cn("h-10 w-auto select-none", className)}
      draggable={false}
    />
  );
}
