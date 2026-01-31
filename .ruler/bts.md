# Bracketcore

Bracketcore is a shadcn registry for reusable tournament bracket components built with React and Tailwind CSS.

## Project Structure

This is a Turborepo monorepo using bun workspaces:

- **`packages/registry/`** - The shadcn component registry (match-card, single-elimination, double-elimination, swiss-stage, group-stage)
- **`packages/env/`** - Shared environment variables and validation
- **`packages/config/`** - Shared TypeScript configuration
- **`apps/fumadocs/`** - Documentation site built with Fumadocs (Next.js)

## Registry

Components live in `packages/registry/registry/bracketcore/`. The registry is built with `shadcn build`, which generates JSON files in `packages/registry/public/r/`.

When modifying a component in the registry:

1. Edit the source file in `packages/registry/registry/bracketcore/`
2. Run `bun run build` in `packages/registry/` to regenerate the JSON artifacts
3. Update the corresponding docs in `apps/fumadocs/content/docs/components/`

## Theming

Components use standard shadcn CSS variables directly (`--background`, `--card`, `--border`, `--card-foreground`, `--muted-foreground`, `--primary`). No custom color variables.

Layout sizing uses CSS custom properties: `--bracket-match-width`, `--bracket-match-height`, `--bracket-round-gap`, `--bracket-match-gap`.

## Available Scripts

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps
- `bun run check-types` - Type check all packages
- `bun run check` - Run Oxlint and Oxfmt

## Key Points

- This is a Turborepo monorepo using bun workspaces
- Each app has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Turborepo handles build caching and parallel execution
