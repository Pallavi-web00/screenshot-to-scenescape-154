import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "./BrandLogo";
import { brand } from "@/content/home";

/** Minimal structural footer for phase one. Doubles as the #contact anchor. */
export function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-20 border-t border-border bg-surface">
      <div className="container-site flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <BrandLogo className="h-10" />
          <p className="mt-4 text-muted-foreground">
            People. Processes. Progress. <span className="text-gradient font-semibold">Together.</span>
          </p>
        </div>
        <a
          href={brand.website}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 font-display text-2xl font-bold text-foreground md:text-3xl"
        >
          {brand.websiteLabel}
          <ArrowUpRight className="size-6 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
      </div>
      <div className="container-site border-t border-border py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
