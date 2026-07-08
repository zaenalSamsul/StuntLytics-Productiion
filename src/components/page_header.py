"""
Page Header Component
Displays page title, description, and optional contextual information
"""

import streamlit as st


def render_page_header(title: str, description: str = "", icon: str = ""):
    """
    Render a styled page header with title and description.
    
    Args:
        title: Page title
        description: Optional page description
        icon: Optional emoji or icon to display before title
    """
    col1, col2 = st.columns([1, 6])
    
    if icon:
        with col1:
            st.markdown(f"<div style='font-size: 2rem; text-align: center;'>{icon}</div>", 
                       unsafe_allow_html=True)
    
    with col1 if icon else col2:
        pass
    
    with col2 if icon else col1:
        st.markdown(
            f'<div class="page-header"><h1 class="page-title">{title}</h1></div>',
            unsafe_allow_html=True
        )
    
    if description:
        st.markdown(
            f'<div class="page-description">{description}</div>',
            unsafe_allow_html=True
        )


def render_filter_summary(filters: dict):
    """
    Render active filters as chips/tags.
    
    Args:
        filters: Dictionary of active filters
    """
    filter_items = []
    
    # Format filter display
    if filters.get("date_from") or filters.get("date_to"):
        date_from = filters.get("date_from", "").strftime("%d %b %Y") if filters.get("date_from") else "?"
        date_to = filters.get("date_to", "").strftime("%d %b %Y") if filters.get("date_to") else "?"
        filter_items.append(f"📅 {date_from} — {date_to}")
    
    if filters.get("wilayah"):
        wilayah_text = ", ".join(filters["wilayah"]) if isinstance(filters["wilayah"], list) else filters["wilayah"]
        filter_items.append(f"📍 {wilayah_text}")
    
    if filters.get("kecamatan"):
        kecamatan_text = ", ".join(filters["kecamatan"]) if isinstance(filters["kecamatan"], list) else filters["kecamatan"]
        filter_items.append(f"🏘️ {kecamatan_text}")
    
    if filters.get("risk_level"):
        risk_text = ", ".join(filters["risk_level"]) if isinstance(filters["risk_level"], list) else filters["risk_level"]
        filter_items.append(f"⚠️ {risk_text}")
    
    if filter_items:
        chips_html = "".join([f'<span class="filter-chip">{item}</span>' for item in filter_items])
        st.markdown(f'<div class="filter-summary">{chips_html}</div>', unsafe_allow_html=True)
