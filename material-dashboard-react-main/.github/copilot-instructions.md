# Copilot Instructions for Material Dashboard 2 React

## Project Overview
- **Material Dashboard 2 React** is a React + MUI (Material UI) admin dashboard template, structured for modularity and customization.
- The project is organized around reusable components, example layouts, and a theme system. It is designed for rapid prototyping and production dashboards.

## Key Architecture & Patterns
- **Entry Point:** `src/App.js` sets up theming, layout switching (LTR/RTL, dark/light), and route rendering using React Router.
- **Routing:** All routes are defined in `src/routes.js`. To add or modify pages, update this file. The Sidenav is auto-generated from this config.
- **Layouts:** Main layouts are in `src/layouts/` (e.g., `dashboard`, `tables`, `billing`, etc.). Each layout is a page-level container.
- **Components:** Reusable UI elements are in `src/components/MD*` and `src/examples/`. Use these for consistent design.
- **Theme:** Theme files are in `src/assets/theme/` and `src/assets/theme-dark/`. Use these for color, typography, and style overrides.
- **Context:** App-wide state (e.g., sidenav, theme) is managed via React Context in `src/context/`.
- **Styling:** Use MUI's `styled()` API and `sx` prop for custom styles. Theme values are sourced from the theme files.

## Developer Workflows
- **Install dependencies:** `npm install` or `yarn install`
- **Start dev server:** `npm start` or `yarn start`
- **Build for production:** `npm run build` or `yarn build`
- **Clean install:** `npm run install:clean`
- **Linting/Formatting:** Uses ESLint and Prettier (`.eslintrc.json`, `.prettierrc.json`).
- **Testing:** No custom tests included by default. Add tests as needed.
- **Deploy:** Supports Genezio one-click deploy (see README for badge/link)

## Project Conventions
- **Component Naming:** All custom components use the `MD` prefix (e.g., `MDBox`, `MDButton`).
- **File Organization:** Each component/example in its own folder with `index.js` as entry point.
- **Theming:** Use the provided theme and `sx` prop for style overrides. Avoid inline styles. Edit `src/assets/theme/` for global style changes; use `theme-dark/` for dark mode.
- **Routing:** Only update `src/routes.js` for navigation changes; the Sidenav and routing auto-update.
- **API Integration:** Use `fetch` or your preferred client. Store tokens in `localStorage`.
- **RTL Support:** RTL themes are in `src/assets/theme/theme-rtl.js` and `src/assets/theme-dark/theme-rtl.js`.

## Data & API
- Example API usage is in `src/layouts/dashboard/index.js` (see `API_BASE`). Auth tokens are read from `localStorage`.
- For admin users, data is fetched from `/api/admin/all-names`; for others, from `/api/admin/assigned-tasks/:user`.
- Update API endpoints and logic as needed for your backend.

## Integration & Extensibility
- **External Libraries:**
  - MUI, React ChartJS 2, ChromaJS, Nepcha Analytics (see README for links)
- **Analytics:** Nepcha Analytics is pre-integrated for traffic insights.
- **Documentation:** Extensive docs at [Creative Tim](https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/)

## References
- [README.md](../README.md) for general usage and links
- [src/routes.js](../src/routes.js) for navigation structure
- [src/layouts/](../src/layouts/) for page layouts
- [src/components/](../src/components/) and [src/examples/](../src/examples/) for reusable UI
- [src/assets/theme/](../src/assets/theme/) for theming

---

---
**Example: Adding a new dashboard widget**
1. Create a new component in `src/components/` or `src/examples/`.
2. Use `MDBox`, `MDTypography`, etc., for layout and text.
3. Import and use your component in a layout (e.g., `src/layouts/dashboard/index.js`).
4. Register any new routes in `src/routes.js` if needed.

For more, see the [official documentation](https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/?ref=readme-mdr) and follow the established folder/component patterns for consistency.
