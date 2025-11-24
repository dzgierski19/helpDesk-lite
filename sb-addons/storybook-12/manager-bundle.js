try{
(()=>{var g=__STORYBOOK_API__,{ActiveTabs:m,Consumer:h,ManagerContext:x,Provider:y,RequestResponseError:k,addons:t,combineParameters:v,controlOrMetaKey:S,controlOrMetaSymbol:_,eventMatchesShortcut:T,eventToShortcut:C,experimental_requestResponse:w,isMacLike:O,isShortcutTaken:B,keyToSymbol:R,merge:P,mockChannel:A,optionOrAltSymbol:M,shortcutMatchesShortcut:G,shortcutToHumanString:I,types:E,useAddonState:K,useArgTypes:H,useArgs:Y,useChannel:N,useGlobalTypes:j,useGlobals:q,useParameter:L,useSharedState:z,useStoryPrepared:D,useStorybookApi:U,useStorybookState:V}=__STORYBOOK_API__;var X=__STORYBOOK_THEMING__,{CacheProvider:Z,ClassNames:$,Global:rr,ThemeProvider:or,background:ar,color:er,convert:tr,create:s,createCache:sr,createGlobal:dr,createReset:cr,css:nr,darken:br,ensure:ir,ignoreSsrWarning:lr,isPropValid:pr,jsx:ur,keyframes:fr,lighten:gr,styled:mr,themes:hr,typography:xr,useTheme:yr,withTheme:kr}=__STORYBOOK_THEMING__;var d=`
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
  --sb-aurora-bg: var(--surface-glass, #f8fafc);
  --sb-aurora-surface: var(--surface-glass, #f8fafc);
  --sb-aurora-border: rgba(15, 23, 42, 0.08);
  --sb-aurora-text: var(--color-text, #0f172a);
}

body.sb-show-main {
  background: var(--surface-glass, #f8fafc);
  color: var(--color-text, #0f172a);
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
  background: var(--surface-glass, #f8fafc);
  color: var(--color-text, #0f172a);
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
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.sbdocs .sbdocs-title {
  color: var(--color-text, #0f172a);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.sbdocs .sbdocs-content nav {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
}

.sbdocs .sbdocs-content nav * {
  color: var(--color-text, #0f172a) !important;
}

.sbdocs .sbdocs-toc__link {
  color: var(--color-primary, #6366f1);
}

.sbdocs .sbdocs-toc__link.sbdocs-toc__link--active {
  color: var(--color-accent, #ec4899);
}

/* Storybook sidebar tweaks */
aside[data-testid='sidebar'] .sidebar-subheading,
aside[data-testid='sidebar'] .sidebar-subheading span,
aside[data-testid='sidebar'] .sidebar-subheading svg {
  color: #fff !important;
  opacity: 0.9;
}
`,c=()=>{if(!(typeof document>"u")&&!document.getElementById("storybook-aurora-theme")){let e=document.createElement("style");e.id="storybook-aurora-theme",e.textContent=d,document.head.appendChild(e)}};c();var n=s({base:"dark",brandTitle:"Helpdesk Lite",brandUrl:"https://github.com/dzgierski19/helpDesk-lite",colorPrimary:"#38bdf8",colorSecondary:"#a855f7",appBg:"#050b16",appContentBg:"#0b1120",appBorderColor:"rgba(255, 255, 255, 0.08)",appBorderRadius:16,textColor:"#f8fafc",textInverseColor:"#0f172a",barBg:"#0b1120",barTextColor:"#94a3b8",barSelectedColor:"#a855f7",inputBg:"#0f172a",inputBorder:"rgba(148, 163, 184, 0.4)",inputTextColor:"#f8fafc",inputBorderRadius:12});t.setConfig({theme:n});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
