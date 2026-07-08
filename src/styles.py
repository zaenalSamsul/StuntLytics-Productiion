"""
StuntLytics Design System
Professional design system for government health analytics dashboard
Color system, typography, spacing, and component styles
"""

import streamlit as st


def load_css():
    """Inject comprehensive CSS design system and component styles."""
    st.markdown(
        """
        <style>
        /* ============================================
           DESIGN SYSTEM - COLOR TOKENS
           ============================================ */
        :root {
            /* Primary Brand Colors */
            --color-primary: #2563EB;
            --color-primary-dark: #1E40AF;
            --color-primary-light: #3B82F6;
            
            /* Secondary Brand Colors */
            --color-secondary: #EC4899;
            --color-secondary-dark: #BE185D;
            --color-secondary-light: #F472B6;
            
            /* Tertiary - Success */
            --color-tertiary: #10B981;
            --color-tertiary-dark: #047857;
            --color-tertiary-light: #6EE7B7;
            
            /* Accent - Warning */
            --color-accent: #F59E0B;
            --color-accent-dark: #D97706;
            --color-accent-light: #FBBF24;
            
            /* Danger - Risk */
            --color-danger: #EF4444;
            --color-danger-dark: #DC2626;
            --color-danger-light: #F87171;
            
            /* Risk Level Zones */
            --risk-very-low: #10B981;      /* Emerald - Very Low Risk */
            --risk-low: #3B82F6;           /* Blue - Low Risk */
            --risk-moderate: #F59E0B;      /* Amber - Moderate Risk */
            --risk-high: #EC4899;          /* Pink - High Risk */
            --risk-critical: #EF4444;      /* Red - Critical Risk */
            --risk-no-data: #94A3B8;       /* Slate - No Data */
            
            /* Background Colors - Dark Theme */
            --bg-app: #0F172A;             /* App background */
            --bg-sidebar: #1E293B;         /* Sidebar background */
            --bg-surface: #1E293B;         /* Card/Surface background */
            --bg-elevated: #334155;        /* Elevated surface (hover) */
            --bg-subtle: #0F172A;          /* Subtle background */
            
            /* Text Colors */
            --text-primary: #F8FAFC;       /* Main text */
            --text-secondary: #CBD5E1;     /* Secondary text */
            --text-muted: #94A3B8;         /* Muted text */
            --text-inverse: #1E293B;       /* Text on light backgrounds */
            
            /* Border Colors */
            --border-default: #334155;     /* Default border */
            --border-subtle: #1E293B;      /* Subtle border */
            --border-focus: #3B82F6;       /* Focus border */
            
            /* Shadow and Effects */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            
            /* Spacing Scale (8px base unit) */
            --space-0: 0;
            --space-1: 0.25rem;      /* 4px */
            --space-2: 0.5rem;       /* 8px */
            --space-3: 0.75rem;      /* 12px */
            --space-4: 1rem;         /* 16px */
            --space-5: 1.25rem;      /* 20px */
            --space-6: 1.5rem;       /* 24px */
            --space-7: 1.75rem;      /* 28px */
            --space-8: 2rem;         /* 32px */
            --space-10: 2.5rem;      /* 40px */
            --space-12: 3rem;        /* 48px */
            
            /* Border Radius */
            --radius-sm: 0.5rem;     /* 8px */
            --radius-md: 0.75rem;    /* 12px */
            --radius-lg: 1rem;       /* 16px */
            --radius-xl: 1.5rem;     /* 24px */
            
            /* Transitions */
            --transition-fast: 150ms ease-in-out;
            --transition-base: 300ms ease-in-out;
            --transition-slow: 500ms ease-in-out;
        }

        /* ============================================
           TYPOGRAPHY SYSTEM
           ============================================ */
        body, .stApp {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                         'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                         sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Headings */
        h1, .h1 {
            font-size: 2rem;        /* 32px */
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.015em;
            color: var(--text-primary);
            margin: 0;
        }

        h2, .h2 {
            font-size: 1.5rem;      /* 24px */
            font-weight: 700;
            line-height: 1.3;
            letter-spacing: -0.01em;
            color: var(--text-primary);
            margin: 0;
        }

        h3, .h3 {
            font-size: 1.25rem;     /* 20px */
            font-weight: 600;
            line-height: 1.4;
            color: var(--text-primary);
            margin: 0;
        }

        h4, .h4 {
            font-size: 1rem;        /* 16px */
            font-weight: 600;
            line-height: 1.4;
            color: var(--text-primary);
            margin: 0;
        }

        /* Body Text */
        p, .body-lg {
            font-size: 1rem;        /* 16px */
            font-weight: 400;
            line-height: 1.5;
            color: var(--text-primary);
            margin: 0;
        }

        .body-md {
            font-size: 0.875rem;    /* 14px */
            font-weight: 400;
            line-height: 1.5;
            color: var(--text-primary);
        }

        .body-sm {
            font-size: 0.75rem;     /* 12px */
            font-weight: 400;
            line-height: 1.4;
            color: var(--text-secondary);
        }

        .text-muted {
            color: var(--text-muted);
            font-size: 0.875rem;
        }

        .text-secondary {
            color: var(--text-secondary);
        }

        /* ============================================
           GLOBAL APP STYLING
           ============================================ */
        .stApp {
            background-color: var(--bg-app);
            color: var(--text-primary);
        }

        /* Remove Streamlit footer */
        footer {
            visibility: hidden;
        }

        /* Main content area */
        .main {
            padding: var(--space-8);
        }

        /* ============================================
           SIDEBAR STYLING
           ============================================ */
        [data-testid="stSidebar"] {
            background-color: var(--bg-sidebar);
            border-right: 1px solid var(--border-default);
        }

        [data-testid="stSidebar"] > div {
            padding: var(--space-8) var(--space-4);
        }

        [data-testid="stSidebar"] .stMarkdown {
            color: var(--text-primary);
        }

        /* Sidebar heading */
        .sidebar-header {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: var(--space-2);
            display: flex;
            align-items: center;
            gap: var(--space-2);
        }

        .sidebar-subtitle {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            font-weight: 600;
            margin-bottom: var(--space-4);
            margin-top: var(--space-6);
        }

        /* Sidebar inputs */
        [data-testid="stSidebar"] .stSelectbox,
        [data-testid="stSidebar"] .stDateInput,
        [data-testid="stSidebar"] .stMultiSelect,
        [data-testid="stSidebar"] .stNumberInput {
            margin-bottom: var(--space-4);
        }

        [data-testid="stSidebar"] .stSelectbox > div > div,
        [data-testid="stSidebar"] .stDateInput > div > div,
        [data-testid="stSidebar"] .stNumberInput > div > div {
            background-color: var(--bg-elevated);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
        }

        [data-testid="stSidebar"] label {
            color: var(--text-primary);
            font-size: 0.875rem;
            font-weight: 500;
        }

        /* ============================================
           PAGE HEADER COMPONENTS
           ============================================ */
        .page-header {
            margin-bottom: var(--space-8);
        }

        .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: var(--space-2);
        }

        .page-description {
            font-size: 1rem;
            color: var(--text-secondary);
            margin-bottom: var(--space-6);
        }

        .filter-summary {
            display: flex;
            gap: var(--space-2);
            flex-wrap: wrap;
            margin-bottom: var(--space-6);
            padding: var(--space-4);
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-md);
        }

        .filter-chip {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2) var(--space-3);
            background-color: var(--bg-elevated);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            color: var(--text-primary);
        }

        /* ============================================
           METRIC CARDS
           ============================================ */
        .metric-card {
            background-color: var(--bg-surface);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            transition: all var(--transition-base);
            display: flex;
            flex-direction: column;
        }

        .metric-card:hover {
            background-color: var(--bg-elevated);
            border-color: var(--border-focus);
            box-shadow: var(--shadow-lg);
        }

        .metric-card-title {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: var(--space-3);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .metric-card-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1.2;
            margin-bottom: var(--space-2);
        }

        .metric-card-context {
            font-size: 0.75rem;
            color: var(--text-muted);
            line-height: 1.4;
        }

        .metric-card-delta {
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: var(--space-3);
            display: flex;
            align-items: center;
            gap: var(--space-1);
        }

        .metric-card-delta.positive {
            color: var(--risk-very-low);
        }

        .metric-card-delta.negative {
            color: var(--color-danger);
        }

        .metric-card-delta.neutral {
            color: var(--text-secondary);
        }

        /* ============================================
           CHARTS AND VISUALIZATIONS
           ============================================ */
        .chart-container {
            background-color: var(--bg-surface);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            margin-bottom: var(--space-8);
        }

        .chart-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: var(--space-4);
        }

        .chart-subtitle {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: var(--space-4);
        }

        /* ============================================
           DATA TABLES
           ============================================ */
        .stDataFrame {
            border: 1px solid var(--border-default);
            border-radius: var(--radius-md);
            background-color: var(--bg-surface);
            overflow: hidden;
        }

        .stDataFrame > div {
            background-color: var(--bg-surface);
        }

        .stDataFrame [data-testid="stDataFrameTableWrapper"] {
            background-color: var(--bg-surface);
            border-radius: var(--radius-md);
        }

        /* Table header styling */
        [data-testid="stDataFrameTableWrapper"] thead {
            background-color: var(--bg-elevated);
            border-bottom: 1px solid var(--border-default);
        }

        [data-testid="stDataFrameTableWrapper"] thead th {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            padding: var(--space-4) !important;
        }

        [data-testid="stDataFrameTableWrapper"] tbody td {
            color: var(--text-primary);
            padding: var(--space-4) !important;
            border-bottom: 1px solid var(--border-subtle);
        }

        [data-testid="stDataFrameTableWrapper"] tbody tr:hover {
            background-color: var(--bg-elevated);
        }

        /* ============================================
           BUTTONS
           ============================================ */
        .stButton button {
            background-color: var(--color-primary);
            color: var(--text-primary);
            border: none;
            border-radius: var(--radius-sm);
            padding: var(--space-3) var(--space-6);
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            box-shadow: var(--shadow-sm);
        }

        .stButton button:hover {
            background-color: var(--color-primary-dark);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }

        .stButton button:active {
            transform: translateY(0);
            box-shadow: var(--shadow-sm);
        }

        .stButton button:disabled {
            background-color: var(--bg-elevated);
            color: var(--text-muted);
            cursor: not-allowed;
            opacity: 0.5;
        }

        /* Secondary button variant */
        .stButton button.secondary {
            background-color: var(--bg-elevated);
            border: 1px solid var(--border-default);
            color: var(--text-primary);
        }

        .stButton button.secondary:hover {
            background-color: var(--border-default);
        }

        /* ============================================
           INPUTS AND FORMS
           ============================================ */
        .stTextInput > div > div > input,
        .stNumberInput > div > div > input,
        .stDateInput > div > div > input,
        .stTimeInput > div > div > input,
        .stTextArea > div > div > textarea {
            background-color: var(--bg-elevated) !important;
            color: var(--text-primary) !important;
            border: 1px solid var(--border-default) !important;
            border-radius: var(--radius-sm) !important;
            padding: var(--space-3) var(--space-4) !important;
            font-size: 0.875rem;
        }

        .stTextInput > div > div > input:focus,
        .stNumberInput > div > div > input:focus,
        .stDateInput > div > div > input:focus,
        .stTimeInput > div > div > input:focus,
        .stTextArea > div > div > textarea:focus {
            border-color: var(--border-focus) !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
        }

        .stTextInput label,
        .stNumberInput label,
        .stDateInput label,
        .stTimeInput label,
        .stTextArea label {
            color: var(--text-primary);
            font-weight: 500;
            font-size: 0.875rem;
            margin-bottom: var(--space-2);
        }

        /* ============================================
           SELECTBOX AND MULTISELECT
           ============================================ */
        .stSelectbox > div > div,
        .stMultiSelect > div > div {
            background-color: var(--bg-elevated) !important;
            border: 1px solid var(--border-default) !important;
            border-radius: var(--radius-sm) !important;
            color: var(--text-primary) !important;
        }

        .stSelectbox > div > div:focus-within,
        .stMultiSelect > div > div:focus-within {
            border-color: var(--border-focus) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
        }

        /* ============================================
           ALERTS AND MESSAGES
           ============================================ */
        .stAlert {
            border-radius: var(--radius-lg);
            padding: var(--space-4) var(--space-6);
            border-left: 4px solid;
        }

        .stSuccess {
            background-color: rgba(16, 185, 129, 0.1);
            border-left-color: var(--risk-very-low);
            color: var(--text-primary);
        }

        .stError {
            background-color: rgba(239, 68, 68, 0.1);
            border-left-color: var(--color-danger);
            color: var(--text-primary);
        }

        .stWarning {
            background-color: rgba(245, 158, 11, 0.1);
            border-left-color: var(--color-accent);
            color: var(--text-primary);
        }

        .stInfo {
            background-color: rgba(37, 99, 235, 0.1);
            border-left-color: var(--color-primary);
            color: var(--text-primary);
        }

        /* ============================================
           BADGES AND STATUS INDICATORS
           ============================================ */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: var(--space-1);
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            border: none;
        }

        .badge-primary {
            background-color: rgba(37, 99, 235, 0.15);
            color: var(--color-primary-light);
        }

        .badge-success {
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--risk-very-low);
        }

        .badge-warning {
            background-color: rgba(245, 158, 11, 0.15);
            color: var(--color-accent-light);
        }

        .badge-danger {
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--color-danger-light);
        }

        /* Risk Zone Badges */
        .risk-badge {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2) var(--space-4);
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 0.875rem;
        }

        .risk-very-low {
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--risk-very-low);
            border: 1px solid var(--risk-very-low);
        }

        .risk-low {
            background-color: rgba(59, 130, 246, 0.15);
            color: var(--risk-low);
            border: 1px solid var(--risk-low);
        }

        .risk-moderate {
            background-color: rgba(245, 158, 11, 0.15);
            color: var(--risk-moderate);
            border: 1px solid var(--risk-moderate);
        }

        .risk-high {
            background-color: rgba(236, 72, 153, 0.15);
            color: var(--risk-high);
            border: 1px solid var(--risk-high);
        }

        .risk-critical {
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--risk-critical);
            border: 1px solid var(--risk-critical);
        }

        /* ============================================
           EXPANDERS AND COLLAPSIBLE SECTIONS
           ============================================ */
        .stExpander {
            border: 1px solid var(--border-default);
            border-radius: var(--radius-md);
            background-color: var(--bg-surface);
            overflow: hidden;
        }

        .stExpander > div > div > details > summary {
            background-color: var(--bg-elevated);
            color: var(--text-primary);
            font-weight: 600;
            padding: var(--space-4) var(--space-6);
            cursor: pointer;
            transition: background-color var(--transition-fast);
        }

        .stExpander > div > div > details > summary:hover {
            background-color: var(--border-default);
        }

        .stExpander > div > div > details > div {
            padding: var(--space-6);
            background-color: var(--bg-surface);
        }

        /* ============================================
           TABS
           ============================================ */
        .stTabs [data-baseweb="tab-list"] {
            gap: var(--space-4);
            border-bottom: 1px solid var(--border-default);
        }

        .stTabs [data-baseweb="tab"] {
            background-color: transparent;
            border-bottom: 2px solid transparent;
            color: var(--text-secondary);
            font-weight: 600;
            padding: var(--space-4) var(--space-6);
            transition: all var(--transition-fast);
        }

        .stTabs [data-baseweb="tab"][aria-selected="true"] {
            border-bottom-color: var(--color-primary);
            color: var(--color-primary);
        }

        .stTabs [data-baseweb="tab"]:hover {
            color: var(--text-primary);
        }

        /* ============================================
           COLUMNS AND LAYOUT
           ============================================ */
        .stColumns {
            gap: var(--space-6);
        }

        /* ============================================
           RESPONSIVE DESIGN
           ============================================ */
        @media (max-width: 768px) {
            .stApp {
                padding: var(--space-4);
            }

            .page-title {
                font-size: 1.5rem;
            }

            .metric-card-value {
                font-size: 1.5rem;
            }

            .stButton button {
                width: 100%;
            }

            .filter-summary {
                flex-direction: column;
            }

            .filter-chip {
                width: 100%;
            }
        }

        /* ============================================
           UTILITY CLASSES
           ============================================ */
        .gap-4 {
            gap: var(--space-4);
        }

        .gap-6 {
            gap: var(--space-6);
        }

        .gap-8 {
            gap: var(--space-8);
        }

        .p-4 {
            padding: var(--space-4);
        }

        .p-6 {
            padding: var(--space-6);
        }

        .p-8 {
            padding: var(--space-8);
        }

        .mb-4 {
            margin-bottom: var(--space-4);
        }

        .mb-6 {
            margin-bottom: var(--space-6);
        }

        .mb-8 {
            margin-bottom: var(--space-8);
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .flex {
            display: flex;
        }

        .flex-col {
            flex-direction: column;
        }

        .items-center {
            align-items: center;
        }

        .justify-between {
            justify-content: space-between;
        }

        .justify-center {
            justify-content: center;
        }

        /* ============================================
           DARK MODE SPECIFIC (Primary theme)
           ============================================ */
        @media (prefers-color-scheme: dark) {
            :root {
                /* Already set to dark theme by default */
            }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        </style>
        """,
        unsafe_allow_html=True,
    )


def get_color(color_name: str) -> str:
    """
    Get color value from design system tokens.
    
    Args:
        color_name: Name of the color token (e.g., 'primary', 'danger', 'risk-high')
    
    Returns:
        Hex color code
    """
    colors = {
        'primary': '#2563EB',
        'primary-dark': '#1E40AF',
        'primary-light': '#3B82F6',
        'secondary': '#EC4899',
        'secondary-dark': '#BE185D',
        'secondary-light': '#F472B6',
        'tertiary': '#10B981',
        'tertiary-dark': '#047857',
        'tertiary-light': '#6EE7B7',
        'accent': '#F59E0B',
        'accent-dark': '#D97706',
        'accent-light': '#FBBF24',
        'danger': '#EF4444',
        'danger-dark': '#DC2626',
        'danger-light': '#F87171',
        'risk-very-low': '#10B981',
        'risk-low': '#3B82F6',
        'risk-moderate': '#F59E0B',
        'risk-high': '#EC4899',
        'risk-critical': '#EF4444',
        'risk-no-data': '#94A3B8',
        'bg-app': '#0F172A',
        'bg-sidebar': '#1E293B',
        'bg-surface': '#1E293B',
        'bg-elevated': '#334155',
        'bg-subtle': '#0F172A',
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
        'text-muted': '#94A3B8',
        'border-default': '#334155',
        'border-subtle': '#1E293B',
        'border-focus': '#3B82F6',
    }
    return colors.get(color_name, '#000000')


def get_spacing(size: str) -> str:
    """
    Get spacing value from design system tokens.
    
    Args:
        size: Size name (e.g., '2', '4', '6', '8')
    
    Returns:
        CSS spacing value (rem)
    """
    spacing = {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
    }
    return spacing.get(size, '1rem')


def get_radius(size: str) -> str:
    """
    Get border radius value from design system tokens.
    
    Args:
        size: Size name ('sm', 'md', 'lg', 'xl')
    
    Returns:
        CSS border radius value (rem)
    """
    radius = {
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
    }
    return radius.get(size, '1rem')

