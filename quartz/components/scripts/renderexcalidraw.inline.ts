// Rendering of Excalidraw images
function getUserPreferredColorScheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function getTheme() {
  return localStorage.getItem("theme") ?? getUserPreferredColorScheme()
}

function draw(el, theme: "light" | "dark") {
  if (el.localName == "blockquote") {
    let img = document.createElement("img")
    img.src = `/excalidraw/${el.dataset.url}.${theme}.svg`
    el.replaceWith(img)
  }
  return el
}

function drawAll(e) {
  let theme = getTheme()
  document
    .querySelectorAll("blockquote.transclude[data-url]")
    .forEach((blockquote) => draw(blockquote, theme))
}

function redraw(img, targetTheme: "light" | "dark") {
  let srcParts = img.src.split(".")
  srcParts.splice(-2, 1, targetTheme)
  img.src = srcParts.join(".")

  return img
}

function redrawAll(e) {
  let targetTheme = getTheme() // NOTE: Dependent on `Darkmode` component handler already having changed this value.
  let currentTheme = targetTheme == "dark" ? "light" : "dark"
  Object.values(document.getElementsByTagName("article")[0].getElementsByTagName("img")).forEach(
    (img) => {
      if (img.src.endsWith(`.${currentTheme}.svg`)) {
        redraw(img, targetTheme)
      }
    },
  )
}

document.addEventListener("nav", (e) => {
  drawAll(e)
  document.addEventListener("themechange", redrawAll)
  window.addCleanup?.(() => document.removeEventListener("themechange", redrawAll))
})
