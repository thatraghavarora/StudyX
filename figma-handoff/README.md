# Study Hub Figma Handoff

## Prototype routes

- Landing: `http://127.0.0.1:5173/`
- Login: `http://127.0.0.1:5173/login`
- Signup: `http://127.0.0.1:5173/login?mode=signup`
- Main Dashboard Quick Mode: `http://127.0.0.1:5173/dashboard?mode=quick`
- Main Dashboard Upload State: `http://127.0.0.1:5173/dashboard?mode=quick&source=upload`
- Main Dashboard Deep Mode: `http://127.0.0.1:5173/dashboard?mode=deep`
- Test Page: `http://127.0.0.1:5173/test`
- AI Review Page: `http://127.0.0.1:5173/review`

## Capture guidance

- Capture desktop at 1440 px wide for all five pages.
- Capture mobile at 390 px wide for Landing, Dashboard, Test, and Review.
- Use the dashboard Quick Mode and Deep Mode tab states as separate Figma frames.
- Keep the visual direction as hybrid bold EdTech: black outlines, purple primary actions, yellow CTAs, green/pink status accents, and clean white dashboard surfaces.

## Verification note

The production build and HTTP route checks passed locally. Browser screenshot capture could not be completed in this session because the in-app Browser blocked localhost with `net::ERR_BLOCKED_BY_CLIENT`, and file URLs are blocked by Browser policy. The app is ready for screenshot capture from a normal local browser at the routes above.
