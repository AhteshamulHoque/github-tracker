// Load all issues
const loadIssues = () => {
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
      data.data.forEach(issue => {
        // Low priority automatically closed, medium forced open
        if(issue.priority?.toLowerCase() === "low") {
          issue.status = "closed";
        } else if(issue.priority?.toLowerCase() === "medium") {
          issue.status = "open";
        }
        loadIssueDetails(issue.id, issue.status);
      });
    });
};

// Load individual issue details
const loadIssueDetails = (id, forcedStatus) => {
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(res => res.json())
    .then(data => {
      const issueData = data.data;
      if(forcedStatus) issueData.status = forcedStatus;
      displayIssue(issueData);
    });
};

// Display issue card
const displayIssue = (issue) => {
  const container = document.getElementById("issue-container");
  const div = document.createElement("div");

  const statusLower = issue.status?.toLowerCase();

  // Null-safe date
  const dateString = issue.created_at || issue.createdAt || issue.date || null;
  const formattedDate = dateString ? new Date(dateString).toLocaleDateString() : "No date";

  div.innerHTML = `
    <div class="max-w-xs w-full h-80 bg-white rounded-xl shadow-sm overflow-hidden mb-4 ${statusLower === "closed" ? "border-t-4 border-purple-500" : "border-t-4 border-green-500"}">
      <div class="p-5 flex flex-col justify-between h-full">
        
        <div>
          <div class="flex justify-between items-center mb-4">
            <div class="w-8 h-8 rounded-full ${statusLower === "closed" ? "bg-purple-100" : "bg-green-100"} flex items-center justify-center">
              <img src="${statusLower === "closed" ? 'Closed-Status.png' : 'Open-Status.png'}" alt="" class="w-5 h-5">
            </div>
            <span class="bg-red-50 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              ${issue.priority || "N/A"}
            </span>
          </div>

          <h3 class="text-slate-800 font-bold text-lg leading-tight mb-2">
            ${issue.title || "No title"}
          </h3>

          <p class="text-slate-500 text-sm leading-relaxed mb-5">
            ${issue.description ? issue.description.slice(0,80) + "..." : "No description"}
          </p>

          <div class="flex gap-2 flex-wrap">
            ${Array.isArray(issue.labels) ? issue.labels.map(label =>
              `<span class="inline-flex items-center bg-yellow-50 text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-100">
                ${label}
              </span>`).join("") : ""}
          </div>
        </div>

        <div class="bg-slate-50/50 border-t border-gray-100 p-5 pt-4">
          <p class="text-slate-500 text-sm mb-1">
            #${issue.id || "N/A"} by <span class="hover:underline cursor-pointer">${issue.author || "Unknown"}</span>
          </p>
          <p class="text-slate-400 text-sm">
            ${formattedDate}
          </p>
        </div>

      </div>
    </div>
  `;

  container.appendChild(div);
};

// Start
loadIssues();