// LeaveX Design System - Dark Glassmorphism Theme

export const colors = {
  // Base colors
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
  },
  
  // Glass morphism
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Primary brand
  primary: {
    main: '#8b5cf6',
    light: '#a78bfa',
    dark: '#7c3aed',
    gradient: ['#8b5cf6', '#7c3aed'],
  },
  
  // Stream-specific gradients
  streams: {
    cse: {
      gradient: ['#3b82f6', '#8b5cf6'],
      background: 'rgba(59, 130, 246, 0.15)',
    },
    ece: {
      gradient: ['#a855f7', '#ec4899'],
      background: 'rgba(168, 85, 247, 0.15)',
    },
    mech: {
      gradient: ['#ef4444', '#f97316'],
      background: 'rgba(239, 68, 68, 0.15)',
    },
    civil: {
      gradient: ['#10b981', '#14b8a6'],
      background: 'rgba(16, 185, 129, 0.15)',
    },
    eee: {
      gradient: ['#f59e0b', '#eab308'],
      background: 'rgba(245, 158, 11, 0.15)',
    },
  },
  
  // Status colors
  status: {
    pending: {
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.15)',
    },
    approved: {
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.15)',
    },
    rejected: {
      color: '#ef4444',
      background: 'rgba(239, 68, 68, 0.15)',
    },
    processing: {
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.15)',
    },
  },
  
  // Text colors
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    disabled: '#64748b',
  },
  
  // Semantic colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Overlay
  overlay: 'rgba(15, 23, 42, 0.8)',
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const blur = {
  sm: 10,
  md: 20,
  lg: 30,
};

export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
};
