const output = document.querySelector("#output");
const form = document.querySelector("#prompt");
const input = document.querySelector("#command-input");
const clock = document.querySelector("#clock");
const reader = document.querySelector("#entry-reader");
const readerContent = document.querySelector("#reader-content");
const readerPosition = document.querySelector("#reader-position");
const entries = window.ENTRIES ?? [];
let activeEntriesList = null;
let selectedEntryIndex = 0;
let openEntryIndex = -1;

const commandList = `
  <nav class="response commands" aria-label="Site commands">
    <button type="button" data-command="about">about</button>
    <button type="button" data-command="resume">resume</button>
    <button type="button" data-command="entries">entries</button>
    <button type="button" data-command="links">links</button>
    <button type="button" data-command="contact">contact</button>
    <button type="button" data-command="help">help</button>
    <button type="button" data-command="clear">clear</button>
  </nav>`;

const responses = {
  ls: commandList,
  help: `
    <div class="response rows">
      <span>about</span><span>short bio</span>
      <span>resume</span><span>view resume PDF</span>
      <span>entries</span><span>personal notes and writing</span>
      <span>links</span><span>elsewhere online</span>
      <span>contact</span><span>open a channel</span>
      <span>clear</span><span>clear output</span>
    </div>`,
  about: `
    <div class="response about-copy">
      <section>
        <h2>work</h2>
        <p>Software Engineer at Oracle Cloud Infrastructure</p>
        <p>Recently graduated from the Georgia Institute of Technology (May 2026)</p>
      </section>
      <section>
        <h2>interests</h2>
        <p>Open-source software, machine learning, distributed systems, and cloud infrastructure</p>
        <p>Interested in startups and new ideas — reach out to me -> travikumar7@outlook.com :))) </p>
      </section>
      <section>
        <h2>other stuff</h2>
        <p>Passionate about public transit, urban planning, cities, and the built environment</p>
        <p>Also interested in photography, Brazilian jiu-jitsu, anime/manga, running, cars (specifically Porsches and BMWs), watches, travel, and trains</p>
      </section>
    </div>`,
  projects: `
    <div class="response work-list">
      <article>
        <div class="work-heading">
          <h2>tochi.one</h2>
        </div>
        <p class="work-stack">Next.js / PyTorch / FastAPI / Twilio / Gemini API / shadcn/ui / Vercel</p>
        <p>A tenant-risk assessment and property screening platform. Built a PyTorch logistic regression system that reduced tenant defaults by 25%, alongside a responsive Next.js interface.</p>
        <a href="https://www.tochi.one/" target="_blank" rel="noreferrer">[ visit website ]</a>
      </article>
      <article>
        <div class="work-heading">
          <h2>AdBlockIRL</h2>
        </div>
        <p class="work-stack">YOLOv8 / OpenCV / Roboflow / Meta Quest AR</p>
        <p>An augmented-reality system that detects and censors ads in real time. Trained a custom YOLOv8 model capable of detecting 100+ concurrent advertisements with 5ms latency.</p>
        <p>Won $2,000 at the Bain Capital Ventures AI Hackathon as the FLORA track winner and Pond prize winner.</p>
        <a href="https://x.com/Jackyhuang/status/1921365091561202022?s=20" target="_blank" rel="noreferrer">[ view demo ]</a>
      </article>
      <article>
        <div class="work-heading">
          <h2>PopSign</h2>
        </div>
        <p class="work-stack">Unity / ASL recognition</p>
        <p>An ASL vocabulary mobile game developed in collaboration with NTID and Google. Ported ASL Engine games to Unity and enhanced datasets to improve sign-recognition accuracy.</p>
        <a href="https://www.popsign.org/" target="_blank" rel="noreferrer">[ project website ]</a>
      </article>
    </div>`,
  resume: `
    <div class="response">
      <a href="./resume.pdf" target="_blank" rel="noreferrer">open resume.pdf</a>
    </div>`,
  links: `
    <div class="response rows">
      <span>github</span><a href="https://github.com/tarunraviku" target="_blank" rel="noreferrer">github.com/tarunraviku</a>
      <span>linkedin</span><a href="https://www.linkedin.com/in/tarunraviku/" target="_blank" rel="noreferrer">linkedin.com/in/tarunraviku</a>
    </div>`,
  contact: `
    <div class="response">
      <a href="mailto:travikumar7@outlook.com">travikumar7@outlook.com</a>
    </div>`,
};

responses.work = responses.projects;

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();

  if (!command) return;

  if (command === "clear") {
    activeEntriesList = null;
    output.innerHTML = `
      <div class="entry">
        <p class="response subtle">hint: type <button type="button" data-command="ls">ls</button> to list available commands</p>
      </div>`;
    return;
  }

  const entry = document.createElement("div");
  entry.className = "entry";

  const response = command === "entries"
    ? renderEntriesList()
    : responses[command] ??
      `<p class="response error">command not found: ${escapeHtml(command)}</p>`;

  entry.innerHTML = `<p class="command"><span>~</span> ${escapeHtml(command)}</p>${response}`;
  output.append(entry);
  activeEntriesList = entry.querySelector(".entries-list");
  if (activeEntriesList) selectEntry(0, true);
  entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderEntriesList() {
  if (!entries.length) {
    return `<p class="response subtle">no entries yet</p>`;
  }

  const rows = entries
    .map(
      (entry, index) => `
        <button type="button" class="entry-row" data-entry-index="${index}" role="option">
          <time>${escapeHtml(entry.date)}</time>
          <span class="entry-row-title">${escapeHtml(entry.title)}</span>
          <span class="entry-row-arrow">-&gt;</span>
        </button>`,
    )
    .join("");

  return `
    <div class="response entries-browser">
      <div class="entries-list" role="listbox" aria-label="Entries">${rows}</div>
      <p class="entries-hint">j/k or arrows to move &middot; enter to open</p>
    </div>`;
}

function selectEntry(index, shouldFocus = false) {
  if (!activeEntriesList) return;

  const rows = [...activeEntriesList.querySelectorAll(".entry-row")];
  selectedEntryIndex = Math.max(0, Math.min(index, rows.length - 1));
  rows.forEach((row, rowIndex) => {
    const selected = rowIndex === selectedEntryIndex;
    row.classList.toggle("selected", selected);
    row.setAttribute("aria-selected", selected);
    row.tabIndex = selected ? 0 : -1;
  });
  rows[selectedEntryIndex]?.scrollIntoView({ block: "nearest" });
  if (shouldFocus) rows[selectedEntryIndex]?.focus({ preventScroll: true });
}

function openEntry(index) {
  const entry = entries[index];
  if (!entry) return;

  openEntryIndex = index;
  readerPosition.textContent = `${String(index + 1).padStart(2, "0")} / ${String(entries.length).padStart(2, "0")}`;
  readerContent.innerHTML = `
    <div class="reader-meta">
      <time>${escapeHtml(entry.date)}</time>
      <span>${entry.tags.map((tag) => `#${escapeHtml(tag)}`).join(" ")}</span>
    </div>
    <h1>${escapeHtml(entry.title)}</h1>
    <p class="reader-summary">${escapeHtml(entry.summary)}</p>
    <div class="reader-body">${entry.content.map(renderContentBlock).join("")}</div>`;
  reader.classList.add("open");
  reader.setAttribute("aria-hidden", "false");
  document.body.classList.add("reader-open");
  reader.scrollTop = 0;
  reader.querySelector("[data-close-entry]").focus();
}

function renderContentBlock(block) {
  if (block.type === "heading") {
    return `<h2>${escapeHtml(block.text)}</h2>`;
  }

  if (block.type === "image") {
    return `
      <figure>
        <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt ?? "")}" />
        ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
      </figure>`;
  }

  return `<p>${escapeHtml(block.text)}</p>`;
}

function closeEntry() {
  reader.classList.remove("open");
  reader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("reader-open");
  openEntryIndex = -1;
  const selectedRow = activeEntriesList?.querySelector(".entry-row.selected");
  if (selectedRow) {
    selectedRow.focus();
  } else {
    input.focus();
  }
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

document.addEventListener("click", (event) => {
  const entryRow = event.target.closest("[data-entry-index]");
  if (entryRow) {
    selectedEntryIndex = Number(entryRow.dataset.entryIndex);
    openEntry(selectedEntryIndex);
    return;
  }

  if (event.target.closest("[data-close-entry]")) {
    closeEntry();
    return;
  }

  const commandButton = event.target.closest("[data-command]");
  if (commandButton) runCommand(commandButton.dataset.command);
  if (!event.target.closest("a, button")) input.focus();
});

document.addEventListener("pointerover", (event) => {
  const entryRow = event.target.closest("[data-entry-index]");
  if (entryRow && activeEntriesList?.contains(entryRow)) {
    selectEntry(Number(entryRow.dataset.entryIndex));
  }
});

document.addEventListener("keydown", (event) => {
  if (reader.classList.contains("open")) {
    if (event.key === "Escape") closeEntry();
    return;
  }

  if (!activeEntriesList?.contains(document.activeElement)) return;

  if (["ArrowDown", "j", "ArrowUp", "k", "Enter"].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "ArrowDown" || event.key === "j") selectEntry(selectedEntryIndex + 1, true);
  if (event.key === "ArrowUp" || event.key === "k") selectEntry(selectedEntryIndex - 1, true);
  if (event.key === "Enter") openEntry(selectedEntryIndex);
});

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

updateClock();
setInterval(updateClock, 1000);
