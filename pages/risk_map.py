import streamlit as st
import pandas as pd
import json
import pathlib
import pydeck as pdk
import math

from src import styles
from src import elastic_client as es
from src.components import sidebar

# --- Konfigurasi & Fungsi Helper ---
GEOJSON_PATH = pathlib.Path(__file__).parents[1] / "geojson" / "jawa-barat.geojson"


@st.cache_data(show_spinner="Memuat data GeoJSON...")
def load_geojson():
    with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _normalize_name(v: str) -> str:
    if not v:
        return ""
    s = v.upper().strip()
    prefixes_to_remove = ["KABUPATEN", "KOTA", "KAB.", "KEC.", "KEC"]
    for prefix in prefixes_to_remove:
        if s.startswith(prefix):
            s = s[len(prefix) :].strip()
            break
    return " ".join(s.split())


def _prevalence_to_color(prevalence: float):
    if prevalence is None or pd.isna(prevalence):
        return [200, 200, 200, 80]
    score = max(0.0, min(1.0, prevalence / 100.0))
    if score < 0.5:
        t = score * 2.0
        r, g, b = int(t * 255), int(t * 255), int(255 * (1 - t))
    else:
        t = (score - 0.5) * 2.0
        r, g, b = 255, int(255 * (1 - t)), 0
    return [r, g, b, 180]


def _enrich_geojson(geojson: dict, agg_df: pd.DataFrame):
    if not agg_df.empty:
        agg_df["kab_key"] = agg_df["kabupaten"].apply(_normalize_name)
        agg_df["kec_key"] = agg_df["kecamatan"].apply(_normalize_name)
        lookup = {(r.kab_key, r.kec_key): r for r in agg_df.itertuples()}
    else:
        lookup = {}

    for feature in geojson.get("features", []):
        prop = feature.get("properties", {})
        kab_key = _normalize_name(prop.get("KABKOT", ""))
        kec_key = _normalize_name(prop.get("KECAMATAN", ""))

        rec = lookup.get((kab_key, kec_key))
        if rec and rec.total_anak > 0:
            prevalence = (rec.jumlah_stunting / rec.total_anak) * 100
            prop.update(
                {
                    "prevalensi_stunting": round(prevalence, 2),
                    "jumlah_stunting": int(rec.jumlah_stunting),
                    "total_anak_terdata": int(rec.total_anak),
                }
            )
            prop["fill_color"] = _prevalence_to_color(prevalence)
        else:
            prop.update(
                {
                    "prevalensi_stunting": "N/A",
                    "jumlah_stunting": 0,
                    "total_anak_terdata": 0,
                }
            )
            prop["fill_color"] = _prevalence_to_color(None)
        feature["properties"] = prop
    return geojson


# --- HELPER BARU UNTUK FOKUS PETA ---
def filter_geojson_features(geojson, selected_kab, selected_kec):
    if not selected_kab and not selected_kec:
        return geojson["features"]

    filtered_features = []
    norm_kab = _normalize_name(selected_kab[0]) if selected_kab else None
    norm_kec = _normalize_name(selected_kec[0]) if selected_kec else None

    for feature in geojson["features"]:
        prop = feature["properties"]
        kab_key = _normalize_name(prop.get("KABKOT", ""))
        kec_key = _normalize_name(prop.get("KECAMATAN", ""))

        if norm_kec:  # Filter paling spesifik dulu
            if kab_key == norm_kab and kec_key == norm_kec:
                filtered_features.append(feature)
        elif norm_kab:
            if kab_key == norm_kab:
                filtered_features.append(feature)
    return filtered_features


def _walk_coords(coords, lats, lons):
    if isinstance(coords, (list, tuple)):
        if len(coords) > 0 and isinstance(coords[0], (int, float)):
            lon, lat = coords
            lats.append(lat)
            lons.append(lon)
        else:
            for c in coords:
                _walk_coords(c, lats, lons)


def compute_view_state(features):
    if not features:
        return pdk.ViewState(latitude=-6.91, longitude=107.61, zoom=7.5, pitch=0)

    lats, lons = [], []
    for f in features:
        _walk_coords(f["geometry"]["coordinates"], lats, lons)

    if not lats or not lons:
        return pdk.ViewState(latitude=-6.91, longitude=107.61, zoom=7.5, pitch=0)

    min_lat, max_lat = min(lats), max(lats)
    min_lon, max_lon = min(lons), max(lons)
    center_lat = (min_lat + max_lat) / 2
    center_lon = (min_lon + max_lon) / 2

    lat_span = max(abs(max_lat - min_lat), 1e-5)
    lon_span = max(abs(max_lon - min_lon), 1e-5)

    zoom_lon = math.log2(360 / lon_span)
    zoom_lat = math.log2(180 / lat_span)
    zoom = min(zoom_lon, zoom_lat) * 0.95  # Sedikit zoom out

    return pdk.ViewState(latitude=center_lat, longitude=center_lon, zoom=zoom, pitch=0)


# --- RENDER HALAMAN ---
def render_page():
    """Render Risk Map page with improved UX and visual hierarchy."""
    from src.components.page_header import render_page_header, render_filter_summary
    from src.components.metric_card import render_metric_row
    
    # Page header
    render_page_header(
        title="Regional Risk Map",
        description="Interactive map showing stunting prevalence rates by district. Color intensity indicates risk level.",
        icon="🗺️",
    )

    main_filters = sidebar.render()
    
    # Display active filters
    render_filter_summary(main_filters)
    
    st.divider()

    try:
        agg_df = es.get_risk_map_data(main_filters)
        
        # Calculate summary statistics
        if not agg_df.empty:
            total_districts = len(agg_df)
            avg_prevalence = (agg_df["jumlah_stunting"].sum() / agg_df["total_anak"].sum() * 100) if agg_df["total_anak"].sum() > 0 else 0
            total_cases = agg_df["jumlah_stunting"].sum()
            highest_risk_district = agg_df.loc[agg_df["jumlah_stunting"].idxmax()]["kecamatan"] if len(agg_df) > 0 else "N/A"
        else:
            total_districts = 0
            avg_prevalence = 0
            total_cases = 0
            highest_risk_district = "N/A"
        
        # Display map summary metrics
        st.markdown("<h3 style='margin: 1.5rem 0 1rem 0;'>Map Summary</h3>", unsafe_allow_html=True)
        
        summary_metrics = [
            {
                "icon": "📍",
                "title": "Districts Monitored",
                "value": f"{total_districts}",
                "context": "Areas with data",
            },
            {
                "icon": "📊",
                "title": "Average Prevalence",
                "value": f"{avg_prevalence:.1f}%",
                "context": "Stunting rate",
            },
            {
                "icon": "⚠️",
                "title": "Total Cases",
                "value": f"{total_cases:,.0f}",
                "context": "Registered stunting cases",
            },
            {
                "icon": "🔴",
                "title": "Highest Risk Area",
                "value": f"{highest_risk_district}",
                "context": "Requires attention",
                "delta": "High Priority",
                "delta_type": "negative",
            },
        ]
        
        render_metric_row(summary_metrics, columns=4)
        
        st.divider()
        
        # Map title
        st.markdown("<h3 style='margin: 1.5rem 0 1rem 0;'>Interactive Stunting Prevalence Map</h3>", unsafe_allow_html=True)
        
        geojson_data = load_geojson()
        enriched_geojson = _enrich_geojson(geojson_data, agg_df)

        # Filter features for display based on selections
        features_to_display = filter_geojson_features(
            enriched_geojson, main_filters["wilayah"], main_filters["kecamatan"]
        )
        view_state = compute_view_state(features_to_display)

        display_geojson = {"type": "FeatureCollection", "features": features_to_display}

        # Create map layer with design system colors
        layer = pdk.Layer(
            "GeoJsonLayer",
            display_geojson,
            opacity=0.8,
            stroked=True,
            filled=True,
            get_fill_color="[properties.fill_color[0]*1, properties.fill_color[1]*1, properties.fill_color[2]*1, properties.fill_color[3]*1]",
            get_line_color=[248, 250, 252],
            line_width_min_pixels=2,
            pickable=True,
            auto_highlight=True,
            update_triggers={"get_fill_color": display_geojson},
        )

        # Enhanced tooltip with better styling
        tooltip_html = """
        <div style="background-color: #1E293B; color: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid #334155; min-width: 250px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3B82F6;">{KABKOT}</h4>
            <h5 style="margin: 0 0 12px 0; font-size: 12px; color: #CBD5E1;">District: {KECAMATAN}</h5>
            <div style="border-top: 1px solid #334155; padding-top: 8px;">
                <p style="margin: 6px 0;"><span style="color: #94A3B8;">Prevalence Rate:</span> <strong>{prevalensi_stunting}%</strong></p>
                <p style="margin: 6px 0;"><span style="color: #94A3B8;">Stunting Cases:</span> <strong>{jumlah_stunting}</strong></p>
                <p style="margin: 6px 0;"><span style="color: #94A3B8;">Total Children:</span> <strong>{total_anak_terdata}</strong></p>
            </div>
        </div>
        """

        r = pdk.Deck(
            layers=[layer],
            initial_view_state=view_state,
            map_style="mapbox://styles/mapbox/dark-v9",
            tooltip={"html": tooltip_html, "style": {"backgroundColor": "transparent"}},
        )

        st.pydeck_chart(r, use_container_width=True)

        # Improved legend
        st.markdown(
            """
        <div style="margin-top: 1.5rem; padding: 1rem; background-color: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg);">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary);">Risk Level Guide</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background-color: #1E90FF; border-radius: 3px;"></div>
                    <span style="font-size: 12px; color: var(--text-secondary);">Very Low Risk: &lt; 10%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background-color: #FFD700; border-radius: 3px;"></div>
                    <span style="font-size: 12px; color: var(--text-secondary);">Moderate Risk: 10-50%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background-color: #FF4500; border-radius: 3px;"></div>
                    <span style="font-size: 12px; color: var(--text-secondary);">High Risk: 50-75%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background-color: #DC143C; border-radius: 3px;"></div>
                    <span style="font-size: 12px; color: var(--text-secondary);">Critical Risk: &gt; 75%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background-color: #C0C0C0; border-radius: 3px;"></div>
                    <span style="font-size: 12px; color: var(--text-secondary);">No Data Available</span>
                </div>
            </div>
        </div>
        """,
            unsafe_allow_html=True,
        )
        
        st.divider()
        
        # Highest risk areas table
        if not agg_df.empty:
            st.markdown("<h3 style='margin: 1.5rem 0 1rem 0;'>High Risk Areas</h3>", unsafe_allow_html=True)
            
            # Calculate prevalence for each row
            agg_df["prevalence"] = (agg_df["jumlah_stunting"] / agg_df["total_anak"] * 100).round(1)
            
            # Sort by prevalence and get top 10
            top_risk = agg_df.nlargest(10, "jumlah_stunting")[["kecamatan", "kabupaten", "jumlah_stunting", "total_anak", "prevalence"]]
            top_risk.columns = ["District", "Regency", "Stunting Cases", "Total Children", "Prevalence (%)"]
            
            st.dataframe(top_risk, use_container_width=True, hide_index=True)

    except Exception as e:
        st.error(f"Error loading risk map: {str(e)}")


# --- Main Execution ---
if "page_config_set" not in st.session_state:
    st.set_page_config(layout="wide")
    st.session_state.page_config_set = True
styles.load_css()
render_page()
