# AILabel oversight levels (O1–O5)

A Vite + React demo built with [Carbon Design System](https://carbondesignsystem.com/)'s
`AILabel` component, showing how the same AI-disclosure UI needs different
confirmation and audit behavior wrapped around it depending on the risk level
of the AI-driven action. Built to compare against an internal AI
design-system doc that currently describes these oversight requirements in
prose only, with no working reference components.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

## What each level demonstrates

All five sections use the same Carbon `AILabel` component, attached to a
form field via its `decorator` prop. What differs is the interaction wrapped
around it:

- **O1 — AI-generated summary (very low risk).** An AI-generated ticket
  summary with an `AILabel` disclosure attached. No confirmation is
  required and there is no gate before it's shown.

- **O2 — AI-translated text field (low risk).** A translated reply with an
  `AILabel` disclosure. A "Simulate human edit" button lets you toggle the
  content between an "AI-generated" and "human-edited" state, and the
  `AILabel`'s revert action lets you go back to the original AI output.

- **O3 — AI-drafted reply (moderate risk).** A drafted reply that does
  nothing until the user explicitly clicks **Confirm** or **Cancel**. The
  resulting state (sent vs. discarded) is shown after the choice.

- **O4 — AI-recommended refund (high risk).** A recommended refund action
  where **Confirm refund** stays disabled until a specific named approver
  is chosen from a dropdown — not just any signed-in user, a named person.

- **O5 — AI-flagged system access change (critical risk).** A flagged
  high-impact action that requires **two different named reviewers** to be
  selected before it unlocks. Each reviewer selection and the final unlock
  are logged with a timestamp to a visible audit trail.
