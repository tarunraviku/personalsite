const output = document.querySelector("#output");
const form = document.querySelector("#prompt");
const input = document.querySelector("#command-input");
const clock = document.querySelector("#clock");

const commandList = `
  <nav class="response commands" aria-label="Site commands">
    <button type="button" data-command="about">about</button>
    <button type="button" data-command="resume">resume</button>
    <button type="button" data-command="projects">projects</button>
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
      <span>projects</span><span>selected projects</span>
      <span>links</span><span>elsewhere online</span>
      <span>contact</span><span>open a channel</span>
      <span>clear</span><span>clear output</span>
    </div>`,
  about: `
    <div class="response about-copy">
      <section>
        <h2>work</h2>
        <p>Software Engineer at Oracle Cloud Infrastructure.</p>
        <p>Recently graduated from the Georgia Institute of Technology (May 2026).</p>
      </section>
      <section>
        <h2>interests</h2>
        <p>Open-source software, machine learning, distributed systems, and cloud infrastructure.</p>
        <p>Interested in startups and new ideas. Reach out to me -> travikumar7@outlook.com :))) </p>
      </section>
      <section>
        <h2>other stuff</h2>
        <p>Passionate about public transit, urban planning, cities, and the built environment.</p>
        <p>Also interested in photography, Brazilian jiu-jitsu, anime/manga, running, cars (specifically Porsches and BMWs), watches, travel, and trains.</p>
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
    output.innerHTML = `
      <div class="entry">
        <p class="response subtle">hint: type <button type="button" data-command="ls">ls</button> to list available commands</p>
      </div>`;
    return;
  }

  const entry = document.createElement("div");
  entry.className = "entry";

  const response =
    responses[command] ??
    `<p class="response error">command not found: ${escapeHtml(command)}</p>`;

  entry.innerHTML = `<p class="command"><span>~</span> ${escapeHtml(command)}</p>${response}`;
  output.append(entry);
  entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  const commandButton = event.target.closest("[data-command]");
  if (commandButton) runCommand(commandButton.dataset.command);
  if (!event.target.closest("a")) input.focus();
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
