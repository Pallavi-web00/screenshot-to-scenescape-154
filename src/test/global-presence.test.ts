import { describe, expect, it } from "vitest";

import { globalPresence } from "@/content/home";
import { MAP_HEIGHT, MAP_WIDTH, project } from "@/lib/world-map";

const byId = Object.fromEntries(globalPresence.locations.map((l) => [l.id, l]));

describe("Global Presence locations", () => {
  it("lists Dubai, Mangalore and Bangalore as operational", () => {
    for (const id of ["dubai", "mangalore", "bangalore"]) {
      expect(byId[id]?.status).toBe("operational");
      expect(byId[id]?.statusLabel).toBe("Operational Location");
    }
  });

  it("lists California, United States as coming soon", () => {
    expect(byId["california"]?.status).toBe("coming-soon");
    expect(byId["california"]?.statusLabel).toBe("Coming Soon");
    expect(byId["california"]?.country).toBe("United States");
  });

  it("places every marker inside the map, California west of Dubai and Dubai west of India", () => {
    const pts = Object.fromEntries(globalPresence.locations.map((l) => [l.id, project(l.lat, l.lon)]));
    for (const p of Object.values(pts)) {
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(MAP_WIDTH);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(MAP_HEIGHT);
    }
    expect(pts["california"]!.x).toBeLessThan(pts["dubai"]!.x);
    expect(pts["dubai"]!.x).toBeLessThan(pts["mangalore"]!.x);
    expect(pts["mangalore"]!.x).toBeLessThan(pts["bangalore"]!.x);
  });
});
