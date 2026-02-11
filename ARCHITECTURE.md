# Architecture (MVC Pattern)

## Folder Structure

```
src/
├── config/          # App configuration (routes)
├── controllers/     # Business logic hooks (e.g. useCreateBrand)
├── models/          # Data models, constants, route definitions
├── views/           # Presentational components (no business logic)
│   ├── create-brand/    # Create Brand wizard step components
│   │   └── communication/   # Communication provider sub-components
│   ├── monitor/         # Monitor page components
│   └── shared/          # Shared view components
├── components/      # Reusable UI components (brand-wizard, ui)
├── pages/           # Page-level containers (orchestrate views + controllers)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── hooks/           # General-purpose hooks
```

## MVC Mapping

- **Model**: `models/`, `types/` – data structures, constants, route config
- **View**: `views/`, `components/` – UI components
- **Controller**: `controllers/`, `pages/` – state and logic

## Standalone Widgets

Visit `/standalone` for a modern grid-based widget playground. All widgets are organized by category:

### Structure
```
src/standalone/
├── create-brand/     # 14 Create Brand step demos
├── monitor/          # 5 Monitor page widget demos
├── shared/           # 3 shared component demos
└── widget-registry.tsx
```

### Create Brand (14 widgets)
Steps 1–14: Brands, Deposit, Withdrawal, KYC, Terms, Communication, Upload Workers, Upload Logo, Transform, Trader Platform, Trader Markets, Trading Fees, Client TAS, Default Settings

### Monitor (5 widgets)
KPI Card, Client Status Table, System Health, Active Brands, Quick Actions

### Shared (3 widgets)
Check Card, CountUp, Provider Option Card

## Routes

Defined in `models/routes.ts` and used via `ROUTES` constant.
