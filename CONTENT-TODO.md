# Content TODO

Everything below is **missing or unconfirmed** content. Nothing has been invented to fill these gaps:
each item is stored as a `"TODO: …"` value in [`content/site.json`](content/site.json), and **the site
automatically hides anything still marked TODO** (e.g. no phone number, prices, policies page or guide
profiles are shown until you add them).

To fill an item: replace the TODO text in `content/site.json` with the real value and push to `main`.
`npm run build` prints the current TODO list (64 items at the time of writing).

## Highest priority

- [ ] **Real phone number** — the old site's (575) 555-RAFT is a fictional 555 number, so it was removed.
- [ ] **Real address / meeting point** — the old site's "123 River Rd" looked like a placeholder, so it is not shown.
- [ ] **Prices** for each trip.
- [ ] **Policies** (cancellation, waivers, weather, deposits) — the Policies page appears automatically once any is filled in.
- [ ] **Our own photos.** Every photo on the site is a public-domain/CC0 landscape from Wikimedia Commons
      (mostly U.S. Bureau of Land Management). There are **no photos of our own trips, boats or guides** yet.
      Please supply real trip photos (rafts, guests with permission, guides). Do not use photos that show
      another outfitter's name or logo on boats, PFDs, helmets, vans or shirts. See "Photos" below.
- [ ] **Confirm the business name** — the old site used both "Taos River Adventures" and "Taos Rafting Co".
      The new site uses "Taos River Adventures" as the name and "Taos Rafting Co" as the logo text.

## Facts carried over from the old site (please confirm)

These came from the original site's own copy and are shown as-is. They were not invented, but please
confirm they are accurate: founded **1998**; started as a "two-boat operation"; "one of New Mexico's top
outdoor outfitters"; guides "certified" and "many with us for over a decade"; hours **8am – 6pm daily**;
email **info@taosraftingco.com**; Half-Day Whitewater = **3 hours, Lower Gorge, daily departures**;
Full-Day Racecourse = **Class III, riverside lunch**; Scenic Float = **minimal paddling**; Private = **half or full day**.

## Business & contact

- [ ] **business.legalNameNote** — confirm the official business name. The old site used both 'Taos River Adventures' and 'Taos Rafting Co'.
- [ ] **contact.phone** — real phone number. The old site showed (575) 555-RAFT (7238), but 555 numbers are fictional and cannot be dialled.
- [ ] **contact.phoneHref** — same phone in +1XXXXXXXXXX form, for tap-to-call
- [ ] **contact.streetAddress** — real street address. The old site showed '123 River Rd, Taos, NM 87571', which looks like a placeholder.
- [ ] **contact.postalCode** — ZIP code of the address above
- [ ] **contact.locationNote** — e.g. 'Just 10 minutes from downtown Taos' (from the old site; confirm once the real address is set)
- [ ] **contact.meetingPoint** — where guests meet on trip day (place name, parking, what time to arrive)
- [ ] **contact.mapUrl** — Google Maps or OpenStreetMap link to the meeting point
- [ ] **contact.directions** — driving directions from Taos Plaza / Santa Fe / Albuquerque
- [ ] **contact.bookingUrl** — optional online booking link (e.g. FareHarbor/Peek) if you use one. Leave as TODO to keep the email booking form.
- [ ] **contact.social[0].handle** — confirm handle (old site said @taosraftingco)
- [ ] **contact.social[0].url** — https://www.instagram.com/<handle>/
- [ ] **contact.social[1].handle** — channel name (old site said 'new trip videos on YouTube every month')
- [ ] **contact.social[1].url** — channel link

## Trips

- [ ] **Half-Day Whitewater →.difficulty** — rapid class for the Lower Gorge run (e.g. Class II–III)
- [ ] **Half-Day Whitewater →.minAge** — minimum age
- [ ] **Half-Day Whitewater →.fitness** — fitness level / paddling required
- [ ] **Half-Day Whitewater →.season** — season months
- [ ] **Half-Day Whitewater →.price** — price per adult / child
- [ ] **Half-Day Whitewater →.includes[0]** — what's included (e.g. guide, raft, PFD, helmet, wetsuit, transport)
- [ ] **Half-Day Whitewater →.meetingTime** — check-in time(s)
- [ ] **Full-Day Racecourse →.schedule** — departure days
- [ ] **Full-Day Racecourse →.minAge** — minimum age
- [ ] **Full-Day Racecourse →.fitness** — fitness level / paddling required
- [ ] **Full-Day Racecourse →.season** — season months
- [ ] **Full-Day Racecourse →.price** — price per adult / child
- [ ] **Full-Day Racecourse →.includes[2]** — other inclusions (gear, transport, etc.)
- [ ] **Full-Day Racecourse →.meetingTime** — check-in time(s)
- [ ] **Full-Day Racecourse →.durationNote** — confirm this trip is full-day (the Racecourse is often run as a half-day)
- [ ] **Scenic Float →.difficulty** — water class (e.g. Class I–II)
- [ ] **Scenic Float →.duration** — trip length
- [ ] **Scenic Float →.schedule** — departure days
- [ ] **Scenic Float →.minAge** — minimum age
- [ ] **Scenic Float →.season** — season months
- [ ] **Scenic Float →.price** — price per adult / child
- [ ] **Scenic Float →.includes[0]** — what's included
- [ ] **Scenic Float →.meetingTime** — check-in time(s)
- [ ] **Custom Private Trips →.river** — which stretches are available for private trips
- [ ] **Custom Private Trips →.difficulty** — range of difficulty available
- [ ] **Custom Private Trips →.schedule** — availability
- [ ] **Custom Private Trips →.minAge** — minimum age
- [ ] **Custom Private Trips →.fitness** — fitness level
- [ ] **Custom Private Trips →.season** — season months
- [ ] **Custom Private Trips →.price** — private trip pricing
- [ ] **Custom Private Trips →.includes[2]** — other inclusions
- [ ] **Custom Private Trips →.meetingTime** — check-in time(s)

## About, family & guides

- [ ] **about.familyStory[0]** — the family's own story — who started it, how the family is involved today (2–4 short paragraphs, one per line in this list)
- [ ] **about.guides[0].name** — guide name
- [ ] **about.guides[0].role** — e.g. Owner / Head guide
- [ ] **about.guides[0].bio** — one or two sentences
- [ ] **about.guides[0].photo** — optional: photo name added to the images list

## Safety

- [ ] **safety.details[0].text** — which certifications guides hold (e.g. Wilderness First Responder, CPR, swiftwater rescue)
- [ ] **safety.details[1].text** — describe the pre-trip safety talk
- [ ] **safety.details[2].text** — gear you provide (PFDs, helmets, wetsuits, splash jackets...)
- [ ] **safety.details[3].text** — age and weight requirements
- [ ] **safety.details[4].text** — outfitter permit / licence details — only if you want them listed

## FAQ

- [ ] **faq[8].a** — prices, or where to find them
- [ ] **faq[9].a** — cancellation / refund policy summary
- [ ] **faq[10].a** — weather and river-level policy
- [ ] **faq[11].a** — minimum ages per trip

## Policies

- [ ] **policies[0].text** — cancellation and refund policy
- [ ] **policies[1].text** — waiver requirements (who signs, when, link to online waiver if any)
- [ ] **policies[2].text** — what happens when conditions change
- [ ] **policies[3].text** — deposit and payment terms

## Reviews

- [ ] Add **real** guest reviews (quote, first name/initial, source such as Google or TripAdvisor). The Reviews
      section is hidden while `reviews` is empty — please don't add made-up testimonials.

## Photos

- [ ] Replace stock landscapes with your own trip photography (hero, trip cards, gallery, guides).
- Removed from the site because they show, or likely show, **another company's branding**:
  - `wild-rivers-paddlers` (BLM, Wild Rivers Recreation Area) — red inflatable kayak clearly lettered **"LOS RIOS"**,
    the name of a competing Taos rafting outfitter.
  - `rafts-in-the-gorge` (BLM, Río Grande del Norte NM) — commercial rafting trip; one red inflatable kayak
    carries yellow lettering in the same style as the "LOS RIOS" boats (illegible but likely the same outfitter).
- Still used, no branding visible, but worth a look: `gorge-overlook` (home hero) includes a distant hiker on the
  cliff edge; `gorge-bridge-bighorn` shows the Rio Grande Gorge Bridge (public infrastructure).
- To add a photo: put `photos/<name>.jpg` in the repo, run `npm install --no-save sharp && npm run images`,
  then use `<name>` in `content/site.json` and add an `images.<name>` entry with alt text, credit and licence.
