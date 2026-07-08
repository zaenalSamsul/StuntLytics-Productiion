"""
StuntLytics - Executive Dashboard
Decision Intelligence Platform for Stunting Risk Monitoring
"""

import streamlit as st
import plotly.graph_objects as go
from src import config, styles, elastic_client as es
from src.components.sidebar import render
from src.components.page_header import render_page_header, render_filter_summary
from src.components.metric_card import render_metric_row
from src.components.chart_wrapper import apply_chart_theme
from src.components.alert import render_info
from src.styles import get_color


def create_stunting_chart(stunting_data: dict) -> go.Figure:
    """Create stunting proportion pie chart."""
    fig = go.Figure(
        data=[
            go.Pie(
                labels=list(stunting_data.keys()),
                values=list(stunting_data.values()),
                hole=0.5,
                textinfo="percent",
                marker=dict(
                    colors=[get_color("risk-critical"), get_color("tertiary")]
                ),
            )
        ]
    )
    fig = apply_chart_theme(fig, show_legend=False)
    fig.update_layout(height=250, margin=dict(t=30, b=10, l=10, r=10))
    return fig


def create_nakes_chart(nakes_grouped, title: str, yaxis_title: str) -> go.Figure:
    """Create healthcare workers bar chart."""
    fig = go.Figure(
        data=[
            go.Bar(
                x=nakes_grouped.values,
                y=nakes_grouped.index,
                orientation="h",
                marker=dict(color=get_color("primary")),
            )
        ]
    )
    fig = apply_chart_theme(fig)
    fig.update_layout(
        title=title,
        xaxis_title="Count",
        yaxis_title=yaxis_title,
        yaxis={"categoryorder": "total ascending"},
        height=250,
        margin=dict(t=60, b=30, l=120, r=10),
    )
    return fig


def create_immunization_chart(imun_data) -> go.Figure:
    """Create immunization trend line chart."""
    fig = go.Figure(
        data=[
            go.Scatter(
                x=imun_data["tanggal"],
                y=imun_data["imunisasi_lengkap"] * 100,
                mode="lines+markers",
                line=dict(color=get_color("tertiary"), width=3),
                marker=dict(size=6),
                fill="tozeroy",
                fillcolor=f"rgba({int('16')}, {int('185')}, {int('129')}, 0.1)",
            )
        ]
    )
    fig = apply_chart_theme(fig)
    fig.update_layout(
        title="Immunization Coverage Trend",
        xaxis_title="Month",
        yaxis_title="Coverage (%)",
        height=250,
        margin=dict(t=60, b=30, l=50, r=10),
    )
    return fig


def create_water_access_chart(water_data) -> go.Figure:
    """Create water access distribution pie chart."""
    fig = go.Figure(
        data=[
            go.Pie(
                labels=water_data.index,
                values=water_data.values,
                hole=0.4,
                textinfo="percent",
                marker=dict(
                    colors=[
                        get_color("primary"),
                        get_color("secondary"),
                        get_color("tertiary"),
                    ]
                ),
            )
        ]
    )
    fig = apply_chart_theme(fig, show_legend=True)
    fig.update_layout(height=250, margin=dict(t=30, b=10, l=10, r=10))
    return fig


def main():
    """Main dashboard application."""
    st.set_page_config(
        page_title=config.APP_TITLE,
        page_icon="📊",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    styles.load_css()

    # Check connection
    ok, _ = es.ping()
    if not ok:
        st.error("Unable to connect to data service. Application cannot run.")
        st.stop()

    # Render sidebar and get filters
    filters = render()
    st.session_state["filters"] = filters

    # Fetch data
    try:
        with st.spinner("Loading executive summary..."):
            summary_data = es.get_main_page_summary(filters)
    except Exception as e:
        st.error(f"Error loading data: {e}")
        st.stop()

    # Extract KPI and chart data
    kpi_data = summary_data["kpi"]
    chart_data = summary_data["charts"]

    # Page Header with visual hierarchy
    render_page_header(
        title="Executive Overview",
        description="Monitor stunting conditions, regional risks, and intervention coverage across West Java",
        icon="📊",
    )

    # Active Filters Summary
    render_filter_summary(filters)

    st.divider()

    # ============================================================================
    # SECTION 1: CRITICAL KPI METRICS
    # ============================================================================
    st.markdown("<h2 style='margin: 2rem 0 1rem 0;'>Key Performance Indicators</h2>", 
               unsafe_allow_html=True)

    total_bayi_lahir = kpi_data["total_bayi_lahir"]
    total_bayi_stunting = kpi_data["total_bayi_stunting"]
    total_nakes = kpi_data["jumlah_nakes"]
    imun_cov = kpi_data["cakupan_imunisasi_pct"]
    air_cov = kpi_data["akses_air_layak_pct"]

    # Calculate prevalence
    prevalensi = (total_bayi_stunting / total_bayi_lahir * 100) if total_bayi_lahir > 0 else 0

    metrics = [
        {
            "icon": "👶",
            "title": "Total Births",
            "value": f"{total_bayi_lahir:,.0f}",
            "context": "Children registered",
        },
        {
            "icon": "⚠️",
            "title": "Stunting Cases",
            "value": f"{total_bayi_stunting:,.0f}",
            "context": f"{prevalensi:.1f}% prevalence",
            "delta": "High Priority",
            "delta_type": "negative",
        },
        {
            "icon": "🏥",
            "title": "Healthcare Workers",
            "value": f"{total_nakes:,.0f}",
            "context": "Nutritionists & nurses",
        },
        {
            "icon": "💉",
            "title": "Immunization Coverage",
            "value": f"{imun_cov:.1f}%",
            "context": "SSGI Key Indicator",
        },
    ]

    render_metric_row(metrics, columns=4)

    st.divider()

    # ============================================================================
    # SECTION 2: MAIN ANALYTICAL AREA
    # ============================================================================
    st.markdown("<h2 style='margin: 2rem 0 1rem 0;'>Analysis Overview</h2>", 
               unsafe_allow_html=True)

    # 2-column layout for primary charts
    col_left, col_right = st.columns(2)

    with col_left:
        st.markdown(
            '<div class="chart-container"><div class="chart-title">Stunting Proportion</div>',
            unsafe_allow_html=True,
        )
        stunting_data = {
            "Stunted": total_bayi_stunting,
            "Not Stunted": total_bayi_lahir - total_bayi_stunting,
        }
        fig_stunting = create_stunting_chart(stunting_data)
        st.plotly_chart(fig_stunting, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with col_right:
        st.markdown(
            '<div class="chart-container"><div class="chart-title">Water & Sanitation Access</div>',
            unsafe_allow_html=True,
        )
        water_data = chart_data["air_distribusi"]
        fig_water = create_water_access_chart(water_data)
        st.plotly_chart(fig_water, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    # Secondary analysis charts
    col_left2, col_right2 = st.columns(2)

    with col_left2:
        st.markdown(
            '<div class="chart-container"><div class="chart-title">Healthcare Workforce Distribution</div>',
            unsafe_allow_html=True,
        )
        nakes_grouped = chart_data["nakes_by_region"]
        if not filters["wilayah"]:
            title_nakes = "Healthcare Workers by Regency"
            yaxis_nakes = "Regency"
        elif not filters["kecamatan"]:
            title_nakes = f"Healthcare Workers in {filters['wilayah'][0]}"
            yaxis_nakes = "District"
        else:
            title_nakes = f"Healthcare Workers in {filters['kecamatan'][0]}"
            yaxis_nakes = "Area"

        fig_nakes = create_nakes_chart(nakes_grouped, title_nakes, yaxis_nakes)
        st.plotly_chart(fig_nakes, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with col_right2:
        st.markdown(
            '<div class="chart-container"><div class="chart-title">Immunization Coverage Trend</div>',
            unsafe_allow_html=True,
        )
        imun_trend = chart_data["imunisasi_trend"]
        fig_imun = create_immunization_chart(imun_trend)
        st.plotly_chart(fig_imun, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    st.divider()

    # ============================================================================
    # SECTION 3: CONTEXTUAL INFORMATION & NEXT STEPS
    # ============================================================================
    st.markdown("<h2 style='margin: 2rem 0 1rem 0;'>Next Steps</h2>", 
               unsafe_allow_html=True)

    col_action1, col_action2, col_action3 = st.columns(3)

    with col_action1:
        if st.button("🗺️ View Regional Risk Map", use_container_width=True):
            st.switch_page("pages/risk_map.py")

    with col_action2:
        if st.button("📊 Explore Data", use_container_width=True):
            st.switch_page("pages/explorer_data.py")

    with col_action3:
        if st.button("🤖 AI Insights", use_container_width=True):
            st.switch_page("pages/InsightNow.py")

    st.divider()

    # Footer information
    render_info(
        "Welcome to StuntLytics Executive Dashboard. Use the sidebar to refine filters or navigate to detailed analysis pages."
    )


if __name__ == "__main__":
    main()
