// const searchForm = document.getElementById("searchForm");
// const searchInput = document.getElementById("searchInput");
// const issuesContainer = document.getElementById("issue-container");

// searchForm.addEventListener("submit", function (e) {
//     e.preventDefault(); 

//     const searchText = searchInput.value.trim();

//    let filterData =[]

//     fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=" + encodeURIComponent(searchText))
//         .then(res => res.json())
//         .then(data => {
//             // issuesContainer.innerHTML = ""; 

           
//             console.log(data.data);
//             console.log(searchText);
//               displayIssues(data.data); 
            
            
//             // filterData = data.data.map(issue => {
//             //     if(issue.priority && issue.priority.toLowerCase() === "low"){
//             //         issue.status = "closed";
//             //     } 
//             //     else if(issue.priority && issue.priority.toLowerCase() === "medium"){
//             //         issue.status = "open";
//             //     }
//             //     return issue;
//             // });
//             // console.log(filteredIssues);
            
           
//         })
//         .catch(error => {
//             console.log(error);
//             issuesContainer.innerHTML = '<p class="text-center text-red-500 col-span-4">Error loading issues</p>';
//         });
//         console.log(filterData);
        
       
// });