// Made by 1vanbrav0 - rewritten for stability

// =========================
// Media Queries
// =========================
const mobileMediaQuery = window.matchMedia("(max-width: 400px)");
const tabletMediaQuery = window.matchMedia("(min-width: 400px) and (max-width: 600px)");

// =========================
// Elements
// =========================
const notes = document.querySelectorAll(".js-note");
const stickerEl = document.querySelector(".js-sticker");
const upPaperEl = document.querySelector(".js-up-paper");
const envelopContentEl = document.querySelector(".js-envelop-content");

// =========================
// Helpers
// =========================
function resetNote(noteEl) {
  noteEl.classList.remove("active");
  gsap.set(noteEl, {
    height: "30%",
    clearProps: "all"
  });
}

function resetAllNotes() {
  notes.forEach((note) => {
    if (note.classList.contains("active")) {
      resetNote(note);
    }
  });
}

function getExpandedHeight(index) {
  if (mobileMediaQuery.matches) {
    return 125 + 40 * index + "%";
  }

  if (tabletMediaQuery.matches) {
    return 80 + 21 * index + "%";
  }

  return 70 + 20 * index + "%";
}

function openNote(noteEl, index) {
  resetAllNotes();
  noteEl.classList.add("active");

  gsap.set(noteEl, {
    height: getExpandedHeight(index)
  });
}

function toggleNote(noteEl, index) {
  if (noteEl.classList.contains("active")) {
    resetNote(noteEl);
  } else {
    openNote(noteEl, index);
  }
}

// =========================
// Notes setup
// =========================
function notesReady() {
  gsap.to(envelopContentEl, {
    height: "110%",
    duration: 0.5
  });

  notes.forEach((note, index) => {
    note.addEventListener("click", () => {
      toggleNote(note, index);
    });
  });
}

// =========================
// Envelope animation
// =========================
function setUpPaper() {
  const arr = [0, 0, 100, 0, 50, 61];

  gsap.set(upPaperEl, {
    bottom: "97%",
    rotation: 180,
    zIndex: 200,
    clipPath: `polygon(${arr[0]}% ${arr[1]}%, ${arr[2]}% ${arr[3]}%, ${arr[4]}% ${arr[5]}%)`,
    onComplete: notesReady
  });
}

function envelopTransition() {
  gsap.to(upPaperEl, {
    bottom: "1%",
    duration: 0.25,
    onComplete: setUpPaper
  });

  upPaperEl.classList.remove("cursor");
}

// =========================
// Sticker cut
// =========================
function sticker() {
  gsap.to(stickerEl, {
    width: "20%",
    left: "-80%",
    duration: 0.2,
    onComplete: () => {
      gsap.set(stickerEl, {
        pointerEvents: "none",
        autoAlpha: 0
      });

      upPaperEl.classList.add("cursor");
      upPaperEl.addEventListener("click", envelopTransition, { once: true });
    }
  });

  document.body.classList.remove("scissors");
}

// =========================
// Init
// =========================
if (stickerEl) {
  stickerEl.addEventListener("click", sticker, { once: true });
}

// =========================
// Resize
// =========================
window.addEventListener("resize", () => {
  resetAllNotes();
});
