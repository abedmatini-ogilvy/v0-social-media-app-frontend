# Color Theme Guide

## Overview

This document outlines the color theme choices for the application. Use this as a reference when updating other pages to maintain consistency.

## Color Palette

### Primary Colors

| Purpose                | Tailwind Class                            | Hex/HSL           |
| ---------------------- | ----------------------------------------- | ----------------- |
| **Primary Button**     | `bg-emerald-600 hover:bg-emerald-700`     | #059669 / #047857 |
| **Primary Text/Links** | `text-emerald-700 hover:text-emerald-900` | #047857 / #064e3b |
| **Active Tab**         | `bg-emerald-600 text-white`               | #059669           |
| **Focus Ring**         | `--ring: 160 84% 39%` (in globals.css)    | Emerald           |

### Background Colors

| Purpose             | Tailwind Class       | Hex                           |
| ------------------- | -------------------- | ----------------------------- |
| **Page Background** | `bg-[#F0F2F5]`       | #F0F2F5 (Facebook-style gray) |
| **Card Background** | `bg-white` (default) | #FFFFFF                       |

### Border Colors

| Purpose          | Tailwind Class       |
| ---------------- | -------------------- |
| **Card Border**  | `border-emerald-100` |
| **Input Border** | `border-emerald-200` |

### Status Colors (Keep as-is)

| Purpose     | Tailwind Class                                |
| ----------- | --------------------------------------------- |
| **Error**   | `text-red-600 bg-red-50 border-red-200`       |
| **Info**    | `text-blue-700 bg-blue-50 border-blue-200`    |
| **Success** | `text-green-600 bg-green-50 border-green-200` |

---

## Component Patterns

### Page Container

```jsx
<div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] p-4">
```

### Back Link

```jsx
<Link
  href="/"
  className="absolute top-4 left-4 flex items-center text-emerald-700 hover:text-emerald-900"
>
  <ArrowLeft className="h-4 w-4 mr-1" />
  <span>Back to Home</span>
</Link>
```

### Tabs

```jsx
<TabsTrigger
  value="example"
  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
>
  Tab Label
</TabsTrigger>
```

### Card

```jsx
<Card className="border-emerald-100 shadow-lg">
```

### Input

```jsx
<Input
  className="border-emerald-200"
  // ... other props
/>
```

### Select Trigger

```jsx
<SelectTrigger className="border-emerald-200">
```

### Primary Button

```jsx
<Button className="w-full bg-emerald-600 hover:bg-emerald-700">
  Button Text
</Button>
```

### Text Link

```jsx
<Link
  href="/example"
  className="text-emerald-700 hover:text-emerald-900 font-medium"
>
  Link Text
</Link>
```

### Small Link (e.g., "Forgot password?")

```jsx
<Link
  href="/forgot-password"
  className="text-xs text-emerald-700 hover:text-emerald-900"
>
  Forgot password?
</Link>
```

---

## Files Already Updated

- ✅ `/app/login/page.tsx`
- ✅ `/app/signup/page.tsx`
- ✅ `/app/globals.css` (focus ring updated to emerald)

## Files To Update

The following pages still use the old purple theme and need to be updated:

### High Priority (User-facing)

- [ ] `/app/page.tsx` (Home page)
- [ ] `/app/profile/page.tsx`
- [ ] `/app/connections/page.tsx`
- [ ] `/app/community/page.tsx`
- [ ] `/app/messages/page.tsx`
- [ ] `/app/notifications/page.tsx`
- [ ] `/app/settings/page.tsx`

### Components

- [ ] `/components/desktop-header.tsx`
- [ ] `/components/mobile-header.tsx`
- [ ] `/components/left-sidebar.tsx`
- [ ] `/components/sidebar.tsx`
- [ ] `/components/social-feed.tsx`
- [ ] `/components/mobile-footer-nav.tsx`
- [ ] `/components/mobile-tabs.tsx`
- [ ] `/components/notification-center.tsx`
- [ ] `/components/mobile-nav.tsx`
- [ ] `/components/mobile-sidebar.tsx`
- [ ] `/components/mention-input.tsx`
- [ ] `/components/language-switcher.tsx`
- [ ] `/components/footer.tsx`

### Other Pages

- [ ] `/app/about/page.tsx`
- [ ] `/app/help/page.tsx`
- [ ] `/app/privacy/page.tsx`
- [ ] `/app/terms/page.tsx`
- [ ] `/app/schemes/page.tsx`
- [ ] `/app/jobs/page.tsx`
- [ ] `/app/events/page.tsx`
- [ ] `/app/search/page.tsx`
- [ ] `/app/admin/page.tsx`
- [ ] `/app/analytics/page.tsx`

---

## Search & Replace Reference

When updating files, use these replacements:

| Find                                      | Replace With                |
| ----------------------------------------- | --------------------------- |
| `from-purple-50 to-white`                 | `bg-[#F0F2F5]`              |
| `purple-50`                               | `emerald-50` or `[#F0F2F5]` |
| `purple-100`                              | `emerald-100`               |
| `purple-200`                              | `emerald-200`               |
| `purple-400`                              | `emerald-400`               |
| `purple-500`                              | `emerald-500`               |
| `purple-600`                              | `emerald-600`               |
| `purple-700`                              | `emerald-700`               |
| `purple-800`                              | `emerald-800`               |
| `purple-900`                              | `emerald-900`               |
| `from-blue-600 to-purple-600`             | `bg-emerald-600` (solid)    |
| `from-blue-500 to-purple-500`             | `bg-emerald-500` (solid)    |
| `hover:from-blue-700 hover:to-purple-700` | `hover:bg-emerald-700`      |

---

## globals.css Changes Made

```css
/* Focus ring changed from purple to emerald */
--ring: 160 84% 39%; /* Was: 262.1 83.3% 57.8% (purple) */
```

---

## Design Decisions

1. **Solid Emerald over Gradients**: We chose solid emerald buttons (`bg-emerald-600`) instead of gradients for a cleaner, more modern look.

2. **Facebook-style Background**: Using `#F0F2F5` (cool gray) as the page background provides a familiar, professional feel that complements the emerald accent color.

3. **Emerald Color Family**: Emerald (green) was chosen as the primary brand color for a fresh, trustworthy appearance.

4. **Consistent Borders**: All form elements use `emerald-200` borders, cards use `emerald-100` borders.

---

_Last updated: December 2024_
