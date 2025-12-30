
# Copilot Instructions for Material Dashboard 2 React

## Project Overview
- This is a React-based admin dashboard template using Material UI (MUI) v5, built and maintained by Creative Tim.
- The codebase is modular, with reusable components in `src/components` and example implementations in `src/examples`.
- The main entry point is `src/index.js`, which wraps the app in a context provider and React Router.
- The core app logic and theming are in `src/App.js`.
- Routing is defined in `src/routes.js` as a structured array, with each route specifying its type, icon, and component. Adding a route here automatically updates the Sidenav.
- Layouts for major app sections are in `src/layouts` (e.g., dashboard, tables, authentication).

## Key Patterns & Conventions
- **Component Structure:** All custom UI elements are prefixed with `MD` (e.g., `MDBox`, `MDButton`) and live in `src/components`.
- **Theme Management:** Themes are in `src/assets/theme` (default) and `src/assets/theme-dark` (dark mode). RTL support is provided via `theme-rtl.js` and `stylis-plugin-rtl`.
- **Context:** App-wide state is managed via React Context in `src/context`.
- **Example Usage:** `src/examples` contains higher-level UI patterns and example implementations for rapid prototyping.
- **Assets:** Images and logos are in `src/assets/images`.

## Developer Workflows
- **Install dependencies:** `npm install` or `yarn install` (Node.js LTS required)
- **Start dev server:** `npm start` or `yarn start` (runs with `react-scripts`)
- **Build for production:** `npm run build` or `yarn build`
- **Clean install:** `npm run install:clean` (removes node_modules and lock file, reinstalls, and starts)
- **Testing:** No custom test setup; uses `react-scripts test` if needed.

## Integration & Extensibility
- **Add new pages:** Create a new layout/component, then add a route in `src/routes.js`.
- **Theming:** Use the MUI `ThemeProvider` and edit theme files for custom colors, typography, etc.
- **External Libraries:** Uses MUI, Chart.js (via `react-chartjs-2`), Chroma.js, and Yup for validation.
- **Analytics:** Nepcha Analytics is pre-integrated.

## Project-Specific Notes
- **File naming:** Use PascalCase for components, camelCase for variables/functions.
- **Route structure:** Follow the comment block in `src/routes.js` for adding or customizing routes.
- **RTL support:** To enable RTL, use the provided theme and plugin setup in `App.js`.
- **Do not edit files in `build/`**—these are generated outputs.

## References
- Main documentation: https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/
- Example pages: https://demos.creative-tim.com/material-dashboard-react/#/dashboard
- For issues, see the GitHub repo: https://github.com/creativetimofficial/material-dashboard-react

---

*Update this file if you introduce new architectural patterns, workflows, or conventions unique to this project.*
