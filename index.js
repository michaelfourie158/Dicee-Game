const PIPS = { 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };
const dice = [...document.querySelectorAll(".die")];
const title = document.getElementById("result");
const rollBtn = document.getElementById("roll");
const $ = (id) => document.getElementById(id);
let s = { w1:0, w2:0, draws:0, rounds:0 };
try { s = { ...s, ...JSON.parse(localStorage.getItem("dice.v2")) }; } catch (e) {}

dice.forEach((d) => { for (let i = 0; i < 9; i++) d.appendChild(document.createElement("i")); });
const show = (die, v) => { die.dataset.v = v; die.querySelectorAll("i").forEach((p, i) => p.classList.toggle("on", PIPS[v].includes(i))); };
const rnd = () => Math.floor(Math.random() * 6) + 1;
const paint = () => { $("w1").textContent = s.w1; $("w2").textContent = s.w2; $("draws").textContent = s.draws; $("rounds").textContent = s.rounds; };
const save = () => { try { localStorage.setItem("dice.v2", JSON.stringify(s)); } catch (e) {} };

function roll() {
  if (rollBtn.disabled) return;
  rollBtn.disabled = true;
  document.querySelectorAll(".player").forEach((p) => p.classList.remove("win"));
  title.className = ""; title.textContent = "Rolling…";
  dice.forEach((d) => d.classList.add("rolling"));
  const t = setInterval(() => dice.forEach((d) => show(d, rnd())), 90);
  setTimeout(() => {
    clearInterval(t);
    const a = rnd(), b = rnd();
    show(dice[0], a); show(dice[1], b);
    dice.forEach((d) => d.classList.remove("rolling"));
    s.rounds++;
    if (a > b) { s.w1++; title.textContent = "🚩 Player 1 Wins!"; $("p1").classList.add("win"); title.className = "win"; }
    else if (b > a) { s.w2++; title.textContent = "Player 2 Wins! 🚩"; $("p2").classList.add("win"); title.className = "win"; }
    else { s.draws++; title.textContent = "Draw!"; }
    paint(); save(); rollBtn.disabled = false;
  }, 900);
}

rollBtn.addEventListener("click", roll);
document.addEventListener("keydown", (e) => { if (e.code === "Space" && e.target === document.body) { e.preventDefault(); roll(); } });
$("reset").addEventListener("click", () => { s = { w1:0, w2:0, draws:0, rounds:0 }; save(); paint(); title.className = ""; title.textContent = "Roll to decide"; });
show(dice[0], 3); show(dice[1], 4); paint();
