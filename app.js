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

// Neuer Zurück-Button
const backBtn = document.createElement("button");
backBtn.textContent = "Zurück";
backBtn.addEventListener("click", () => {
  gameBoard.style.display = "none";
  document.getElementById("game-select").style.display = "block";
});
gameBoard.appendChild(backBtn);

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

    if (gameType === "Würfelwurst") {
      wuerfelwurstSymbols.forEach(symbol => {
        const btn = document.createElement("button");
        btn.disabled = player.usedSymbols.has(symbol);
        btn.style.backgroundColor = btn.disabled ? "gray" : "";
        btn.classList.add("symbol-button");

        if (symbol === "Wiesel" || symbol === "Wachtel") {
          const img = document.createElement("img");
          img.src = `icons/${symbol}.png`;
          img.alt = symbol;
          img.style.width = "40px";
          img.style.height = "40px";
          btn.appendChild(img);
        } else {
          btn.textContent = symbol;
        }

        btn.addEventListener("click", () => {
          if (player.usedSymbols.has(symbol)) return;
          const inputScore = prompt(`Punkte für ${symbol} bei ${player.name}? Nur Zahlen erlaubt.`);
          const score = parseInt(inputScore);
          if (!isNaN(score)) {
            player.score += score;
            player.usedSymbols.add(symbol);
            renderScoreboard();
            checkGameEnd();
          } else {
            alert("Bitte eine gültige Zahl eingeben.");
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

// Button "Nächste Runde" umbenannt zu "Neues Spiel"
nextRoundBtn.textContent = "Neues Spiel";
nextRoundBtn.addEventListener("click", () => {
  players.forEach(p => {
    p.score = 0;
    p.usedSymbols.clear();
  });
  renderScoreboard();
});
