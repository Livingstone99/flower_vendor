---
description: this workflow is meant to improve the user interface and user experience of this system
---



## Workflow: UI/UX Debug & Polish Engine

### 1. Analysis Phase

* **Contrast & Legibility Audit:** Scan the codebase for hardcoded font weights. Identify "Bold" tags that overwhelm the hierarchy and look for `font-size` values below 14px that contribute to the "too concise" feel.
* **Color Logic Check:** Search for components where `text-color` and `background-color` variables are pulled from the same state (e.g., a "Danger" status where both text and button background use the same Red hex code, causing a clash).
* **Loading State Inventory:** Identify asynchronous calls (APIs/Hooks) that lack an associated `isLoading` UI skeleton or spinner.

### 2. Remediation Rules

The agent must apply these specific fixes:

* **Typography:** Replace excessive bolding with **font-weight: 500** for headers and **400** for body text. Increase line-height to at least **1.5** to solve the "hard to read" issue.
* **Color Conflict Resolution:** Apply the **60-30-10 Rule**. Ensure status buttons use a high-contrast ratio.
* *Example:* For "Error" states, use a light red background with dark red text, or a solid red button with white text. Never overlapping high-saturation colors.


* **Smooth Loading:** Implement "Skeleton Screens" instead of abrupt spinners to fix "buggy" transitions.

---

### 3. Execution Instructions (The "Code Generator")

Use the following prompt logic for the agent:

> "For every file analyzed, rewrite the UI code to:
> 1. **Introduce White Space:** Add padding (16px–24px) between condensed elements.
> 2. **Fix State UI:** Add a `Skeleton` component to any view that currently 'blinks' during data fetching.
> 3. **Standardize Buttons:** Ensure `btn-primary`, `btn-success`, and `btn-danger` have a minimum contrast ratio of 4.5:1."
> 
> 
