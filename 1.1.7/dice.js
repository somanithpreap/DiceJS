(function () {
  const cash = document.getElementById("cash");
  const gold = document.getElementById("gold");
  const records = localStorage.getItem("records");

  if (localStorage.getItem("cash") && localStorage.getItem("gold")) {
    cash.innerHTML = localStorage.getItem("cash");
    gold.innerHTML = localStorage.getItem("gold");
  } else {
    localStorage.setItem("cash", "1000");
    localStorage.setItem("gold", "0");
    localStorage.setItem("gold", Math.floor(records / 10));

    cash.innerHTML = localStorage.getItem("cash");
    gold.innerHTML = localStorage.getItem("gold");
  }

  if (!localStorage.getItem("records")) {
    localStorage.setItem("records", "0");
  }
})();

function reset() {
  var cash = document.getElementById("cash");
  var gold = document.getElementById("gold");

  localStorage.setItem("records", "0");
  localStorage.setItem("cash", "1000");
  localStorage.setItem("gold", "0");
  cash.innerHTML = "1000";
  gold.innerHTML = "0";
}

function update() {
  var cash = document.getElementById("cash");
  var gold = document.getElementById("gold");
  const records = Number(localStorage.getItem("records"));

  localStorage.setItem("gold", Math.floor(records / 10).toString());

  cash.innerHTML = localStorage.getItem("cash");
  gold.innerHTML = localStorage.getItem("gold");
}

function addData(record, cash) {
  const currentRecords = Number(localStorage.getItem("records"));
  const currentCash = Number(localStorage.getItem("cash"));

  localStorage.setItem("records", (currentRecords + record).toString());
  localStorage.setItem("cash", (currentCash + cash).toString());
  update();
}

function roll() {
  const cash = Number(localStorage.getItem("cash"));
  const cashPlay = Number(document.getElementById("cashPlay").value);
  const mode = Number(document.getElementById("mode").value);

  const dice1 = document.getElementById("tblDice1");
  const dice2 = document.getElementById("tblDice2");
  const dice3 = document.getElementById("tblDice3");

  const dice1Play = document.getElementById("dice1").value;
  const dice2Play = document.getElementById("dice2").value;
  const dice3Play = document.getElementById("dice3").value;

  if (cashPlay > cash) alert("You don't have enough cash!");
  else if (cashPlay <= 0) alert("You cannot play with 0 or less dollars!");
  else {
    function rollDice() {
      return Math.ceil(Math.random() * 6).toString();
    }
    dice1.innerHTML = rollDice();
    dice2.innerHTML = rollDice();
    dice3.innerHTML = rollDice();
    console.log(`${dice1.innerHTML}, ${dice2.innerHTML}, ${dice3.innerHTML}`);

    if (
      dice1.innerHTML == dice1Play &&
      dice2.innerHTML == dice2Play &&
      dice3.innerHTML == dice3Play
    ) {
      addData(5, cashPlay * mode * 5);
      alert("You hit the jackpot!");
    } else if (
      dice1.innerHTML == dice1Play ||
      dice2.innerHTML == dice2Play ||
      dice3.innerHTML == dice3Play
    ) {
      if (dice1.innerHTML == dice1Play && dice2.innerHTML == dice2Play) {
        addData(3, cashPlay * mode * 3);
        alert("You win 3 advantages!");
      } else if (dice1.innerHTML == dice1Play && dice3.innerHTML == dice3Play) {
        addData(3, cashPlay * mode * 3);
        alert("You win 3 advantages!");
      } else if (dice2.innerHTML == dice2Play && dice3.innerHTML == dice3Play) {
        addData(3, cashPlay * mode * 3);
        alert("You win 3 advantages!");
      } else {
        addData(1, cashPlay * mode);
        alert("You win!");
      }
    } else {
      alert("You lose!");
      localStorage.setItem("cash", (cash - cashPlay).toString());
      update();
    }
  }
}

function preventFloats() {
  const exchangeGold = document.getElementById("exchange-gold");
  exchangeGold.addEventListener("keydown", (e) => {
    if (e.key === ".") e.preventDefault();
  });

  exchangeGold.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]*/g, "");
  });
}

function handlePopup() {
  // Create popup darken filter
  const filter = document.createElement("div");
  filter.style.width = "100%";
  filter.style.height = "100%";
  filter.style.zIndex = 3;
  filter.style.opacity = 0.4;
  filter.style.backgroundColor = "black";
  filter.style.position = "absolute";
  filter.style.top = 0;
  document.body.append(filter);
  console.log(
    "Filter created:" +
      filter.clientWidth +
      "px X " +
      filter.clientHeight +
      "px"
  );

  const modal = document.getElementById("exchange-modal");
  const closeBtn = document.getElementsByClassName("close")[0];
  const input = document.getElementById("exchange-gold");
  const exchangeBtn = document.getElementsByClassName("exchange-btn")[1];

  modal.style.display = "block";
  exchangeBtn.disabled = true;
  exchangeBtn.style.backgroundColor = "lightgray";

  // Add onclick to closeBtn of modal
  closeBtn.onclick = () => {
    modal.style.display = "none";
    filter.style.display = "none";
  };

  // Handle exchange
  exchangeBtn.onclick = () => {
    const currentRecords = Number(localStorage.getItem("records"));
    const currentCash = Number(localStorage.getItem("cash"));
    const goldToExchange = input.value;

    localStorage.setItem("records", currentRecords - goldToExchange * 10);
    update();
    localStorage.setItem("cash", currentCash + goldToExchange * 5000);
    update();
  };

  // Enable exchange button when input is more than one
  input.addEventListener("input", () => {
    const goldAmount = input.value;
    if (goldAmount >= 1) {
      const exchangedCash = document.getElementById("exchanged-cash");
      exchangedCash.innerHTML = goldAmount * 5000;

      if (goldAmount > localStorage.getItem("gold")) {
        exchangeBtn.disabled = true;
        exchangeBtn.style.backgroundColor = "lightgray";
      } else if (goldAmount <= localStorage.getItem("gold")) {
        exchangeBtn.disabled = false;
        exchangeBtn.style.backgroundColor = "chocolate";
      }
    } else {
      if (goldAmount > localStorage.getItem("gold")) {
        exchangeBtn.disabled = true;
        exchangeBtn.style.backgroundColor = "lightgray";
      }
    }
  });
}
