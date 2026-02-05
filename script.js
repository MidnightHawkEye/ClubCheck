let guestCount = Number(localStorage.getItem("guestCount")) || 0;
const MAX_GUESTS = 1;
let totalRevenue = Number(localStorage.getItem("totalRevenue")) || 0;
const ticketPrice = 20;
guestCount >= MAX_GUESTS
const OPEN_HOUR = 4;
const CLOSE_HOUR = 13;
let waitingList = JSON.parse(localStorage.getItem("waitingList")) || [];




function updateClubStatus() {
  const status = document.getElementById("clubStatus");

  if (guestCount >= MAX_GUESTS) {
    status.innerText = "🚫 CLUB IS FULL";
  } else {
    status.innerText = "🟢 Club Open";
  }
}

document.getElementById("revenue").innerText = totalRevenue;

function updateGuestDisplay() {
    document.getElementById("guestDisplay").innerText =
        `👥 Guests inside: ${guestCount}`;
}

function checkAge() {
    const name = document.getElementById("name").value;
    const age = Number(document.getElementById("age").value);
    const output = document.getElementById("output");
    let isAllowed = false;

    if (guestCount >= MAX_GUESTS) {
        waitingList.push(name);
        updateWaitingList();

        document.getElementById("output").innerText =
        `🚫 Club is full. ${name} added to waiting list.`;
        return;
    }


    if (!isClubOpen()) {
        document.getElementById("output").innerText =
        "⏰ Club is closed. Entry allowed from 21:00 to 03:00.";
        return;
    }

    if (guestCount >= MAX_GUESTS) {
        output.innerText = "🚫 Club is full. Please wait.";
        return;
    }

    if (!name) {
        output.innerText = "❌ Please enter your name.";
        return;
    }

    if (isNaN(age) || age <= 0) {
        output.innerText = "❌ Please enter a valid age.";
        return;
    }

    if (age <= 18) {
        output.innerText = `🚫 Sorry ${name}, entry is allowed from 18+.`;
    } else {
        output.innerText = `✅ Welcome ${name}! You are old enough to enter.`;
        document.getElementById("cashSection").style.display = "block";
        isAllowed = true;
    }
}

function checkCash() {
    const cashInput = Number(document.getElementById("cash").value);
    const output = document.getElementById("output");
    const ENTRY_FEE = 20;
    let isAllowed = true;

    if (!isAllowed) {
        output.innerText = "🚫 You must pass the age check first.";
        return;
    }

    if (isNaN(cashInput) || cashInput < 0) {
        output.innerText += "\n❌ Please enter a valid cash amount.";
        return;
    }

    // Check if user can afford entry
    if (cashInput < ENTRY_FEE) {
        output.innerText += `\n🚫 Entry costs $${ENTRY_FEE}. You don't have enough cash.`;
        return;
    }

    // Subtract entry fee
    const remainingCash = cashInput - ENTRY_FEE;

    output.innerText += `\n🎟️ Entry fee: $${ENTRY_FEE} paid.`;
    output.innerText += `\n💵 Remaining cash: $${remainingCash}`;

    guestCount++;
    localStorage.setItem("guestCount", guestCount);
    updateGuestDisplay();
    output.innerText += `\n👥 Total guests inside: ${guestCount}`;
    updateClubStatus();
    updateLeaveButton();

    



    // Evaluate remaining cash
    if (remainingCash === 0) {
        output.innerText += "\n😬 No money left for drinks...";
    } else if (remainingCash < 20) {
        output.innerText += "\n🍺 Enough for maybe one drink.";
        totalRevenue += ticketPrice;
        document.getElementById("revenue").innerText = totalRevenue;
        localStorage.setItem("totalRevenue", totalRevenue);
    } else if (remainingCash < 50) {
        output.innerText += "\n🍹 Solid amount, a few drinks are possible!";
        totalRevenue += ticketPrice;
        document.getElementById("revenue").innerText = totalRevenue;
        localStorage.setItem("totalRevenue", totalRevenue);
    } else {
        output.innerText += "\n🔥 VIP vibes! Looks like a great night!";
        totalRevenue += ticketPrice;
        document.getElementById("revenue").innerText = totalRevenue;
        localStorage.setItem("totalRevenue", totalRevenue);
    }

    document.getElementById("cashButton").disabled = true;
}

function resetForm() {
    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("cash").value = "";

    // Clear output text
    document.getElementById("output").innerText = "";

    // Hide cash section again
    document.getElementById("cashSection").style.display = "none";

    document.getElementById("cashButton").disabled = false;
    
    isAllowed = false;
}

function resetAll() {
  guestCount = 0;
  totalRevenue = 0;

  localStorage.setItem("guestCount", 0);
  localStorage.setItem("totalRevenue", 0);

  document.getElementById("guestDisplay").innerText = guestCount;
  document.getElementById("revenue").innerText = totalRevenue;
  document.getElementById("output").innerText = "";

  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("cash").value = "";

  document.getElementById("cashButton").disabled = false;
  document.getElementById("cashSection").style.display = "none";

  updateClubStatus();
  updateLeaveButton();
}

function guestLeavesClub() {
  if (guestCount <= 0) {
    return; 
  }

   if (waitingList.length > 0) {
        const nextGuest = waitingList.shift();
        guestCount++;

        document.getElementById("output").innerText =
        `✅ ${nextGuest} entered from waiting list.`;

        localStorage.setItem("guestCount", guestCount);
        updateWaitingList();
   }

    guestCount--;
    localStorage.setItem("guestCount", guestCount);
    document.getElementById("guestDisplay").innerText = guestCount
    document.getElementById("output").innerText = "👋 A guest has left the club.";

  updateClubStatus();
  updateLeaveButton();
}

function updateClubStatus() {
  const status = document.getElementById("clubStatus");
  const light = document.getElementById("warningLight");

  if (!isClubOpen()) {
    status.innerText = "⏰ Club closed";
    light.style.display = "none";
    return;
  }

  if (guestCount >= MAX_GUESTS) {
    status.innerText = "🚫 CLUB IS FULL";
    light.style.display = "block";
    light.classList.add("blinking");
  } else {
    status.innerText = "🟢 Club Open";
    light.style.display = "none";
    light.classList.remove("blinking");
  }
}

function updateLeaveButton() {
  const leaveBtn = document.getElementById("leaveButton");

  if (!leaveBtn) return;

  leaveBtn.disabled = guestCount === 0;
 
}

function isClubOpen() {
  const now = new Date();
  const hour = now.getHours();

  return hour >= OPEN_HOUR || hour < CLOSE_HOUR;
}

function updateWaitingList() {
  const list = document.getElementById("waitingList");
  list.innerHTML = "";

  waitingList.forEach(name => {
    const li = document.createElement("li");
    li.innerText = name;
    list.appendChild(li);
  });

  localStorage.setItem("waitingList", JSON.stringify(waitingList));
}


updateGuestDisplay();
updateClubStatus();
updateLeaveButton();
updateClubStatus();
updateWaitingList();

