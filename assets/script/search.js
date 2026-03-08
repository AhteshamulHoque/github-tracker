const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const issuesContainer = document.getElementById("issue-container");

searchForm.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const searchText = searchInput.value.trim();

    issuesContainer.innerHTML = `
        <div class="text-center col-span-4 py-4">
            <i class="fas fa-spinner fa-spin text-gray-500"></i> Loading...
        </div>
    `;

    if (searchText === "") {
        loadIssues(); 
        return;
    }

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=" + searchText)
        .then(function(res){
            return res.json();
        })
        .then(function(data){
            issuesContainer.innerHTML = ""; 

            if (!data.data || data.data.length === 0) {
                issuesContainer.innerHTML =
                '<p class="text-center text-gray-500 col-span-4">No issues found</p>';
                return;
            }

            data.data.forEach(function(issue){
                if(issue.priority && issue.priority.toLowerCase() === "low"){
                    issue.status = "closed";
                } 
                else if(issue.priority && issue.priority.toLowerCase() === "medium"){
                    issue.status = "open";
                }

                loadIssueDetails(issue.id, issue.status);
            });

        })
        .catch(function(error){
            console.log(error);
            issuesContainer.innerHTML = '<p class="text-center text-red-500 col-span-4">Error loading issues</p>';
        });
});