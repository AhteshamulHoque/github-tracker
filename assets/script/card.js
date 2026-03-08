




const loadIssues = () => {
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {

      // Issue data cache for filtering
      window.allIssues = data.data.map(issue => {
        if(issue.priority?.toLowerCase() === "low") {
          issue.status = "closed";
        } else if(issue.priority?.toLowerCase() === "medium") {
          issue.status = "open";
        }
        return issue;
      });

      displayIssues(window.allIssues);
    });
};

const loadIssueDetails = (id, forcedStatus) => {
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(res => res.json())
    .then(data => {
      removeActive();
      const issueData = data.data;
      if(forcedStatus) issueData.status = forcedStatus;
      displayIssue(issueData);
    });
};



const displayIssues = (issues) => {
  const container = document.getElementById("issue-container");
  container.innerHTML = "";
  issues.forEach(issue => displayIssue(issue));
};



const displayIssue = (issue) => {
  const container = document.getElementById("issue-container");
  const div = document.createElement("div");

  const statusLower = issue.status?.toLowerCase();

  const dateString = issue.created_at || issue.createdAt || issue.date || null;
  const formattedDate = dateString ? new Date(dateString).toLocaleDateString() : "No date";

  div.innerHTML = `
    <div class="max-w-xs w-full h-80 bg-white rounded-xl shadow-sm overflow-hidden mb-4 ${statusLower === "closed" ? "border-t-4 border-purple-500" : "border-t-4 border-green-500"}">
      <div class="p-5 flex flex-col justify-between h-full">
        
        <div>
          <div class="flex justify-between items-center mb-4">
            <div class="w-8 h-8 rounded-full ${statusLower === "closed" ? "bg-purple-100" : "bg-green-100"} flex items-center justify-center">
              <img src="${statusLower === "closed" ? './Closed- Status .png' : './Open-Status.png'}" alt="" class="w-5 h-5">
            </div>

            <span class="bg-red-50 font-bold px-4 py-2 rounded-full ${
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
            ${issue.description ? issue.description.slice(0,80) + "..." : "No description"}
          </p>

          <div class="flex gap-2 flex-wrap">
            ${Array.isArray(issue.labels) ? issue.labels.map(label => {

              if(label.toLowerCase() === "bug"){
                return `<span class="inline-flex items-center gap-1 bg-red-50 text-[#EF4444] text-xs font-bold px-3 py-1.5 rounded-full border border-red-100">
                  <i class="fa-solid fa-bug"></i> ${label}
                </span>`
              }

              if(label.toLowerCase() === "help wanted"){
                return `<span class="inline-flex items-center gap-1 bg-yellow-50 text-[#D97706] text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-100">
                  <i class="fa-regular fa-life-ring"></i> ${label}
                </span>`
              }

              if(label.toLowerCase() === "enhancement"){
                return `<span class="inline-flex items-center gap-1 bg-green-50 text-[#00A96E] text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> ${label}
                </span>`
              }

            
              if(label.toLowerCase() === "documentation"){
                return `<span class="inline-flex items-center gap-1 bg-green-50 text-[#00A96E] text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                  <i class="fa-brands fa-readme"></i> ${label}
                </span>`
              }

              return `<span class="inline-flex items-center bg-yellow-50 text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-100">
                ${label}
              </span>`

            }).join("") : ""}
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

const issueCountElement = document.querySelector("h2.font-semibold"); 

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.textContent.toLowerCase();
    let filteredIssues;

    if(filter === "all") {
      filteredIssues = window.allIssues;
    } else {
      filteredIssues = window.allIssues.filter(issue => issue.status?.toLowerCase() === filter);
    }

    displayIssues(filteredIssues);

    document.querySelectorAll(".btn").forEach(b => b.classList.remove("btn-active"));
    btn.classList.add("btn-active");

    issueCountElement.textContent = `${filteredIssues.length} Issues`;
  });
});

loadIssues();

const openModal = (issue) => {
    const modal = document.getElementById('issue-modal');
    const content = document.getElementById('modal-content');
    
    const dateString = issue.created_at || issue.createdAt || issue.date || null;
    const formattedDate = dateString ? new Date(dateString).toLocaleDateString('en-GB') : "";

    content.innerHTML = `
        <h1 class="text-4xl font-bold text-[#1E293B] mb-4">${issue.title || "Fix broken image uploads"}</h1>
        
        <div class="flex items-center gap-3 mb-8">
            <span class="bg-[#00BA88] text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                <span class="w-2 h-2 bg-white rounded-full"></span> Opened
            </span>
            <p class="text-slate-500 font-medium">
                Opened by <span class="text-slate-700 font-bold">${issue.author || 'Fahim Ahmed'}</span> • ${formattedDate}
            </p>
        </div>

        <div class="flex gap-3 mb-10">
            <span class="flex items-center gap-1 bg-red-50 text-[#EF4444] text-xs font-bold px-4 py-2 rounded-full border border-red-100 uppercase tracking-wider">
                <i class="fa-solid fa-bug"></i> BUG
            </span>
            <span class="flex items-center gap-1 bg-yellow-50 text-[#D97706] text-xs font-bold px-4 py-2 rounded-full border border-yellow-100 uppercase tracking-wider">
                <i class="fa-regular fa-life-ring"></i> HELP WANTED
            </span>
        </div>

        <p class="text-slate-500 text-xl leading-relaxed mb-12">
            ${issue.description || ""}
        </p>

        <div class="bg-slate-50/80 rounded-2xl p-8 grid grid-cols-2 gap-8">
            <div>
                <p class="text-slate-400 text-sm font-bold uppercase mb-2 tracking-widest">Assignee:</p>
                <p class="text-slate-800 text-xl font-bold">${issue.author || ''}</p>
            </div>
            <div>
                <p class="text-slate-400 text-sm font-bold uppercase mb-2 tracking-widest">Priority:</p>
                <span class="bg-[#F84C4C] text-white px-6 py-1.5 rounded-full font-black text-sm uppercase tracking-tighter">
                    ${issue.priority || ''}
                </span>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
};

const closeModal = () => {
    document.getElementById('issue-modal').classList.add('hidden');
    document.body.style.overflow = 'auto'; 
};


document.getElementById("issue-container").addEventListener("click", (e) => {
    const card = e.target.closest('.max-w-xs'); 
    if (card) {
        const idText = card.querySelector('.text-slate-500.text-sm.mb-1').innerText;
        const id = idText.split(' ')[0].replace('#', '').trim();
        
        const issue = window.allIssues.find(i => String(i.id) === id);
        if(issue) openModal(issue);
    }
});