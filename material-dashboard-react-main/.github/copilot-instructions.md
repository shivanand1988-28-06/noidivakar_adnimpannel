# Copilot Instructions for Material Dashboard 2 React

## Project Overview
- This is a React-based admin dashboard template using Material UI (MUI) and custom components, designed for extensibility and rapid prototyping.
- The main entry point is `src/App.js`, which sets up theming, routing, and layout.
- All routes are defined in `src/routes.js`. Adding a route here automatically updates the Sidenav.
- Layouts for major app sections are in `src/layouts/`, with `dashboard/` as the main admin view. Each layout is a self-contained React component.
- Custom UI components are in `src/components/` (atomic) and `src/examples/` (composite, e.g., cards, navbars, charts).
- Theming is managed via `src/assets/theme/` and `src/assets/theme-dark/` (for dark mode). RTL support is in `theme-rtl.js`.

## Data Flow & Integration
- The dashboard fetches data from a remote API (see `API_BASE` in `src/layouts/dashboard/index.js`).
- Admin and task data are loaded on mount; assignment actions update the backend and refresh state.
- User authentication is handled via localStorage (`user`, `token`).
- To add new API endpoints, update fetch logic in the relevant layout/component.

## Developer Workflows
- **Install dependencies:** `npm install` or `yarn install`
- **Start dev server:** `npm start` or `yarn start`
- **Build for production:** `npm run build` or `yarn build`
- **Run tests:** `npm test` or `yarn test`
- **Clean install:** `npm run install:clean`
- Linting and formatting are configured via `.eslintrc.json` and `.prettierrc.json`.

## Project Conventions
- Use MUI components and the custom MD* components for UI consistency.
- All new routes/components should be registered in `src/routes.js` and placed in the appropriate `src/layouts/` or `src/examples/` subfolder.
- For new themes or color changes, update `src/assets/theme/` and related files.
- Use functional React components and hooks (no class components).
- API endpoints should be called using `fetch` and handle errors gracefully.

## Key Files & Directories
- `src/App.js`: App entry, theming, and router setup
- `src/routes.js`: Route definitions and Sidenav structure
- `src/layouts/`: Main page layouts (dashboard, auth, billing, etc.)
- `src/components/`: Atomic UI components (MDBox, MDButton, etc.)
- `src/examples/`: Composite UI and layout examples
- `src/assets/theme/`: Theme configuration (light, dark, RTL)

## External Integrations
- Uses MUI v5, React 18, Chart.js, chroma-js, and React Router v7+
- Nepcha Analytics is integrated for traffic insights
- Deployment to Genezio is supported (see README)

## Example: Adding a New Dashboard Card
1. Create a new card component in `src/examples/Cards/`.
2. Import and use it in `src/layouts/dashboard/index.js`.
3. If it needs data, add fetch logic and state as in the existing cards.

---
For more details, see the [README.md](../README.md) and [official documentation](https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/).
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
