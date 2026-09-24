// Progressive enhancement for the skills strip: the list itself is a
// native, keyboard-focusable, horizontally scrollable element even
// without this script (Tab to it, then arrow keys or swipe/scroll).
// These buttons are just a more discoverable alternative.
const track = document.querySelector(".skills-track");
const prevBtn = document.querySelector(".skills-prev");
const nextBtn = document.querySelector(".skills-next");

if (track && prevBtn && nextBtn) {
  const step = () => Math.max(track.clientWidth * 0.6, 160);
  prevBtn.addEventListener("click", () => track.scrollBy({ left: -step() }));
  nextBtn.addEventListener("click", () => track.scrollBy({ left: step() }));
}
