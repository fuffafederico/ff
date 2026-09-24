// Shows the latest published version from Perno's GitHub releases feed.
const target = document.querySelector(".perno-version");
if (target) {
  fetch("https://api.github.com/repos/fuffafederico/perno-releases/releases/latest")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data && data.tag_name) {
        target.textContent = " · versione " + data.tag_name.replace(/^v/i, "");
      }
    })
    .catch(() => {});
}
