"""
Alert Component
Displays messages with semantic meaning (info, success, warning, error)
"""

import streamlit as st


def render_alert(message: str, alert_type: str = "info", dismissible: bool = False):
    """
    Render a styled alert message.
    
    Args:
        message: Message content
        alert_type: Type of alert ('info', 'success', 'warning', 'error')
        dismissible: Whether alert can be dismissed
    """
    # Icon mapping
    icons = {
        "info": "ℹ️",
        "success": "✓",
        "warning": "⚠️",
        "error": "✕",
    }
    
    # Color mapping for the semantic meaning
    css_class_map = {
        "info": "stInfo",
        "success": "stSuccess",
        "warning": "stWarning",
        "error": "stError",
    }
    
    icon = icons.get(alert_type, "•")
    css_class = css_class_map.get(alert_type, "stInfo")
    
    html = f"""
    <div class="stAlert {css_class}">
        <div style="display: flex; gap: 0.5rem;">
            <span>{icon}</span>
            <div>{message}</div>
        </div>
    </div>
    """
    
    st.markdown(html, unsafe_allow_html=True)


def render_info(message: str):
    """Render an info alert."""
    render_alert(message, "info")


def render_success(message: str):
    """Render a success alert."""
    render_alert(message, "success")


def render_warning(message: str):
    """Render a warning alert."""
    render_alert(message, "warning")


def render_error(message: str):
    """Render an error alert."""
    render_alert(message, "error")
