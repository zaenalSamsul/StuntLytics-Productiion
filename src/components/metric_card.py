"""
Metric Card Component
Displays KPI metrics with value, context, and optional delta
"""

import streamlit as st


def render_metric_card(
    title: str,
    value: str,
    context: str = "",
    delta: str = "",
    delta_type: str = "neutral",  # 'positive', 'negative', 'neutral'
    icon: str = "",
):
    """
    Render a styled metric card with KPI information.
    
    Args:
        title: Card title (KPI name)
        value: Main value to display
        context: Contextual information (e.g., "1.284 dari 6.978 bayi")
        delta: Delta value to display (e.g., "+5%" or "-2.3")
        delta_type: Type of delta ('positive', 'negative', 'neutral')
        icon: Optional emoji icon
    """
    delta_class = f"metric-card-delta {delta_type}"
    delta_html = f'<div class="{delta_class}">{delta}</div>' if delta else ""
    context_html = f'<div class="metric-card-context">{context}</div>' if context else ""
    
    card_html = f"""
    <div class="metric-card">
        <div class="metric-card-title">{icon} {title}</div>
        <div class="metric-card-value">{value}</div>
        {context_html}
        {delta_html}
    </div>
    """
    
    st.markdown(card_html, unsafe_allow_html=True)


def render_metric_row(metrics: list, columns: int = 4):
    """
    Render multiple metric cards in a row.
    
    Args:
        metrics: List of metric dictionaries with keys: title, value, context, delta, delta_type, icon
        columns: Number of columns to display
    """
    cols = st.columns(columns)
    
    for idx, metric in enumerate(metrics):
        if idx >= columns:
            break
        
        with cols[idx]:
            render_metric_card(
                title=metric.get("title", ""),
                value=metric.get("value", ""),
                context=metric.get("context", ""),
                delta=metric.get("delta", ""),
                delta_type=metric.get("delta_type", "neutral"),
                icon=metric.get("icon", ""),
            )
