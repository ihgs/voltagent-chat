# GEMINI.md: Development Guidelines

This document outlines the development guidelines and conventions for this project to ensure consistency and quality.

## 1. Coding Conventions

- **Formatting:** We use [Prettier](https://prettier.io/) to automate code formatting.
- **Linting:** We use [ESLint](https://eslint.org/) and adhere to the rules defined in `eslint.config.js`.
- **Naming Conventions:**
    - Components: `PascalCase` (e.g., `MyComponent.tsx`)
    - Variables/Functions: `camelCase` (e.g., `myVariable`, `myFunction`)
    - Type Definitions: `PascalCase` (e.g., `type UserProfile = { ... }`)

## 2. Technology Stack

- **Language:** TypeScript
- **UI Framework:** React
- **Build Tool:** Vite
- **Testing:** Vitest and React Testing Library
- **Styling:** Tailwind CSS will be used for styling.
- **Package Manager:** pnpm

## 3. Directory Structure

- **Components:** Components should be placed in the `src/components` directory, organized by feature.
- **Assets:** Static assets like images and SVGs should be in `src/assets`.
- **State Management (if applicable):** Create a `src/state` or `src/store` directory for state management logic.

## 4. Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

- `feat:`: A new feature
- `fix:`: A bug fix
- `docs:`: Documentation only changes
- `style:`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:`: A code change that neither fixes a bug nor adds a feature
- `test:`: Adding missing tests or correcting existing tests
- `chore:`: Changes to the build process or auxiliary tools and libraries such as documentation generation
