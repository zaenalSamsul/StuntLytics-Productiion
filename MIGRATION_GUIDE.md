# StuntLytics - Streamlit to Next.js Migration Guide

## Overview

This document outlines the complete migration of StuntLytics from Streamlit to **Next.js 16 + React 19** with a professional design system.

## Architecture Changes

### Previous (Streamlit)
- Python-based UI framework
- Server-side rendering with Python backend
- Basic CSS styling
- Single-file component structure

### New (Next.js + React)
- Full-stack JavaScript/TypeScript
- Server Components + Client Components architecture
- Tailwind CSS v4 with design tokens
- Modular component library
- API routes for backend integration
- SWR for client-side data fetching

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Dashboard home
│   ├── risk-map/page.tsx        # Risk map analysis
│   ├── explorer/page.tsx        # Data explorer
│   ├── correlation/page.tsx     # Correlation analysis
│   ├── prediction/page.tsx      # Family risk prediction
│   ├── insights/page.tsx        # InsightNow AI chatbot
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles + design tokens
│
├── components/
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── MainLayout.tsx           # Main layout wrapper
│   ├── PageHeader.tsx           # Page title & description
│   ├── FilterSummary.tsx        # Active filters display
│   ├── MetricCard.tsx           # KPI metric cards
│   ├── Alert.tsx                # Alert/notification component
│   ├── ChartWrapper.tsx         # Chart container component
│   └── index.ts                 # Component exports
│
├── lib/
│   ├── api.ts                   # API client & types
│   ├── hooks.ts                 # Custom React hooks
│   ├── colors.ts                # Color tokens & utilities
│   ├── utils.ts                 # Utility functions
│
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
```

## Key Technologies

### Core Framework
- **Next.js 16**: React meta-framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5.7**: Type safety

### Styling & Design
- **Tailwind CSS v4**: Utility-first CSS framework
- **Design Tokens**: Semantic color and spacing system
- **Responsive Design**: Mobile-first approach

### Data & State
- **SWR**: React hooks for data fetching
- **Axios**: HTTP client
- **Zustand** (optional): Lightweight state management

### Visualization
- **Recharts**: React chart library
- **Lucide React**: Icon library

## Design System

### Colors
- **Primary**: #2563EB (Blue)
- **Secondary**: #EC4899 (Pink)
- **Success**: #10B981 (Emerald)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)

### Risk Levels
- Very Low: #10B981
- Low: #3B82F6
- Moderate: #F59E0B
- High: #EC4899
- Critical: #EF4444

### Typography
- Default font: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- Sizes: H1-H4 headings + body variations
- Line heights: 1.4-1.6 for optimal readability

## Migration Changes

### Streamlit → Next.js Mapping

| Streamlit | Next.js |
|-----------|---------|
| `st.set_page_config()` | `metadata`, `viewport` in layout.tsx |
| `st.sidebar` | `<Sidebar>` component |
| `st.title()` | `<PageHeader>` component |
| `st.metric()` | `<MetricCard>` component |
| `st.plotly_chart()` | `<ChartWrapper>` with Recharts |
| `st.dataframe()` | HTML table with Tailwind |
| `st.selectbox()` | HTML select element |
| CSS in Python | Tailwind CSS classes |
| Page-based routing | Next.js App Router |

### Data Fetching

**Streamlit (Old)**:
```python
def get_main_page_summary(filters):
    return es.get_main_page_summary(filters)
```

**Next.js (New)**:
```typescript
// lib/hooks.ts
export const useDashboardSummary = (filters: FilterParams) => {
  return useSWR(`/api/dashboard/summary?...`, fetcher)
}

// Component
const { data, isLoading } = useDashboardSummary(filters)
```

### Styling

**Streamlit (Old)**:
```python
st.markdown('<div class="metric-card">...</div>', unsafe_allow_html=True)
```

**Next.js (New)**:
```tsx
<div className="rounded-lg border border-border bg-card p-6">
  {/* Content */}
</div>
```

## Implementation Notes

### Backend Integration
The application still uses the existing Elasticsearch backend through Python. To integrate:

1. Create API route handlers in `app/api/` that call Python services
2. Use `dashboardApi` from `lib/api.ts` for client-side calls
3. Implement proper error handling and loading states

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
ELASTICSEARCH_HOST=your-es-host
GEMINI_API_KEY=your-gemini-key
```

### Development Server
```bash
pnpm dev
# Opens at http://localhost:3000
```

### Build & Deployment
```bash
pnpm build
pnpm start
```

Deploy to Vercel with one click, or use Docker for custom deployment.

## Component Examples

### Using MetricCard
```tsx
<MetricCard
  icon="👶"
  title="Total Births"
  value={15240}
  context="Children registered"
  delta="+5.2%"
  deltaType="positive"
/>
```

### Using ChartWrapper
```tsx
<ChartWrapper
  type="line"
  title="Immunization Coverage"
  data={trendData}
  height={300}
/>
```

### Using PageHeader
```tsx
<PageHeader
  icon="🗺️"
  title="Risk Map"
  description="View regional risk analysis"
/>
```

## Performance Optimization

### Image Optimization
- Use `next/image` for responsive images
- Automatic format conversion (WebP)

### Code Splitting
- Next.js automatically code-splits by route
- Dynamic imports for heavy components

### Data Caching
- SWR handles client-side caching
- Set `revalidateOnFocus: false` for expensive queries

### CSS Purging
- Tailwind automatically purges unused CSS
- Smaller production bundle (~30KB gzipped)

## Accessibility (WCAG 2.1 AA)

- Semantic HTML elements (`<main>`, `<header>`, `<nav>`)
- Proper heading hierarchy (H1 > H2 > H3 > H4)
- Color contrast ratios > 4.5:1
- Keyboard navigation support
- Screen reader support with `aria-` attributes
- Focus states on interactive elements

## Testing Recommendations

### Unit Tests (Jest + React Testing Library)
```bash
pnpm add -D jest @testing-library/react
```

### E2E Tests (Playwright)
```bash
pnpm add -D @playwright/test
```

## Troubleshooting

### Dark mode not working
- Ensure `<html className="dark">` in layout.tsx
- Check Tailwind config has dark mode enabled

### Charts not rendering
- Verify Recharts is installed: `pnpm list recharts`
- Check data format matches chart type expectations

### API calls failing
- Verify API routes exist in `app/api/`
- Check CORS headers if calling external services
- Use browser DevTools Network tab to debug

## Next Steps

1. **Backend API Routes**: Implement Python integration in `app/api/` folder
2. **Real Data Integration**: Replace mock data with Elasticsearch queries
3. **Authentication**: Add Auth.js for user management
4. **Database**: Optional - add database for audit logs, saved reports
5. **Monitoring**: Set up error tracking with Sentry

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Recharts Documentation](https://recharts.org)
