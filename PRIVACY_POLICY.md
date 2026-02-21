# Privacy Policy — A11Y Order Helper

**Last updated: 2026-02-21**

## Overview

A11Y Order Helper is a Chrome browser extension that visualizes keyboard focus order and screen reader reading order on any webpage. This Privacy Policy explains what data the extension accesses, how it is used, and what it does not do.

---

## Data Collection

**A11Y Order Helper does not collect any data.**

The extension does not gather, store, transmit, or share any personal information, browsing history, page content, or user activity data with any party — including the developer.

---

## Local Storage

The extension uses `chrome.storage.local` solely to persist user interface preferences between sessions. The following values are stored **locally on your device only**:

| Key | Description |
|---|---|
| `readerType` | Selected accessibility mode (Focus order / VoiceOver / NVDA) |
| `overlayTheme` | Selected visual theme (Default / Minimal) |
| `annotation` | Verification label typed by the user (e.g. tester name or scenario description) |

These values:
- never leave your device
- are never sent to any server, API, or third party
- are used exclusively to restore your last-used settings when you reopen the popup

---

## Page Content Access

When you click **Run**, the extension injects a content script into the currently active tab. This script:

- reads the **DOM structure** of the page to identify focusable and readable elements
- computes element **positions** using the browser's built-in `getBoundingClientRect()` API
- renders a numbered visual overlay **entirely within your browser**

The script does **not** read, copy, transmit, or store any text content, form data, passwords, URLs, cookies, or personally identifiable information present on the page.

The overlay is removed completely when you click **Stop** or close the tab.

---

## Permissions

| Permission | Why it is needed |
|---|---|
| `activeTab` | To inject the overlay into the tab you are currently auditing, only on explicit user action (clicking Run) |
| `storage` | To save your UI preferences locally between sessions |
| `<all_urls>` (host permission) | Accessibility auditors need to inspect any page, including internal tools, staging environments, and third-party sites. No background activity occurs without user action. |

---

## Remote Code

This extension **does not use remote code**. All JavaScript is bundled at build time and shipped inside the extension package. No external scripts, CDNs, or APIs are loaded at runtime.

---

## Third Parties

A11Y Order Helper does not integrate with, transmit data to, or share data with any third-party service, analytics platform, advertising network, or external API.

---

## Children's Privacy

This extension does not target children and does not knowingly collect any information from users of any age, as it collects no information at all.

---

## Changes to This Policy

If the extension's data practices change in a future version, this policy will be updated and the **Last updated** date at the top will reflect the change.

---

## Contact

If you have questions about this privacy policy, you can reach the developer at:

**MgrGracz** — [https://mgrgracz.netlify.app/](https://mgrgracz.netlify.app/)
