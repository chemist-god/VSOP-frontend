/**
 * Placeholder terms copy for v1. Keep `version` in sync with
 * `CURRENT_TERMS_VERSION` in `backend/src/users/domain/terms.constants.ts`.
 * Bumping this later re-triggers the agreement step (tour stays completed)
 * for every user whose `termsVersion` no longer matches.
 */
export const CURRENT_TERMS_VERSION = "v1.0.0";

export interface TermsSection {
  heading: string;
  body: string[];
}

export const TERMS: {
  version: string;
  title: string;
  effectiveDate: string;
  sections: TermsSection[];
} = {
  version: CURRENT_TERMS_VERSION,
  title: "VSOP Terms of Service & Acceptable Use",
  effectiveDate: "July 2026",
  sections: [
    {
      heading: "1. Purpose of the platform",
      body: [
        "VSOP is an internal support-operations tool for VeriTrack staff. It centralizes client portal tickets, team assignments, and resolution tracking so nothing gets lost in a chat thread again.",
        "Access is invite-only. Your account is tied to your VeriTrack identity and may be suspended if your employment or engagement ends.",
      ],
    },
    {
      heading: "2. Acceptable use",
      body: [
        "Use VSOP only for legitimate support operations: triaging tickets, coordinating with teammates, and communicating with client portals you're authorized to support.",
        "Don't share login credentials, export client data for purposes outside support delivery, or use the platform to access portals or tickets outside your assigned scope.",
      ],
    },
    {
      heading: "3. Data handling & confidentiality",
      body: [
        "Ticket content, screenshots, and portal metadata may include confidential client information. Treat everything you see in VSOP as confidential, even after you leave the team.",
        "Report suspected data exposure or account compromise to an admin immediately so access can be rotated.",
      ],
    },
    {
      heading: "4. Availability & changes",
      body: [
        "VSOP is provided as an internal tool without uptime guarantees. Features, workflows, and this agreement may change as the product evolves — material changes will prompt you to re-accept.",
        "Feedback is welcome any time; the fastest path to a better tool is telling the team what's slowing you down.",
      ],
    },
    {
      heading: "5. Acknowledgement",
      body: [
        "By accepting below, you confirm you've read this agreement and will use VSOP responsibly and within the scope of your role.",
      ],
    },
  ],
};
