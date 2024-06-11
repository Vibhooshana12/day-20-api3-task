document.addEventListener("DOMContentLoaded", function() {
    var breedSelect = document.getElementById("breed-select");
    var search = document.getElementById("search");
    var breedDetailsDiv = document.getElementById("breed-details");

    // to fetch dog breeds data and populate the dropdown select menu
    fetch("https://api.thedogapi.com/v1/breeds")
        .then(response => response.json())
        .then(data => {
            data.forEach(breed => {
                var option = document.createElement("option");
                option.value = breed.name;
                option.text = breed.name;
                breedSelect.append(option);
            });
        })
        .catch(error => console.error("Error fetching dog breeds:", error));

    search.addEventListener("click", function() {
        var selectedBreed = breedSelect.value;
        displayBreedDetails(selectedBreed);
    });

    async function displayBreedDetails(breedName) {
        breedDetailsDiv.innerHTML = ""; // To Clear the previous details
        try {
            var response = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${breedName}`);
            var breeds = await response.json();
            var breed = breeds[0]; // Since we're searching for a specific breed, we'll take the first result

            if (breed) {
                var breedCard = document.createElement("div");
                breedCard.className = "card bg-dark";
                breedCard.style.width = "20rem";
                breedCard.innerHTML = `
                <div class="card-header text-center text-white">${breed.name}</div>
                 <img class="card-img-top" id="breedImage" alt="${breed.name} image">
                    <div class="card-body">
                        <h5 class="card-title text-white">Breed Name:${breed.name}</h5>
                        <p class="card-text text-white"><b>Breed Group:</b> ${breed.breed_group}</p>
                        <p class="card-text text-white"><b>Life Span:</b> ${breed.life_span}</p>
                        <p class="card-text text-white"><b>Temperament:</b> ${breed.temperament}</p>
                        <p class="card-text text-white"><b>Origin:</b> ${breed.origin || 'Unknown'}</p>
                    </div>
                `;
                breedDetailsDiv.append(breedCard);

                var breedImage = document.getElementById("breedImage");
                fetch(`https://api.thedogapi.com/v1/images/${breed.reference_image_id}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.url) {
                            breedImage.src = data.url;
                        } else {
                            breedImage.src = "placeholder.jpg"; // to replace with a placeholder image URL
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching breed image:", error);
                        breedImage.src = "placeholder.jpg"; // to Replace with a placeholder image URL
                    });

            } else {
                breedDetailsDiv.innerHTML = `<p class="text-dark">Breed not found. Please try another breed name.</p>`;
            }
        } catch (error) {
            console.log(error);
            breedDetailsDiv.innerHTML = `<p class="text-dark">An error occurred while fetching breed details. Please try again later.</p>`;
        }
    }
});