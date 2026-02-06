# Bracketcore

Reusable tournament bracket components for React, available as a [shadcn registry](https://ui.shadcn.com/docs/registry).

## Components

- **Match Card** - The atomic building block displaying a single match with teams, scores, and status
- **Single Elimination** - Bracket with automatic SVG connector lines between rounds
- **Double Elimination** - Upper bracket, lower bracket, and grand final
- **Swiss Stage** - Swiss-system rounds with standings table
- **Group Stage** - Round-robin groups with standings

## Installation

Install components directly from the registry:

```bash
npx shadcn add https://bracketcore.andrews.sh/r/single-elimination.json
```

## Development

```bash
bun install
bun run dev
```

## Project Structure

```
bracketcore/
├── apps/
│   └── fumadocs/          # Documentation site (Next.js)
├── packages/
│   ├── registry/          # shadcn component registry
│   └── config/            # Shared TypeScript configuration
```

## Scripts

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps
- `bun run check-types` - Type check all packages
- `bun run check` - Run Oxlint and Oxfmt
