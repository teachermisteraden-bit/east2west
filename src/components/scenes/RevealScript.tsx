/**
 * Fallback for browsers without CSS scroll-driven animations.
 *
 * Runs only where `animation-timeline: view()` is unsupported, and does nothing
 * at all under reduced motion — the stylesheet has already put every element in
 * its final state. Deliberately inline and tiny rather than a bundled component:
 * a scroll reveal is not worth a kilobyte of framework.
 */
export function RevealScript() {
  const js = `(function(){
try{
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (CSS.supports('animation-timeline: view()')) return;
  var seen = new WeakSet();
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting && !seen.has(e.target)) {
        seen.add(e.target);
        e.target.setAttribute('data-revealed','');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  var start = function(){
    document.querySelectorAll('[data-reveal]').forEach(function(el){ io.observe(el); });
    document.documentElement.setAttribute('data-reveal-fallback','');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}catch(e){
  // If anything here fails, reveal everything rather than hiding content.
  document.documentElement.setAttribute('data-reveal-off','');
}
})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
