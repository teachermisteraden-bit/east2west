// Programme order and grouping. Text lives in messages/*.json under programmes.items.<key>.
export type Stage = "learn" | "connect" | "build" | "earn";
export const programmes: { key: string; stage: Stage; icon: string }[] = [
  { key: "businessEnglish", stage: "learn", icon: "speech" },
  { key: "workplaceArabic", stage: "learn", icon: "letter" },
  { key: "financialLiteracy", stage: "learn", icon: "ledger" },
  { key: "careerReadiness", stage: "learn", icon: "document" },
  { key: "networking", stage: "connect", icon: "circle" },
  { key: "mentorship", stage: "connect", icon: "guide" },
  // Launchpad Labs sits ahead of the clinic on purpose: the lab is where a
  // member finds the problem worth solving, the clinic is where the thing built
  // to solve it becomes a venture.
  { key: "launchpadLabs", stage: "build", icon: "lab" },
  { key: "startupClinic", stage: "build", icon: "seed" },
  { key: "talentDirectory", stage: "earn", icon: "index" },
  { key: "hiringEvents", stage: "earn", icon: "door" },
];
