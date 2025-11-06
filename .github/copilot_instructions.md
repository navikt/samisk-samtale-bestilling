# Copilot Instructions for Samisk Samtale Bestilling

## Project Overview

A web application for ordering telephone consultations with Nav in Sami language. The application provides a form where users can request callbacks from Sami-speaking Nav advisors, choosing between morning or afternoon time slots. The application is bilingual, supporting both Northern Sami (se) and Norwegian Bokmål (nb).

**Owner**: Team Navno (#team-navno on Slack)

## Architecture

### Tech Stack

- **Frontend**: Preact (React-compatible via @preact/compat)
- **Backend**: Express.js
- **Language**: TypeScript
- **Build Tool**: Vite
- **Architecture Pattern**: Server-Side Rendering (SSR) with client-side hydration, monorepo structure with npm workspaces

### Key Components

1. **SamiskSamtaleApp**: Main application container
    - Renders title, info alert, and guide panel
    - Initializes Grafana Faro telemetry in production
2. **SamiskSamtaleOrderForm**: Form component with validation
    - Handles user input for first name, last name, phone number, and time preference
    - Auto-populates phone number from kontaktinfo API
    - Submits form data through backend proxy to tilbakemeldingsmottak-api
3. **LocaleString**: Internationalization component
    - Renders localized strings based on current locale
    - Uses dangerouslySetInnerHTML for HTML content in translations
4. **Express Server**: Backend server handling SSR and API routes
    - Serves static assets in production
    - Runs Vite dev server in development
    - Implements CSP middleware and decorator injection

## API Endpoints

| Endpoint                | Method | Purpose                                                                                                                  |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `/api/internal/isAlive` | GET    | Health check endpoint                                                                                                    |
| `/api/internal/isReady` | GET    | Readiness probe for Kubernetes                                                                                           |
| `/api/proxy`            | POST   | Proxy form submissions from frontend to [tilbakemeldingsmottak-api](https://github.com/navikt/tilbakemeldingsmottak-api) |

## Type Safety

**IMPORTANT**: All TypeScript types should be strictly defined. Avoid using `any` types.

- Form data types are defined in `src/utils/fetch.ts` (`SubmitData`, `KontaktInfoResponse`)
- Locale types are centralized in `common/localization/localeUtils.ts`
- Component props should always have explicit type definitions

## Coding Guidelines

### General Principles

- **Type Safety First**: Use TypeScript strictly, avoid `any` types
- **Error Handling**: Always handle async operations with try-catch or promise catch handlers
- **Logging**: Log errors with context, never log sensitive user information
- **Keep to the scope**: When fixing bugs or errors, stick to the task. Do not introduce new features or improve parts of the code unrelated to the bug or error being fixed.

### Frontend (Preact)

- Use functional components with hooks
- Keep components small and focused on single responsibility
- Use CSS Modules for component styling (e.g., `ComponentName.module.css`)
- Always consider accessibility (a11y) - use semantic HTML and Nav Design System components
- Use the `useLocale()` hook to access current locale in components
- Prefer `LocaleString` component for user-facing text instead of hardcoding strings

### Backend (Express.js)

- Keep route handlers thin - delegate business logic to separate functions
- Use async/await for asynchronous operations
- Implement proper error handling and pass errors to next() for error middleware
- Cache external API calls appropriately (see auth.ts and cspMiddleware.ts for examples)
- Always validate and sanitize user input before processing

### File Structure

- `src/`: Frontend code (components, utilities, entry points)
- `server/`: Backend code (Express server, API routes, SSR logic)
- `common/`: Shared code between frontend and backend (localization)
- `src/components/`: Preact components with co-located CSS modules
- `server/src/api/routes/`: API endpoint handlers
- `server/src/site/`: SSR-related code and static file serving

## Environment-Specific Behavior

### Local

- Base URL: `http://localhost:3006/person/bestilling-av-samisk-samtale`
- Uses Vite dev server with HMR
- Runs local decorator or falls back to prod decorator
- Docker Compose provides mock services (OIDC, decorator, mocks)

### Dev

- Base URL: `http://www.ansatt.dev.nav.no/person/bestilling-av-samisk-samtale`
- Environment is close to prod environment for accurate testing purposes.
- Serves pre-built static assets
- Uses pre-compiled SSR bundle
- Deployed to NAIS (Kubernetes) on GCP

### Production

- Base URL: `https://www.nav.no/person/bestilling-av-samisk-samtale`
- Serves pre-built static assets
- Uses pre-compiled SSR bundle
- Deployed to NAIS (Kubernetes) on GCP

## Internationalization

The application supports Northern Sami (`se`) and Norwegian Bokmål (`nb`). When adding user-facing text:

- Language files are located in `common/localization/`
    - `se.ts` - Northern Sami translations (default)
    - `nb.ts` - Norwegian Bokmål translations
- Add new string IDs to the `LocaleStringId` type in `localeUtils.ts`
- Add translations to both language files
- Use `<LocaleString id="stringId" />` component in JSX
- Use `localeString(id, locale)` function for non-JSX contexts
- HTML content in translations is supported (rendered with dangerouslySetInnerHTML)

## Deployment

- **Method**: Automated via GitHub Actions
- **Workflows**:
    - `.github/workflows/deploy.prod.yml` - Deploys to production on push to main
    - `.github/workflows/deploy.dev.yml` - Manual deployment to dev environment
    - `.github/workflows/build-and-deploy.yml` - Reusable workflow for build and deploy
- **Platform**: NAIS (Kubernetes on GCP)
- **Namespace**: `navno`
- **Configuration**: `.nais/config.yaml`
- **Release**: Automatic GitHub release created after prod deployment

## Security and Privacy Reminders

- Never log sensitive user information (names, phone numbers, personal identifiers)
- Application handles personal data - be mindful of GDPR compliance
- All API calls to external services use Azure AD authentication (OAuth 2.0 client credentials)
- Access tokens are cached with appropriate TTL (expires_in - 60 seconds)
- CSP headers are dynamically built and compatible with nav-dekoratoren
- User credentials must use 'include' mode for authenticated requests
- Do not store tokens or sensitive data in localStorage or sessionStorage
- Do not store tokens in local .env files

## Data Flow

```
User Form Input → Frontend Validation → /api/proxy (Express) →
Azure AD Token Fetch → Tilbakemeldingsmottak API →
Response → User Confirmation
```

SSR Flow:

```
Browser Request → Express Server → Vite SSR/Pre-built Bundle →
Preact renderToString → Decorator Injection → HTML Template Processing →
Complete HTML Response → Client Hydration
```

## Common Patterns

### Preact/React Aliasing

The project uses Preact with React compatibility. Symlinks are created at build time:

```javascript
// node_modules/react → node_modules/preact/compat
// node_modules/react-dom → node_modules/preact/compat
// Created by preact-compat-symlinks.js
```

Always import from `react` or `react-dom`, not directly from `preact`.

### Locale Context Pattern

```typescript
// Access current locale in components
const locale = useLocale();

// Render localized string
<LocaleString id="stringId" />
```

### Form State Management

```typescript
// Use local state for form input and errors
const [inputState, setInputState] = useState<InputState>({});
const [errorState, setErrorState] = useState<ErrorState>({});
```

## Dependencies & Build Tools

### Key Dependencies

- **@navikt/ds-react**: Nav Design System components
- **@navikt/nav-dekoratoren-moduler**: Integration with Nav's shared decorator
- **@preact/compat**: React compatibility layer for Preact
- **@grafana/faro-web-sdk**: Frontend telemetry and monitoring
- **amplitude-js**: Analytics tracking

### Build Process

1. **build:client** - Vite builds client bundle to `server/dist/client`
2. **build:ssr** - Vite builds SSR bundle to `server/src/_ssr-dist`
3. **build:server** - TypeScript compiles Express server to `server/dist`
4. **Docker image** - Multi-stage build with Node 24-slim base image

## Naming Conventions

- Use **camelCase** for variables and function names
- Use **PascalCase** for component names and TypeScript types/interfaces
- Use **kebab-case** for file names (except components which use PascalCase)
- CSS Module classes use **camelCase**
- Use Norwegian/Sami terms in user-facing text, English in code

## Environment Variables

Check `.env.development` for env variables.

## Code Review Checklist

Before submitting PR:

- [ ] **Type safety**: No `any` types introduced without justification
- [ ] **Error handling**: All async operations have error handling
- [ ] **Logging**: No sensitive data (names, phone numbers) logged
- [ ] **Localization**: New user-facing text added to both `se.ts` and `nb.ts`
- [ ] **Accessibility**: Changes maintain or improve accessibility
- [ ] **Testing**: Manually tested in both Sami and Norwegian versions
- [ ] **Build**: `npm run build` completes successfully
- [ ] **Lint**: `npm run lint` passes without errors

## References

- [README.md](../README.md) - Setup and deployment information
- [GitHub Team](https://github.com/orgs/navikt/teams/navno) - Team member list
- [Nav Design System](https://aksel.nav.no/) - Component documentation
- [NAIS Documentation](https://doc.nais.io/) - Platform documentation

## Questions or Issues?

- GitHub: [navikt/samisk-samtale-bestilling](https://github.com/navikt/samisk-samtale-bestilling)
- Slack: [#team-navno](https://nav-it.slack.com/archives/team-navno)
