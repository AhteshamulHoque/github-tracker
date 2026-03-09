const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const issuesContainer = document.getElementById("issue-container");
const issueCountElement = document.querySelector("h2.font-semibold");

let allIssues = [];

// LOAD ALL ISSUES
const loadIssues = async () => {
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();

  allIssues = data.data.map((issue) => {
    if (issue.priority?.toLowerCase() === "low") {
      issue.status = "closed";
    } else if (issue.priority?.toLowerCase() === "medium") {
      issue.status = "open";
    }

    return issue;
  });

  displayIssues(allIssues);
};

// DISPLAY MULTIPLE ISSUES
const displayIssues = (issues) => {
  issuesContainer.innerHTML = "";

  issues.forEach((issue) => {
    displayIssue(issue);
  });

  issueCountElement.textContent = `${issues.length} Issues`;
};

// DISPLAY SINGLE ISSUE CARD
const displayIssue = (issue) => {
  const div = document.createElement("div");

  const statusLower = issue.status?.toLowerCase();

  const dateString = issue.created_at || issue.createdAt || issue.date || null;

  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString()
    : "No date";

  div.innerHTML = `

  <div class="max-w-xs w-full h-80 bg-white rounded-xl shadow-sm overflow-hidden mb-4 
  ${statusLower === "closed" ? "border-t-4 border-purple-500" : "border-t-4 border-green-500"}">

  <div class="p-5 flex flex-col justify-between h-full">

  <div>

  <div class="flex justify-between items-center mb-4">

  <div class="w-8 h-8 rounded-full 
  ${statusLower === "closed" ? "bg-purple-100" : "bg-green-100"} 
  flex items-center justify-center">

  <img src="${
    statusLower === "closed"
      ? "./assets/Closed- Status .png"
      : "./assets/Open-Status.png"
  }" class="w-5 h-5">

  </div>

  <span class="bg-red-50 font-bold px-4 py-2 rounded-full 
  ${
    issue.priority?.toLowerCase() === "medium"
      ? "text-[#F59E0B]"
      : issue.priority?.toLowerCase() === "low"
        ? "text-[#9CA3AF]"
        : "text-red-400"
  }">

  ${issue.priority || "N/A"}

  </span>

  </div>

  <h3 class="text-slate-800 font-bold text-lg mb-2">
  ${issue.title || "No title"}
  </h3>

  <p class="text-slate-500 text-sm mb-5">
  ${issue.description ? issue.description.slice(0, 80) + "..." : "No description"}
  </p>

  <div class="flex gap-2 flex-wrap">

  ${
    Array.isArray(issue.labels)
      ? issue.labels
          .map((label) => {
            if (label.toLowerCase() === "bug") {
              return `<span class="bg-red-50 text-[#EF4444] text-xs font-bold px-3 py-1.5 rounded-full">
         ${label}</span>`;
            }

            if (label.toLowerCase() === "help wanted") {
              return `<span class="bg-yellow-50 text-[#D97706] text-xs font-bold px-3 py-1.5 rounded-full">
         ${label}</span>`;
            }

            if (label.toLowerCase() === "enhancement") {
              return `<span class="bg-green-50 text-[#00A96E] text-xs font-bold px-3 py-1.5 rounded-full">
        ${label}</span>`;
            }

            return `<span class="bg-yellow-50 text-xs font-bold px-3 py-1.5 rounded-full">
      ${label}</span>`;
          })
          .join("")
      : ""
  }

  </div>

  </div>

  <div class="bg-slate-50 border-t p-5 pt-4">

  <p class="text-slate-500 text-sm mb-1">
  #${issue.id || "N/A"} by ${issue.author || "Unknown"}
  </p>

  <p class="text-slate-400 text-sm">
  ${formattedDate}
  </p>

  </div>

  </div>
  </div>
  `;

  issuesContainer.appendChild(div);
};

// SEARCH
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchText = searchInput.value.trim();

  if (!searchText) {
    displayIssues(allIssues);
    return;
  }

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=" +
      encodeURIComponent(searchText),
  );

  const data = await res.json();

  displayIssues(data.data);
});

// FILTER BUTTONS
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.textContent.toLowerCase();

    let filteredIssues;

    if (filter === "all") {
      filteredIssues = allIssues;
    } else {
      filteredIssues = allIssues.filter(
        (issue) => issue.status?.toLowerCase() === filter,
      );
    }

    displayIssues(filteredIssues);

    document
      .querySelectorAll(".btn")
      .forEach((b) => b.classList.remove("btn-active"));

    btn.classList.add("btn-active");
  });
});

// MODAL OPEN
const openModal = (issue) => {
  const modal = document.getElementById("issue-modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
  <h1 class="text-3xl font-bold mb-4">${issue.title}</h1>
  <p class="mb-6">${issue.description}</p>
  <p class="text-sm text-gray-500">
  Author: ${issue.author}
  </p>
  `;

  modal.classList.remove("hidden");

  document.body.style.overflow = "hidden";
};

// MODAL CLOSE
const closeModal = () => {
  document.getElementById("issue-modal").classList.add("hidden");

  document.body.style.overflow = "auto";
};

// CARD CLICK
issuesContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".max-w-xs");

  if (!card) return;

  const idText = card.querySelector(".text-slate-500").innerText;

  const id = idText.split(" ")[0].replace("#", "");

  const issue = allIssues.find((i) => String(i.id) === id);

  if (issue) {
    openModal(issue);
  }
});

// INITIAL LOAD
loadIssues();
