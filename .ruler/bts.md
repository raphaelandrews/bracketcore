# Bracketcore

Bracketcore is a shadcn registry for reusable tournament bracket components built with React and Tailwind CSS.

## Project Structure

This is a Turborepo monorepo using bun workspaces:

- **`packages/registry/`** - The shadcn component registry (match-card, single-elimination, double-elimination, swiss-stage, group-stage)
- **`packages/config/`** - Shared TypeScript configuration
- **`apps/fumadocs/`** - Documentation site built with Fumadocs (Next.js)

## Registry

Components live in `packages/registry/registry/bracketcore/`. The registry is built with `shadcn build`, which generates JSON files in `packages/registry/public/r/`.

Shared types live in `packages/registry/registry/bracketcore/bracket-types.ts` — this is the single source of truth for all type definitions.

When modifying a component in the registry:

1. Edit the source file in `packages/registry/registry/bracketcore/`
2. Run `bun run build --filter=@bracketcore/registry --force` to regenerate the JSON artifacts
3. Update the corresponding docs in `apps/fumadocs/content/docs/`

When modifying documentation:

1. Edit the MDX file in `apps/fumadocs/content/docs/`
2. Check the consistency rules below

## Consistency Checklist

When changing any component or doc, check these rules to keep everything consistent:

### Documentation structure

Every component doc must follow this section order:

1. Frontmatter (title, description)
2. `## Preview` — ComponentPreview with inline example code
3. `## Installation` — `package-install` code block with shadcn CLI command
4. `## Prerequisites` — explanation + code block showing how to define the data
5. `## Usage` — import statement + JSX usage (two separate code blocks)
6. `## Examples` or `## Connector Styles` (optional, component-specific)
7. `## Props` — component props table, then type definition code blocks
8. `## Sizing` — CSS custom properties table for layout dimensions
9. `## Theming` — one-liner listing which shadcn variables the component uses
10. `## Structure` (optional, for swiss-stage and group-stage)

### Props tables

- Column headers: `Prop | Type | Description`
- `className` description: `"Additional CSS classes for the root element."`
- `onMatchClick` description: `"Callback fired when a match card is clicked."` (match-card appends `" Adds hover styles when set."`)
- `bracket`/`match` description: briefly state what the data contains

### Type definitions in docs

- Must match `bracket-types.ts` exactly — copy interfaces from there
- `scheduledAt` is `Date | string`, not just `string`
- Every doc must include all relevant types from the shared type (Match, MatchTeam, Team, plus component-specific bracket/round/standing types)

### Preview example helpers

- Use a short `m()` helper for creating matches (not `makeMatch` or other names)
- Use a `team()` helper for creating teams when needed (swiss-stage, group-stage)
- Helper signature: `m(id, round, position, a, sa, b, sb, bo): Match`

### Sizing section

- All components that render MatchCard must document `--bracket-match-width` (default `11rem`)
- Bracket components (SE, DE) additionally document `--bracket-match-height`, `--bracket-round-gap`, `--bracket-match-gap`
- Description wording: `"Width of each match card."`, `"Height of each match card."`, etc.

### Theming section

- Format: `"All colors use your shadcn theme variables directly (...). No extra configuration needed."`
- List only the variables the component actually uses
- Common variables: `--card`, `--border`, `--card-foreground`, `--muted-foreground`, `--primary`

### External dependencies

- If a component imports from a package other than React/Tailwind/shadcn (e.g. `lucide-react`), add a note after the installation block: `"This component depends on [package](url) for ... It will be installed automatically via the shadcn CLI."`

## Theming

Components use standard shadcn CSS variables directly (`--card`, `--border`, `--card-foreground`, `--muted-foreground`, `--primary`). No custom color variables.

Layout sizing uses CSS custom properties: `--bracket-match-width`, `--bracket-match-height`, `--bracket-round-gap`, `--bracket-match-gap`.

## Available Scripts

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps
- `bun run build --filter=@bracketcore/registry --force` - Rebuild registry JSON artifacts
- `bun run check-types` - Type check all packages
- `bun run check` - Run Oxlint and Oxfmt

## Key Points

- This is a Turborepo monorepo using bun workspaces
- Each app has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Turborepo handles build caching and parallel execution
