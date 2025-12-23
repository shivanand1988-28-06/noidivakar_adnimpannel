# Copilot Instructions for Material Dashboard React

## Project Overview
- **Material Dashboard React** is a React + MUI (Material UI) admin dashboard template, featuring modular components, theming, and example pages.
- The codebase is organized for easy customization and extension, with a focus on reusable UI elements and clear separation of concerns.

## Key Architecture & Patterns
- **Component Structure:**
  - `src/components/MD*`: Core UI primitives (e.g., MDButton, MDBox) built on top of MUI, used throughout the app.
  - `src/examples/`: Higher-level, ready-to-use UI blocks (e.g., Navbars, Cards, Charts, Sidenav) that combine primitives and business logic.
  - `src/layouts/`: Page-level layouts (e.g., dashboard, authentication, profile) that compose examples and components.
  - `src/assets/theme/` and `src/assets/theme-dark/`: Theme configuration, color palettes, and style overrides for light/dark modes and RTL support.
  - `src/context/`: React context for global state (e.g., theme, layout direction).
  - `src/routes.js`: Central route definitions for all app pages.

  
- **Styling:**
  - Uses MUI's `styled()` API and `sx` prop for custom styles.
  - Theme values are sourced from `src/assets/theme/` and `src/assets/theme-dark/`.

- **Example Pages:**
  - Found in `src/layouts/` and referenced in `src/routes.js`.
  - Use example components for rapid prototyping.

## Developer Workflows
- **Install dependencies:**
  - `npm install` or `yarn install` (Node.js LTS required)
- **Start development server:**
  - `npm start` or `yarn start` (runs on localhost, hot reload enabled)
- **Build for production:**
  - `npm run build` or `yarn build`
- **Deploy:**
  - Supports Genezio one-click deploy (see README for badge/link)

## Project Conventions
- **Component Naming:**
  - Custom components prefixed with `MD` (e.g., MDButton) for easy identification.
- **File Organization:**
  - Each component/example in its own folder with `index.js` as entry point.
- **Theme Customization:**
  - Edit `src/assets/theme/` for global style changes; use `theme-dark/` for dark mode.
- **RTL Support:**
  - RTL themes in `theme-rtl.js` files.

## Integration & Extensibility
- **External Libraries:**
  - MUI, React ChartJS 2, ChromaJS, Nepcha Analytics (see README for links)
- **Analytics:**
  - Nepcha Analytics is pre-integrated for traffic insights.
- **Documentation:**
  - Extensive docs at [Creative Tim](https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/)

## References
- See `README.md` for full file structure, example links, and support resources.
- For issues, use GitHub Issues or contact Creative Tim support.

---

**Example: Adding a new dashboard widget**
1. Create a new component in `src/components/` or `src/examples/`.
2. Use `MDBox`, `MDTypography`, etc., for layout and text.
3. Import and use your component in a layout (e.g., `src/layouts/dashboard/index.js`).
4. Register any new routes in `src/routes.js` if needed.

For more, see the official documentation and follow the established folder/component patterns for consistency.
