"""
StuntLytics Sidebar Navigation & Filter Component
Redesigned sidebar with improved visual hierarchy and filter UX
"""

import streamlit as st
from typing import Dict, Any, List
from src import elastic_client as es

# Risk Level Definitions
RISK_LEVELS: List[str] = [
    "Zona 3 (>=0.70)",
    "Zona 2 (0.40-<0.70)",
    "Zona 1 (0.10-<0.40)",
    "Zona 0 (<0.10)",
]


def render() -> Dict[str, Any]:
    """
    Render redesigned sidebar with improved filter UX and visual hierarchy.
    Dynamic filter options from Elasticsearch.
    
    Returns:
        Dictionary with filter selections
    """
    # Sidebar Header with branding
    st.sidebar.markdown(
        '<div class="sidebar-header">StuntLytics</div>',
        unsafe_allow_html=True
    )
    st.sidebar.markdown(
        '<div style="color: var(--text-secondary); font-size: 0.75rem; margin-bottom: 2rem;">Decision Intelligence Platform</div>',
        unsafe_allow_html=True
    )
    
    st.sidebar.divider()
    
    # Section 1: Data Scope
    st.sidebar.markdown(
        '<div class="sidebar-subtitle">Data Scope</div>',
        unsafe_allow_html=True
    )
    
    # Filter Tanggal (Date Range)
    st.sidebar.subheader("Period", divider=False)
    date_from = st.sidebar.date_input(
        "From",
        value=None,
        label_visibility="collapsed",
        key="date_from_filter"
    )
    date_to = st.sidebar.date_input(
        "To",
        value=None,
        label_visibility="collapsed",
        key="date_to_filter"
    )
    
    st.sidebar.divider()
    
    base_filters = {"date_from": date_from, "date_to": date_to}

    # Section 2: Location Filters
    st.sidebar.markdown(
        '<div class="sidebar-subtitle">Location</div>',
        unsafe_allow_html=True
    )
    
    # Filter Wilayah (Kabupaten/Kota)
    wilayah_field, wilayah_opts = es.get_filter_options(
        base_filters, es.CANDIDATES_WILAYAH
    )
    selected_wilayah = st.sidebar.multiselect(
        "Regency / City",
        options=wilayah_opts,
        key="wilayah_filter"
    )

    # Filter Kecamatan (dependent on wilayah selection)
    kecamatan_field, kecamatan_opts = None, []
    if selected_wilayah:
        tmp_filters_for_kec = dict(base_filters)
        tmp_filters_for_kec.update(
            {"wilayah_field": wilayah_field, "wilayah": selected_wilayah}
        )
        kecamatan_field, kecamatan_opts = es.get_filter_options(
            tmp_filters_for_kec, es.CANDIDATES_KECAMATAN, size=3000
        )
    
    selected_kecamatan = st.sidebar.multiselect(
        "District",
        options=kecamatan_opts if kecamatan_opts else ["Select regency first"],
        disabled=not selected_wilayah,
        key="kecamatan_filter"
    ) if kecamatan_opts else []

    st.sidebar.divider()

    # Section 3: Risk Profile
    st.sidebar.markdown(
        '<div class="sidebar-subtitle">Risk Profile</div>',
        unsafe_allow_html=True
    )
    
    selected_risk_level = st.sidebar.multiselect(
        "Risk Level",
        options=RISK_LEVELS,
        key="risk_level_filter"
    )

    st.sidebar.divider()

    # Section 4: System Status (Footer)
    st.sidebar.markdown(
        '<div class="sidebar-subtitle">System Status</div>',
        unsafe_allow_html=True
    )
    
    # Check ES connection status
    ok, status_msg = es.ping()
    if ok:
        st.sidebar.success("✓ Data Connected", icon="✓")
    else:
        st.sidebar.error("✕ Connection Failed", icon="✕")
    
    st.sidebar.caption("Data updates automatically. Last refresh in real-time.")

    return {
        "date_from": date_from,
        "date_to": date_to,
        "wilayah": selected_wilayah,
        "kecamatan": selected_kecamatan,
        "risk_level": selected_risk_level,
        "wilayah_field": wilayah_field,
        "kecamatan_field": kecamatan_field,
    }
