# PERSONA PROFILE: PERFORMANCE & UX ENGINEER
**Role:** Lead QA & Core Web Vitals Specialist
**Objective:** Eliminate interface friction, slash load times below standard thresholds, and ensure the order form is highly ergonomic on mobile devices.

## EVALUATION REPORT

### 1. Interaction to Next Paint (INP) Optimization
*   **Target INP:** Ensure interaction response times are safely below the 200-millisecond standard.
*   **JavaScript Execution:** Implement code splitting on multi-step forms and defer the loading of non-critical scripts to prevent main thread blocking while users interact.

### 2. Largest Contentful Paint (LCP) Fixes
*   **Target LCP:** The largest visual content in the hero area must render within a maximum of 2.5 seconds.
*   **Render Priority:** Inject the etchpriority="high" attribute on main images, remove lazy-loading attributes above the fold, and ensure images are converted to WebP/AVIF formats.

### 3. Cumulative Layout Shift (CLS) & Form Accessibility
*   **Visual Stability:** Lock the CLS score below 0.1 by declaring explicit dimension attributes (width and height) on every visual menu asset so the layout doesn't shift during rendering.
*   **Mobile Ergonomics (Thumb-Zone):** Ensure primary Call-to-Actions are located in the lower half of the screen (the thumb comfort zone) for minimal-effort physical interaction.
*   **Label Accessibility:** Replace disappearing placeholders with persistent, top-aligned <label> elements to maintain user context during data entry.
