/* Shared helpers for the Alfa Water journey pages. The page is complete without this file: it only adds the scroll film. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = window.Story = { reduce: reduce, ready: !!(window.gsap && window.ScrollTrigger) };

  // split every word of an element into its own span, keeping inner markup such as .k
  S.split = function(el){
    if(el.getAttribute('data-split')) return el.querySelectorAll('.w');
    function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType === 3){
          var parts = n.nodeValue.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function(p){
            if(!p) return;
            if(/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'w'; s.style.display = 'inline-block'; s.textContent = p; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if(n.nodeType === 1 && n.tagName !== 'BR'){ walk(n); }
      });
    }
    walk(el); el.setAttribute('data-split', '1');
    return el.querySelectorAll('.w');
  };

  // grey to ink as the reader scrolls (opacity, so the key words keep their colour)
  S.reveal = function(el){
    var words = S.split(el);
    if(!S.ready || reduce) return;
    gsap.fromTo(words, {opacity: .16}, {opacity: 1, ease: 'none', stagger: .12,
      scrollTrigger: {trigger: el, start: window.innerWidth <= 860 ? 'top 96%' : 'top 88%', end: window.innerWidth <= 860 ? 'top 70%' : 'top 46%', scrub: .4}});
  };

  // the tagline, word by word on load
  S.intro = function(el, delay){
    var words = S.split(el);
    if(!S.ready || reduce) return;
    gsap.fromTo(words, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: .8, stagger: .24, ease: 'power2.out', delay: delay || .3});
  };

  // keep a nowrap line on 1 line by shrinking its size, never breaking it
  S.fit = function(el){
    function run(){
      el.style.fontSize = '';
      var box = el.parentNode.clientWidth, w = el.scrollWidth;
      if(w > box){ el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * box / w * .97) + 'px'; }
    }
    run();
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    window.addEventListener('resize', run);
  };

  // draw a path (pathLength=1) as the timeline passes `start`
  S.draw = function(tl, path, start, dur){
    if(!path) return;
    gsap.set(path, {strokeDashoffset: 1, opacity: 0});
    tl.set(path, {opacity: 1}, start).to(path, {strokeDashoffset: 0, duration: dur, ease: 'none'}, start);
  };
})();
