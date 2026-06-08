const output = document.querySelector("#output");
const form = document.querySelector("#prompt");
const input = document.querySelector("#command-input");
const clock = document.querySelector("#clock");

const commandList = `
  <nav class="response commands" aria-label="Site commands">
    <button type="button" data-command="about">about</button>
    <button type="button" data-command="work">work</button>
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
      <span>work</span><span>selected projects</span>
      <span>links</span><span>elsewhere online</span>
      <span>contact</span><span>open a channel</span>
      <span>clear</span><span>clear output</span>
    </div>`,
  about: `
    <div class="response">
      <p>I build thoughtful software and explore technology, design, and people.</p>
      <p class="subtle">interests: creative code, computer vision, interaction, web</p>
    </div>`,
  work: `
    <div class="response rows">
      <span>01</span><a href="#">project signal</a>
      <span>02</span><a href="#">interface study</a>
      <span>03</span><a href="#">archive system</a>
    </div>`,
  links: `
    <div class="response rows">
      <span>github</span><a href="https://github.com/" target="_blank" rel="noreferrer">github.com/</a>
      <span>linkedin</span><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">linkedin.com/</a>
    </div>`,
  contact: `
    <div class="response">
      <a href="mailto:hello@example.com">hello@example.com</a>
    </div>`,
};

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();

  if (!command) return;

  if (command === "clear") {
    output.replaceChildren();
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
