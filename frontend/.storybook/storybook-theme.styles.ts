const auroraStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

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

.sb-aurora-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.15), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(168, 85, 247, 0.15), transparent 35%),
    #050b16;
  padding: 3rem 1.5rem;
  color: var(--sb-aurora-text);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sb-aurora-shell__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 70px rgba(5, 11, 22, 0.5);
}

.sb-aurora-shell__brand h1 {
  margin: 0;
  font-size: 1.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sb-aurora-shell__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0;
  opacity: 0.75;
  font-size: 0.8rem;
}

.sb-aurora-shell__subtitle {
  margin-top: 0.5rem;
  margin-bottom: 0;
  opacity: 0.8;
  max-width: 520px;
}

.sb-aurora-shell__user {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: right;
  align-items: flex-end;
}

.sb-aurora-shell__user-name {
  font-weight: 600;
}

.sb-aurora-shell__role {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.sb-aurora-shell__content {
  padding: 2rem;
  border-radius: 32px;
  background: rgba(5, 11, 22, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 35px 80px rgba(5, 11, 22, 0.6);
  max-width: 1150px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sb-aurora-shell__summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.15));
}

.sb-aurora-shell__summary .summary-label {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  margin: 0;
  opacity: 0.75;
}

.sb-aurora-shell__summary strong {
  display: block;
  font-size: 1.4rem;
  font-weight: 600;
}

.sbdocs .sbdocs-toc__link {
  color: #22c55e;
}

.sbdocs .sbdocs-toc__link.sbdocs-toc__link--active {
  color: #c084fc;
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
