"""
Badge Components
Displays status badges, risk levels, and labels
"""

import streamlit as st


def render_badge(label: str, variant: str = "primary"):
    """
    Render a styled badge.
    
    Args:
        label: Badge text
        variant: Badge style ('primary', 'success', 'warning', 'danger')
    
    Returns:
        HTML string for the badge
    """
    badge_class = f"badge badge-{variant}"
    return f'<span class="{badge_class}">{label}</span>'


def render_risk_badge(risk_level: str, zone: int = 0):
    """
    Render a risk level badge with color coding.
    
    Args:
        risk_level: Risk level text (e.g., "Tinggi", "Rendah")
        zone: Risk zone (0-3) for color coding
    
    Returns:
        HTML string for the risk badge
    """
    # Risk zone to CSS class mapping
    zone_classes = {
        0: "risk-very-low",
        1: "risk-low",
        2: "risk-moderate",
        3: "risk-high",
    }
    
    # Map numeric risk levels to zones if needed
    risk_to_zone = {
        "sangat rendah": 0,
        "rendah": 1,
        "sedang": 2,
        "tinggi": 3,
        "sangat tinggi": 3,
        "very low": 0,
        "low": 1,
        "moderate": 2,
        "high": 3,
        "critical": 3,
    }
    
    # Determine zone
    zone_class = zone_classes.get(zone, "risk-moderate")
    if risk_level.lower() in risk_to_zone:
        zone = risk_to_zone[risk_level.lower()]
        zone_class = zone_classes.get(zone, "risk-moderate")
    
    return f'<span class="risk-badge {zone_class}">{risk_level}</span>'


def render_inline_badge(label: str, variant: str = "primary"):
    """
    Render badge inline in Streamlit.
    
    Args:
        label: Badge text
        variant: Badge style
    """
    badge_html = render_badge(label, variant)
    st.markdown(badge_html, unsafe_allow_html=True)


def render_inline_risk_badge(risk_level: str, zone: int = 0):
    """
    Render risk badge inline in Streamlit.
    
    Args:
        risk_level: Risk level text
        zone: Risk zone for color coding
    """
    badge_html = render_risk_badge(risk_level, zone)
    st.markdown(badge_html, unsafe_allow_html=True)
