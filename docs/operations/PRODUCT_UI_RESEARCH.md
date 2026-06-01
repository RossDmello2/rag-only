# Product UI Research

Date: 2026-05-17

## UI Direction

The app should behave like a compact work tool, not a landing page. The first screen remains the usable document assistant with settings, status, upload, and chat controls available immediately.

## Applied UI Decisions

- Preserve the floating assistant workflow.
- Keep the local service status pills visible.
- Keep settings dense and operational.
- Add keyboard focus visibility, Escape close, focus restoration, and a modal focus trap.
- Remove unsupported cloud-key controls from the production UI.

## Responsive Expectations

- Desktop: fixed assistant panel.
- Mobile: full-screen assistant panel with one-column settings.
- Browser smoke tests cover both layouts.

## 2026-06-01 UI And Discovery Notes

- The first screen remains the usable assistant, not a landing page.
- Metadata was improved in the HTML head without changing visible workflow or layout.
- Future UI behavior changes should be documented under `docs/features/browser-ui.md` and covered by Playwright when user-visible.
