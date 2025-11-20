const auroraStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');

:root {
  font-family: 'Space Grotesk', 'Inter', Roboto, sans-serif;
  --sb-aurora-bg: radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(168, 85, 247, 0.25), transparent 35%),
    radial-gradient(circle at 10% 80%, rgba(14, 165, 233, 0.2), transparent 45%),
    #050b16;
  --sb-aurora-surface: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(15, 23, 42, 0.35));
  --sb-aurora-border: rgba(255, 255, 255, 0.18);
  --sb-aurora-text: #f8fafc;
}

body.sb-show-main {
  background: var(--sb-aurora-bg);
  color: var(--sb-aurora-text);
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
  border: 1px solid var(--sb-aurora-border);
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 30px 80px rgba(5, 11, 22, 0.45);
  padding: 32px;
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
