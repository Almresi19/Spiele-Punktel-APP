// app.js
const gameSelect = document.getElementById("game");
const playerCount = document.getElementById("players");
const startBtn = document.getElementById("startBtn");
const playerSetup = document.getElementById("player-setup");
const playerForm = document.getElementById("playerForm");
const beginGameBtn = document.getElementById("beginGame");
const gameBoard = document.getElementById("game-board");
const currentGame = document.getElementById("currentGame");
const scoreboard = document.getElementById("scoreboard");
const nextRoundBtn = document.getElementById("nextRound");

let gameType = "";
let players = [];
const wuerfelwurstSymbols = ["Wanze", "Wespe", "Wurm", "Wachtel", "Wiesel", "Waschbär"];

startBtn.addEventListener("click", () => {
  gameType = gameSelect.value;
  const count = parseInt(playerCount.value);
  playerForm.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const label = document.createElement("label");
    label.textContent = `Spieler ${i + 1}:`;
    const input = document.createElement("input");
    input.type = "text";
    input.required = true;
    input.name = `player${i}`;
    input.placeholder = `Name Spieler ${i + 1}`;
    playerForm.appendChild(label);
    playerForm.appendChild(input);
    playerForm.appendChild(document.createElement("br"));
  }
  document.getElementById("game-select").style.display = "none";
  playerSetup.style.display = "block";
});

beginGameBtn.addEventListener("click", () => {
  const inputs = playerForm.querySelectorAll("input");
  players = Array.from(inputs).map(input => ({
    name: input.value,
    score: 0,
    usedSymbols: new Set()
  }));
  playerSetup.style.display = "none";
  gameBoard.style.display = "block";
  currentGame.textContent = gameType;
  renderScoreboard();
});

function renderScoreboard() {
  scoreboard.innerHTML = "";
  const maxScore = Math.max(...players.map(p => p.score));

  players.forEach(player => {
    const container = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = `${player.name}: ${player.score} Punkte`;
    container.appendChild(name);

    if (player.score === maxScore && maxScore > 0) {
      container.style.backgroundColor = "lightgreen";
    }

    if (gameType === "wuerfelwurst") {
      wuerfelwurstSymbols.forEach(symbol => {
        const btn = document.createElement("button");
        btn.textContent = symbol;
        btn.disabled = player.usedSymbols.has(symbol);
        btn.style.backgroundColor = btn.disabled ? "gray" : "";
        btn.addEventListener("click", () => {
          if (player.usedSymbols.has(symbol)) return;
          const score = parseInt(prompt(`Punkte für ${symbol} bei ${player.name}?`));
          if (!isNaN(score)) {
            player.score += score;
            player.usedSymbols.add(symbol);
            renderScoreboard();
            checkGameEnd();
          }
        });
        container.appendChild(btn);
      });
    }

    scoreboard.appendChild(container);
  });
}

function checkGameEnd() {
  const allDone = players.every(p => p.usedSymbols.size === wuerfelwurstSymbols.length);
  if (allDone) {
    const result = [...players].sort((a, b) => b.score - a.score);
    let message = "Endstand:\n";
    result.forEach((p, i) => {
      message += `${i + 1}. ${p.name} (${p.score} Punkte)\n`;
    });
    alert(message);
  }
}

nextRoundBtn.addEventListener("click", () => {
  alert("Bei Würfelwurst gibt es keine klassischen Runden. Bitte nutze die Symbol-Buttons bei jedem Spieler.");
});
