// Search button functionality
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");


searchBtn.addEventListener("click", function () {
	alert("You searched for: " + searchInput.value);
});