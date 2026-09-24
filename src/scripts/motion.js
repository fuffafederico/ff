const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

// reveal on scroll
const items = document.querySelectorAll(".rv");
if (still || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
  );
  items.forEach((el) => io.observe(el));
}

// Perno: latest version from GitHub releases (build-time value is the fallback)
const ver = document.querySelector("[data-perno-version]");
if (ver) {
  const key = "perno-ver";
  const paint = (v) => { if (v) ver.textContent = "v" + v; };
  try {
    const c = JSON.parse(sessionStorage.getItem(key) || "null");
    if (c && Date.now() - c.t < 36e5) paint(c.v);
    else throw 0;
  } catch {
    fetch("https://api.github.com/repos/fuffafederico/perno-releases/releases/latest")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !d.tag_name) return;
        const v = d.tag_name.replace(/^v/i, "");
        paint(v);
        try { sessionStorage.setItem(key, JSON.stringify({ v, t: Date.now() })); } catch {}
      })
      .catch(() => {});
  }
}
