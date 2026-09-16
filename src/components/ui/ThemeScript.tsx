/**
 * Applies the saved theme before first paint so the page never flashes.
 * Runs ahead of hydration and is intentionally tiny. If storage is unavailable
 * (private mode, blocked cookies) it silently falls back to the system setting,
 * which the stylesheet already handles.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('e2w-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
