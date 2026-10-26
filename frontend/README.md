# Lifeline 360 — Frontend

The public Lifeline 360 website (Scope of Work §13): the landing page and every
public page, built with React 19, Vite, Tailwind CSS v4 and Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint     # oxlint
npm run smoke    # renders every route and checks one <h1> per page
```

## Routes

| Path                        | Page                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `/`                         | Landing page: hero, Ayushman (PM-JAY) hospital search, 7 more sections, app/partner call to action |
| `/about`                    | About Lifeline 360 and the seven apps and panels                                                   |
| `/ayushman-hospitals`       | Full PM-JAY hospital locator, scheme facts, journey and FAQs                                       |
| `/services`                 | All services                                                                                       |
| `/services/:slug`           | `ambulance`, `nursing-caretaker`, `medicine`, `laboratory`, `blood-bank`                           |
| `/membership`               | Membership plans and benefits                                                                      |
| `/partners`                 | Partner types, onboarding and registration form                                                    |
| `/contact`                  | Contact channels and form (`?topic=membership` preselects a topic)                                 |
| `/faqs`                     | Searchable FAQs                                                                                    |
| `/privacy-policy`, `/terms` | Legal pages (drafts, see below)                                                                    |

## Structure

Each product area is a module under `src/modules`. The public website is the
`landing-page` module, mounted at `/` by `src/routes/AppRoutes.jsx`; later
modules (e.g. an admin panel) mount beside it.

```text
src/
├── components/          shared building blocks (no page knowledge)
│   ├── brand/           Logo + LogoMark
│   ├── forms/           FloatingField, SelectField, SubmitButton, FormStatus, HoneypotField
│   ├── layout/          BackToTop
│   ├── motion/          Reveal, StaggerGroup, PageTransition, shared variants
│   ├── seo/             per-page <title> and meta tags
│   └── ui/              Button, Icon, Photo, Container, SectionHeading, Badge
├── config/              site.js (brand + contact details), env.js
├── hooks/               useFormSubmit, useScrolled, useLockBodyScroll
├── index.css            design tokens (the whole theme lives here)
├── modules/
│   └── landing-page/
│       ├── LandingRoutes.jsx   route table for the public site
│       ├── assets/images/      optimised WebP photography
│       ├── components/
│       │   ├── common/         PageHero, ServiceCard, JourneyTimeline, FaqAccordion, CtaBand…
│       │   ├── forms/          ContactForm, PartnerForm
│       │   ├── mockups/        app UI illustrations (status cards, live map, phone, membership card)
│       │   └── sections/       the landing page sections
│       ├── data/               all copy: services, FAQs, membership, partners, legal, navigation
│       ├── layout/             SiteHeader, ServicesMenu, MobileNav, SiteFooter, LandingLayout
│       ├── pages/              one file per route
│       ├── schemas.js          zod validation for the forms
│       └── services/           enquiryService (form submission)
└── routes/              AppRoutes, ScrollToTop
```

## Design system

All colours, fonts, shadows and animations are tokens in `src/index.css`
(`@theme`). Components use the token utilities (`bg-brand-600`, `text-ink-500`,
`shadow-card`…), never raw hex values.

- **brand** (medical blue): primary actions, links, focus
- **aqua** (clinical cyan): live states and secondary highlights
- **ink** (blue-tinted neutrals): text, borders, surfaces, dark bands
- **emergency** (red): reserved for ambulance and blood requests only
- **Fonts**: Manrope (headings) and Figtree (body), loaded from Google Fonts in
  `index.html`. Devanagari falls back per glyph, ready for Hindi.

Motion respects `prefers-reduced-motion` globally (`MotionConfig` in `App.jsx`
plus a CSS kill switch in `index.css`).

## Content and placeholders

- **All copy** lives in `src/modules/landing-page/data/` and is drawn from the
  Scope of Work. Change a service there and the cards, menu, service page and
  journeys update together.
- **Placeholders to replace before launch** (all in `src/config/site.js`):
  phone `+91 98765 43210`, `care@lifeline360.in`, `partners@lifeline360.in`,
  office address. Social links go in `siteConfig.socials`.
- **Membership prices** are not set: plans show "Price announced at launch".
  Fill `price` in `data/membership.js` and the cards render it.
- **App store badges** say "Coming soon"; swap in the official badges and links
  once the apps are published (`components/common/StoreBadges.jsx`).
- **Legal pages** are drafts written from the Scope of Work and are marked as
  such on screen. They must be reviewed by the client's legal counsel.
- **App mockups** use sample names and figures (e.g. "Aarav Sharma", ETA 7 min)
  purely as illustration.
- **Ayushman (PM-JAY) hospitals are sample listings** (`data/hospitals.js`):
  names, numbers and bed counts are invented, every card says "Sample listing",
  and sample phone numbers are never dialable. Load the official list of
  PM-JAY empanelled hospitals, set `isSampleDirectory = false`, and the labels
  disappear and numbers become tap-to-call. Each record needs
  `name, state, city, area, coords [lat, lng], phone, beds, specialities,
emergency24x7, bloodBank`; new cities go in `cities` with their centre.

## Forms (contact, partner registration, ambulance and blood requests)

The backend has no enquiry endpoints yet, so the forms validate fully but run in
**preview mode**: nothing is sent, and the form says so on screen. To go live,
set `VITE_ENQUIRY_API_URL` (see `.env.example`). The forms then `POST` JSON to
`${VITE_ENQUIRY_API_URL}/contact`, `/partner`, `/ambulance` and `/blood` (the
last two come from the hospital locator and include `hospitalId` and
`hospitalName`). The endpoint should reply `{ message }`, or `{ message, fieldErrors }` with a 4xx
status, and field errors show under the matching inputs.

## Photography

Free-to-use photos from [Pexels](https://www.pexels.com/license/) (no attribution
required), cropped and converted to WebP. Sources, for the record:

| File                | Pexels photo                                                                           |
| ------------------- | -------------------------------------------------------------------------------------- |
| hero-doctor-patient | [18870282](https://www.pexels.com/photo/18870282/) (cropped to remove a clinic poster) |
| ambulance-pune      | [7527770](https://www.pexels.com/photo/7527770/)                                       |
| caretaker-home      | [7551654](https://www.pexels.com/photo/7551654/)                                       |
| nurse-home-visit    | [7345465](https://www.pexels.com/photo/7345465/)                                       |
| medicine-strips     | [3873150](https://www.pexels.com/photo/3873150/)                                       |
| medicine-tablets    | [28300481](https://www.pexels.com/photo/28300481/)                                     |
| lab-sample          | [6627693](https://www.pexels.com/photo/6627693/)                                       |
| lab-technician      | [6285380](https://www.pexels.com/photo/6285380/)                                       |
| blood-donor         | [12820063](https://www.pexels.com/photo/12820063/)                                     |
| blood-bag           | [4680222](https://www.pexels.com/photo/4680222/)                                       |
| family-generations  | [18394079](https://www.pexels.com/photo/18394079/)                                     |
| senior-couple       | [19811308](https://www.pexels.com/photo/19811308/)                                     |
| doctor-lab-delhi    | [5738735](https://www.pexels.com/photo/5738735/)                                       |
| doctors-xray        | [8770713](https://www.pexels.com/photo/8770713/)                                       |
| support-agent       | [7709255](https://www.pexels.com/photo/7709255/)                                       |
| partners-phone      | [5327867](https://www.pexels.com/photo/5327867/)                                       |
| doctor-consultation | [14558560](https://www.pexels.com/photo/14558560/)                                     |
| hospital-entrance   | [263402](https://www.pexels.com/photo/263402/)                                         |
| hospital-help-desk  | [4269274](https://www.pexels.com/photo/4269274/)                                       |
