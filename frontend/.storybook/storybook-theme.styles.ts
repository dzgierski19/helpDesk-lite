const auroraStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
  font-family: 'Space Grotesk', 'Inter', Roboto, sans-serif;
  --color-primary: #6366f1;
  --color-accent: #ec4899;
  --color-warn: #f44336;
  --color-success: #22c55e;
  --color-info: #0ea5e9;
  --color-text: #0f172a;
  --color-background: #f8fafc;
  --brand-blue: #38bdf8;
  --brand-purple: #a855f7;
  --brand-cyan: #5eead4;
  --gradient-brand: linear-gradient(120deg, var(--brand-blue), var(--brand-purple));
  --gradient-aurora: radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.22), transparent 45%),
    radial-gradient(circle at 85% 0%, rgba(168, 85, 247, 0.2), transparent 40%),
    radial-gradient(circle at 5% 85%, rgba(94, 234, 212, 0.18), transparent 50%),
    #0f172a;
  --surface-glass: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(248, 251, 255, 0.9));
  --radius-card: 1.25rem;
  --shadow-card: 0 24px 60px rgba(15, 23, 42, 0.16);
  --sb-aurora-bg: var(--gradient-aurora);
  --sb-aurora-surface: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(15, 23, 42, 0.35));
  --sb-aurora-border: rgba(255, 255, 255, 0.18);
  --sb-aurora-text: #f8fafc;
}

body.sb-show-main {
  background: var(--sb-aurora-bg);
  color: var(--sb-aurora-text);
  font-family: inherit;
  min-height: 100vh;
}

#storybook-root,
.sbdocs.sbdocs-wrapper,
.sbdocs.sbdocs-content,
.sb-show-main #storybook-root {
  font-family: inherit;
}

.sbdocs.sbdocs-wrapper {
  background: var(--sb-aurora-bg);
  color: var(--sb-aurora-text);
}

.sbdocs.sbdocs-preview,
.docs-story {
  border-radius: 24px;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.sb-aurora-panel {
  padding: 32px;
  background: var(--sb-aurora-surface);
  border-radius: 24px;
  border: 1px solid var(--sb-aurora-border);
  box-shadow: 0 20px 60px rgba(5, 11, 22, 0.4);
  backdrop-filter: blur(18px);
  width: min(520px, 100%);
}

.sbdocs.sbdocs-h2,
.sbdocs.sbdocs-h3,
.sbdocs.sbdocs-h4 {
  color: var(--sb-aurora-text);
}

.sbdocs .docblock-argstable {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sbdocs .sbdocs-title {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.sbdocs .sbdocs-content nav {
  background: rgba(5, 11, 22, 0.65);
  border-radius: 18px;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 45px rgba(5, 11, 22, 0.4);
}

.sbdocs .sbdocs-content nav * {
  color: rgba(241, 245, 249, 0.95) !important;
}

.sbdocs .sbdocs-toc__link {
  color: #22c55e;
}

.sbdocs .sbdocs-toc__link.sbdocs-toc__link--active {
  color: #c084fc;
}

/* Storybook sidebar tweaks */
aside[data-testid='sidebar'] .sidebar-subheading,
aside[data-testid='sidebar'] .sidebar-subheading span,
aside[data-testid='sidebar'] .sidebar-subheading svg {
  color: #fff !important;
  opacity: 0.9;
}
`;

const injectAuroraStyles = (): void => {
  if (typeof document === 'undefined') {
    return;
  }

  if (!document.getElementById('storybook-aurora-theme')) {
    const style = document.createElement('style');
    style.id = 'storybook-aurora-theme';
    style.textContent = auroraStyles;
    document.head.appendChild(style);
  }
};

injectAuroraStyles();
