"""
Chart Wrapper Component
Wraps Plotly charts with consistent styling and theming
"""

import streamlit as st
import plotly.graph_objects as go
from src.styles import get_color


def get_chart_template():
    """
    Get Plotly template configuration for consistent chart styling.
    
    Returns:
        Dictionary with Plotly layout template
    """
    # Color palette from design system
    primary = get_color("primary")
    secondary = get_color("secondary")
    tertiary = get_color("tertiary")
    accent = get_color("accent")
    danger = get_color("danger")
    
    bg_surface = get_color("bg-surface")
    text_primary = get_color("text-primary")
    text_secondary = get_color("text-secondary")
    border_default = get_color("border-default")
    
    template = {
        "layout": go.Layout(
            paper_bgcolor=bg_surface,
            plot_bgcolor="rgba(0,0,0,0)",
            font=dict(
                family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                size=12,
                color=text_primary,
            ),
            title=dict(
                font=dict(size=16, color=text_primary),
                x=0,
                xanchor="left",
            ),
            xaxis=dict(
                showgrid=True,
                gridwidth=1,
                gridcolor=border_default,
                showline=True,
                linewidth=1,
                linecolor=border_default,
                zeroline=False,
                tickcolor=border_default,
                tickfont=dict(color=text_secondary),
                titlefont=dict(color=text_secondary),
            ),
            yaxis=dict(
                showgrid=True,
                gridwidth=1,
                gridcolor=border_default,
                showline=True,
                linewidth=1,
                linecolor=border_default,
                zeroline=False,
                tickcolor=border_default,
                tickfont=dict(color=text_secondary),
                titlefont=dict(color=text_secondary),
            ),
            margin=dict(l=60, r=40, t=60, b=40),
            hovermode="x unified",
        ),
        "colors": [primary, secondary, tertiary, accent, danger],
    }
    
    return template


def apply_chart_theme(fig: go.Figure, title: str = "", show_legend: bool = True):
    """
    Apply design system theme to a Plotly figure.
    
    Args:
        fig: Plotly figure object
        title: Chart title
        show_legend: Whether to show legend
    
    Returns:
        Styled Plotly figure
    """
    template = get_chart_template()
    
    # Apply layout settings
    fig.update_layout(
        paper_bgcolor=template["layout"].paper_bgcolor,
        plot_bgcolor=template["layout"].plot_bgcolor,
        font=template["layout"].font,
        xaxis=template["layout"].xaxis,
        yaxis=template["layout"].yaxis,
        margin=template["layout"].margin,
        hovermode=template["layout"].hovermode,
        showlegend=show_legend,
    )
    
    if title:
        fig.update_layout(title=title)
    
    # Update legend styling
    fig.update_layout(
        legend=dict(
            bgcolor="rgba(0,0,0,0)",
            bordercolor=template["layout"].xaxis.gridcolor,
            borderwidth=1,
            font=dict(color=template["layout"].font.color),
        )
    )
    
    return fig


def render_chart(fig: go.Figure, title: str = "", subtitle: str = ""):
    """
    Render a chart with wrapper styling and metadata.
    
    Args:
        fig: Plotly figure object
        title: Chart title
        subtitle: Optional chart subtitle
    """
    if title:
        st.markdown(f'<div class="chart-title">{title}</div>', unsafe_allow_html=True)
    
    if subtitle:
        st.markdown(f'<div class="chart-subtitle">{subtitle}</div>', unsafe_allow_html=True)
    
    # Apply theme
    fig = apply_chart_theme(fig, title="")
    
    # Display chart
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
