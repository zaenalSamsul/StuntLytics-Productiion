# Regional Risk Flow Map — Implementation Notes

## Layers

1. **OSM raster basemap**
2. **West Java district choropleth** (`district-fill`)
3. **District outlines** (`district-outline`)
4. **Directional flow glow** (`flow-glow`)
5. **Directional animated paths** (`flow-lines`)
6. **Risk heatmap** (`risk-heat`)
7. **Hotspot pulse markers** (`hotspot-pulse`)

## Data behavior

The map attempts to load live risk-map data through the existing API client after hydration. When API data is available, district values are matched by subdistrict name and override fallback values.

If the API is unavailable, the map uses deterministic illustrative fallback values embedded in the simplified GeoJSON. District popups state the data source.

## Flow semantics

The flow layer is intentionally called **Risk Signal Flow**. It must not be described as contagious transmission. Stunting is not infectious.

Recommended production meanings:
- change propagation in composite risk indicators,
- correlated determinant pressure across adjacent/connected areas,
- referral routes,
- intervention logistics,
- service coverage continuity,
- longitudinal modelled priority shifts.

## Performance

The original `geojson/jawa-barat.geojson` is preserved. A frontend-optimized copy is generated at:

`public/data/jawa-barat-simplified.geojson`

Approximate size reduction:
- original: ~32 MB
- frontend copy: ~1.3 MB

Topology-preserving geometry simplification is used to retain recognizable regional boundaries while improving load time.
