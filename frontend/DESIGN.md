# design.md

## Overview

This document specifies the Vercel-inspired design language for the AI Portfolio Builder platform workspace. The visual signature relies on a stark, disciplined interaction between a light near-white canvas (`#fafafa`) and deep ink-black typography/primitives (`#171717`). High-impact energetic mesh gradients provide decorative depth, while a strict typography system differentiates between administrative text and technical data content. 

---

## Colors

### Brand & Accent Colors
* **Ink / Primary:** `#171717` — The core conversion target, primary text, and dark-mode polarity-flip surface.
* **On-Primary:** `#ffffff` — Text and iconography displayed on top of solid primary surfaces.
* **Link Blue:** `#0070f3` — Text inline links and positive confirmation signals.
* **Link Deep:** `#0761d1` — Visited and pressed link variants.
* **Link Background Soft:** `#d3e5ff` — Pastel blue highlight fill for notifications, badges, and announcement banners.

### Surface System
* **Canvas:** `#ffffff` — Pure white for elevated component cards, panels, and dropdown drawers.
* **Canvas Soft:** `#fafafa` — The dominant application background (98% white) used for dashboard grids and studio wrapper panels.
* **Canvas Soft 2:** `#f5f5f5` — Sub-panels, inactive navigation states, item hover targets, and text input regions.
* **Hairline:** `#ebebeb` — Crisp 1px division line separating components, borders, and layout bounds.
* **Hairline Strong:** `#a1a1a1` — High-contrast border definitions and disabled asset indicators.

### Decorative Interface Gradient
The system leverages a responsive multicolor ambient backdrop to signify AI computational execution states:
* **Mesh Gradient Palette:** Interlocking stops of Cyan (`#50e3c2`), Violet (`#7928ca`), and Highlight Pink (`#ff0080`).
* **Usage:** Applied as a blurred static background behind workspace empty states, landing hero section backgrounds, and loading states.

---

## Typography

### Font Systems
1. **Geometric Sans (Inter / System Sans):** Used for narratives, dashboards, workspace headers, landing pages, and system menus. Maximum font weight capped at `600`. Employs negative character tracking for structural emphasis.
2. **Monospace (JetBrains Mono / System Mono):** Reserved strictly for code execution displays, technical metadata labels, side-chat prompt commands, and structural tags.

### Typographic Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Context / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | 48px | 600 | 48px | -2.4px | Hero headers and landing page titles. |
| `display-lg` | 32px | 600 | 40px | -1.28px | Layout section headings & primary dashboard titles. |
| `display-md` | 24px | 600 | 32px | -0.96px | Workspace panel names and auth card headings. |
| `body-lg` | 18px | 400 | 28px | 0px | Hero subheaders and context descriptions. |
| `body-md` | 16px | 400 | 24px | 0px | Sidebar message chat bubbles, system copy. |
| `body-sm` | 14px | 400 | 20px | -0.28px | Inactive menu links, form label fields, secondary data. |
| `body-sm-strong`| 14px | 500 | 20px | -0.28px | Button components, active navigation elements. |
| `caption-mono` | 12px | 400 | 16px | 0px | Date-stamps, technical section subtitles, tag rows. |
| `code` | 13px | 400 | 20px | 0px | Raw code inspector viewports, prompt parameters. |

---

## Layout & Spatial Spacing

### Spacing Scale
* **Base Metric:** 4px incremental scale.
* **Tokens:** `xxs: 4px` · `xs: 8px` · `sm: 12px` · `md: 16px` · `lg: 24px` · `xl: 32px` · `2xl: 40px` · `3xl: 48px` · `4xl: 64px`.

### Component Corner Radii
* `rounded.sm` (`6px`): Native control elements—text input fields, prompt textareas, action buttons.
* `rounded.md` (`8px`): Portfolio preview cards, dashboard items, auth panel layout blocks.
* `rounded.lg` (`12px`): Execution canvas containers, modal popups.
* `rounded.pill` (`100px`): Outer structural action items, marketing-tier triggers, and core action items (e.g., "Deploy Project").

---

## Component-Based Architectural Specifications

### 1. Navigation Components
#### `NavBar` (Global App Header)
* **Properties:** Fixed top (`64px` height). Background: `#ffffff`, Border Bottom: `1px solid #ebebeb`.
* **State Variation - Unauthenticated:** * Left: Platform Logo text.
  * Right: Flex row containing `ButtonSecondary` ("Sign In") + `ButtonPrimary` ("Sign Up").
* **State Variation - Authenticated:**
  * Left: Platform Logo text + `NavLink` linked to `/dashboard`.
  * Right: Flex row containing Google Profile Metadata Badge (Avatar image with `rounded.full`).

#### `NavLink`
* **Properties:** Typography `body-sm-strong`, Color: `#4d4d4d`. Transition to `#171717` on hover with a subtle underlying dot indicator.

### 2. Marketing & Landing Page Components
#### `HeroSection`
* **Properties:** Centered layout context, padding top/bottom: `4xl (64px)`. Features a soft, uncropped ambient `Mesh Gradient` backdrop blurring underneath.
* **Typography Elements:**
  * Eyebrow: `caption-mono` ("AUTOMATED PORTFOLIO GENERATION FOR DEVELOPERS.") set in uppercase.
  * Main Title: `display-xl`, Color: `#171717`, sentence-case, explicitly period-terminated (e.g., "From raw resume to a live deployment in seconds.").
  * Subtitle description: `body-lg`, Color: `#4d4d4d`, maximum paragraph boundary width `600px`.
* **Action Row:** Flex row containing `ButtonPrimary` ("Get Started for Free") + `ButtonSecondary` ("View Examples").

### 3. Authentication Page Components (`/login` & `/signup`)
#### `AuthShell`
* **Properties:** Centered single-column structural system (`min-height: 100vh`), Background color: `#fafafa`.
#### `AuthCard`
* **Properties:** Width: `420px`, Background: `#ffffff`, Border: `1px solid #ebebeb`, Border-Radius: `8px`, Padding: `xl (32px)`. Shadow: Level 5 Modal treatment.
* **Children Elements:**
  * Header: `display-md` centered title + `body-sm` toggle navigation link ("Already have an account? Log in").
  * Form Blocks: Array of vertical layout steps stacked with `xs (8px)` padding.
  * `GoogleAuthButton`: Fixed height `40px`, Background: `#ffffff`, Border: `1px solid #ebebeb`, Border-Radius: `6px`. Contains the Google multicolor emblem vector left-aligned with centered text context `body-sm-strong` ("Continue with Google").

### 4. Dashboard Components (`/dashboard`)
#### `DashboardLayout`
* **Properties:** Centered horizontal container width maxed at `1400px`, padding: `lg (24px)`.
* **Header Block:** Horizontal flex row containing title (`display-lg`) + `ButtonPrimary` with an explicitly paired leading icon element ("+ New Portfolio").
#### `WorkspaceGrid`
* **Properties:** CSS Grid infrastructure layout displaying `3-up` columns on modern viewports, shifting to `1-up` columns layout parameters on mobile breaking targets.
#### `WorkspaceCard`
* **Properties:** Background: `#ffffff`, Border: `1px solid #ebebeb`, Border-Radius: `8px`, Padding: `lg (24px)`. Shadow: Level 2 Multi-layered offset (`0px 1px 1px #00000005`, `0px 2px 2px #0000000a`). Elevates to high-contrast border outline alignment on active state hover parameters.
#### `CreateWorkspaceTriggerCard`
* **Properties:** Dashed stroke border color `#ebebeb`, background fill `#fafafa`, centered text interaction block rendering a `caption-mono` typography label block.

### 5. Studio Workspace Components (Split Layout Workspace)
#### `StudioLayout`
* **Properties:** Split-panel interface calculation (`height: calc(100vh - 64px)`). Separated into two primary structural columns.

+-----------------------------------------------------------------------------------+
| [Logo] My Workspaces / Portfolio Studio Workspace              [Download] [Deploy]|
+------------------------------------------+----------------------------------------+
|                                          |                                        |
|         CHAT SIDEBAR (LEFT PANEL)        |       SANDBOX VIEWPORT (RIGHT PANEL)   |
|         Width: 400px                     |       Width: Flex / Remaining Viewport |
|         Border-Right: 1px solid #ebebeb  |       Background: #fafafa              |
|                                          |                                        |
|  +------------------------------------+  |  +----------------------------------+  |
|  | [Context Badge: Resume Extracted]  |  |  |  [Sandbox Window Iframe]         |  |
|  +------------------------------------+  |  |  |                               |  |
|  |                                    |  |  |  - Renders Generated HTML Body|  |
|  |  (Scrollable Chat Messages Array)  |  |  |  - Completely Isolated Styles |  |
|  |                                    |  |  |                               |  |
|  +------------------------------------+  |  |                                 |  |
|  | [Prompt Input Box]              [^] |  |  |                                 |  |
|  +------------------------------------+  |  +----------------------------------+  |
+------------------------------------------+----------------------------------------+

#### `ChatSidebarPanel` (Left Column)
* **Dimensions:** Fixed base horizontal width (`400px`). Border-Right: `1px solid #ebebeb`.
* **Sub-Components:**
  * `ChatMessageBubble (User)`: Right-aligned, Background: `#f5f5f5`, Typography: `body-md`.
  * `ChatMessageBubble (System - Mistral)`: Left-aligned, Background: `#ffffff`, Border: `1px solid #ebebeb`, Typography: `body-md`.
  * `PromptInputDock`: Textarea field tracking `rounded.sm` utilizing `body-sm`. Contains an absolute positioned action execution arrow icon (`[^]`).

#### `SandboxViewportPanel` (Right Column)
* **Properties:** Fluid flex width structural allocation, padding scale `xl (32px)`, background layout background fill: `#fafafa`.
* **`SandboxIframe` Window Component:**
  * Height property: `100%`. Background configuration: Pure `#ffffff`. Shape factor: `12px` border-radius edge layout.
  * Shadow Structure (Level 4 Float): `0px 2px 2px #0000000a`, `0px 8px 16px -4px #0000000a`. Houses the running standalone runtime document window object (`<iframe>`).

### 6. Control & Input Primitive Components
#### `ButtonPrimary`
* **Properties:** Background: `#171717`, Color: `#ffffff`, Typography: `body-sm-strong`, Border-Radius: `6px` (`rounded.sm`), Height: `40px`, Padding: `0px 16px`.
#### `ButtonSecondary`
* **Properties:** Background: `#ffffff`, Color: `#171717`, Border: `1px solid #ebebeb`, Typography: `body-sm-strong`, Border-Radius: `6px`, Height: `40px`, Padding: `0px 16px`.
#### `FormInputField`
* **Properties:** Background: `#ffffff`, Color: `#171717`, Border: `1px solid #ebebeb`, Typography: `body-sm`, Border-Radius: `6px`, Height: `40px`, Padding: `0px 12px`. Focus State: Border color switches to `#171717` instantly with an explicit inner shadow adjustment step.

---

## UI Elevation Scale

* **Level 0 (Flat):** Page base backgrounds, sandbox backing panel layer (`#fafafa`).
* **Level 1 (Subtle Line Interaction):** Divider panels, structural borders, header boundaries (`1px solid #ebebeb`).
* **Level 2 (Dashboard Cards):** `0px 1px 1px #00000005, 0px 2px 2px #0000000a` — Standard grid asset configurations.
* **Level 4 (Studio Sandbox Display):** `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a` — Elevated sandboxed preview containers.
* **Level 5 (Modals & Authentication Elements):** `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f` — Elevated dialog instances, auth wrapper sheets.

---

## Design Directives (Do's and Don'ts)

### Do:
* **Maintain Font Isolation Principles:** Render conversational elements exclusively inside the Geometric Sans (`Inter`) token hierarchy, and raw code, configuration structures, and timeline indices in Monospace (`JetBrains Mono`).
* **Enforce Clean Page Routing Layout Separation:** Keep clear bounding steps when building components; an authentication card dashboard block behaves differently from fluid-width layout sandbox execution zones.
* **Isolate Visual Preview Layers:** Run the backend-generated text execution string safely within an `<iframe>` container element node to avoid parent system layout stylesheet contamination.

### Don't:
* **Avoid Nested Layer Shadows:** Do not cascade heavy structural multi-blur styling effects across standard component cards; follow the explicit elevation definitions.
* **Prevent Layout Overlap:** Never embed floating floating controls inside the sandbox preview window; keep all interactive layout switches inside the structural sidebar container wrapper.