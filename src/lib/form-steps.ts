import { programmes } from "@/content/programmes";

/**
 * Which fields appear on which step, per mode.
 *
 * Commitment and consistency (02): the easiest question comes first — who you
 * are — and the mode itself was already chosen on /join, so the thread arrives
 * with its first node already filled. That is endowed progress, and it is real:
 * the visitor genuinely has completed a step.
 *
 * Keep these short. The intro promises "about 2 minutes", and that estimate has
 * to stay true.
 */
export const MODES = ["graduate", "university", "sponsor", "business", "chapter"] as const;
export type Mode = (typeof MODES)[number];

/** Field names, matching the Zod schemas exactly. */
export type FieldName = string;

export const formSteps: Record<Mode, FieldName[][]> = {
  graduate: [
    ["fullName", "email", "mobile", "city", "nationality"],
    ["status", "university", "fieldOfStudy", "graduationYear"],
    ["interests", "languages", "womensCircle", "linkedin", "contribute", "consent"],
  ],
  university: [
    ["institution", "city"],
    ["contactName", "role", "email", "phone"],
    ["interest", "semester", "message", "consent"],
  ],
  sponsor: [
    ["company", "sector"],
    ["contactName", "role", "email", "phone"],
    ["options", "budget", "message", "consent"],
  ],
  business: [
    ["company", "sector"],
    ["contactName", "role", "email", "phone"],
    ["roles", "hiringNeeds", "message", "consent"],
  ],
  chapter: [
    ["fullName", "email", "mobile"],
    ["chapterCity", "coDirector", "message", "consent"],
  ],
};

/** Total nodes on the thread: the mode choice, plus each field step. */
export const totalNodes = (mode: Mode): number => formSteps[mode].length + 1;

export const isMode = (value: unknown): value is Mode =>
  typeof value === "string" && (MODES as readonly string[]).includes(value);

/** Choice fields and their option keys, so the form and the schema cannot drift. */
export const fieldOptions: Record<string, readonly string[]> = {
  status: ["statusGraduate", "statusStudent"],
  interest: ["interestCampusChapter", "interestTraining", "interestHiringEvent", "interestChallengeCycle"],
  options: ["programme", "hiringEvent", "chapterPatron", "scholarship", "keynoteSeries", "summit"],
  roles: ["rolesNetworking", "rolesKeynote", "rolesHiring", "rolesChallenge"],
  coDirector: ["coDirectorYes", "coDirectorNo", "coDirectorNotYet"],
  // Derived, not restated. This table's own comment promised the form and the
  // schema could not drift, and then Launchpad Labs was added to the programme
  // list and this stayed at nine: the programmes page showed ten, the form
  // offered nine, and the tenth was quietly unreachable. One source of truth.
  interests: programmes.map((p) => p.key),
};

/**
 * Where each choice field's option labels live in the message catalogue.
 *
 * Three different places, because the approved copy already named these things
 * and re-keying beats rewriting:
 *   fields     — join.fields.*, where the kit already had them
 *   options    — join.options.*, re-keyed from approved page copy
 *   programmes — programmes.items.<key>.name, the programmes themselves
 */
export const optionLabelSource: Record<string, "fields" | "options" | "programmes"> = {
  status: "fields",
  roles: "fields",
  interest: "options",
  options: "options",
  coDirector: "options",
  interests: "programmes",
};

/** The enum value each option key maps to in the Zod schema. */
export const optionValues: Record<string, string> = {
  statusGraduate: "graduate",
  statusStudent: "student",
  interestCampusChapter: "campusChapter",
  interestTraining: "training",
  interestHiringEvent: "hiringEvent",
  interestChallengeCycle: "challengeCycle",
  programme: "programme",
  hiringEvent: "hiringEvent",
  chapterPatron: "chapterPatron",
  scholarship: "scholarship",
  keynoteSeries: "keynoteSeries",
  summit: "summit",
  rolesNetworking: "networking",
  rolesKeynote: "keynote",
  rolesHiring: "hiring",
  rolesChallenge: "challenge",
  coDirectorYes: "yes",
  coDirectorNo: "no",
  coDirectorNotYet: "notYet",
};

/** Fields the visitor may leave blank. Everything else is required. */
export const optionalFields = new Set([
  "languages",
  "womensCircle",
  "linkedin",
  "contribute",
  "semester",
  "message",
  "budget",
  "hiringNeeds",
]);

/** Multi-select fields. */
export const multiFields = new Set(["interests", "interest", "options", "roles"]);

/** Single-choice fields. */
export const choiceFields = new Set(["status", "coDirector"]);

/** Long-form text fields. */
export const textAreaFields = new Set(["contribute", "message", "hiringNeeds"]);
