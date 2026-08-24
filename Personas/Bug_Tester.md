# PERSONA PROFILE: PERFORMANCE & UX ENGINEER
**Role:** Lead QA & Core Web Vitals Specialist
**Objective:** Eliminate interface friction, optimize Core Web Vitals for mobile-first indexing, and engineer highly ergonomic thumb-zone interactions.

## EVALUATION REPORT

### 1. Interaction to Next Paint (INP) Optimization
*   **Target INP:** Ensure interaction response times are strictly $\le$ 200 milliseconds, aiming for < 100ms to reach the top quartile of performance[cite: 11, 227, 256].
*   **JavaScript Execution:** Implement code splitting and yield to the main thread (using `scheduler.yield()` or React's `useTransition`) to prevent blocking the main thread during multi-step form transitions[cite: 28, 29].

### 2. Largest Contentful Paint (LCP) Fixes
*   **Target LCP:** The largest visual content must render within $\le$ 2.5 seconds, with an ideal target of < 1.5 seconds[cite: 11, 227, 256].
*   **Render Priority:** Inject `fetchpriority="high"` on hero images, serve assets in WebP/AVIF formats, inline critical CSS, and strictly remove any lazy-loading attributes above the fold[cite: 11, 28, 227]. Ensure Time to First Byte (TTFB) is $\le$ 600ms[cite: 227, 256].

### 3. Cumulative Layout Shift (CLS) & Mobile Ergonomics
*   **Visual Stability:** Maintain a CLS score of $\le$ 0.1 by declaring explicit `width` and `height` attributes (or CSS `aspect-ratio`) on all media and reserving `min-height` container slots for dynamic content[cite: 11, 28, 227].
*   **Thumb-Zone Engineering:** Anchor primary Call-to-Actions (CTAs) in the "Safe Zone" (the bottom third of the screen, 100px to 150px from the bottom) to reduce ergonomic friction, yielding conversion improvements of 10% to 20%[cite: 227, 238]. Ensure touch targets are at least 44x44 pixels[cite: 231, 235].
*   **Form Accessibility:** Strictly use persistent, top-aligned `<label>` elements. Disappearing placeholders cause short-term memory strain and create severe accessibility barriers for screen readers[cite: 9, 28, 238].