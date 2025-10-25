let allDishes = []; // store all dishes globally

// Fetch menu data
fetch("data/data.json")
  .then(response => {
    if (!response.ok) throw new Error("Unable to load menu data.");
    return response.json();
  })
  .then(data => {
    allDishes = data.dishes; // store dishes for search
    displayMenu(allDishes);
  })
  .catch(error => {
    document.getElementById("menu-body").innerHTML = `
      <tr><td colspan="7" style="text-align:center;">${error.message}</td></tr>
    `;
  });

// Function to display dishes in the table
function displayMenu(dishes) {
  const menuBody = document.getElementById("menu-body");
  menuBody.innerHTML = "";

  if (dishes.length === 0) {
    menuBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:gray;">No dishes found</td></tr>`;
    return;
  }

  dishes.forEach(dish => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${dish.image_url}" alt="${dish.name}"></td>
      <td class="name">${dish.name}</td>
      <td>${dish.description}</td>
      <td>${dish.category}</td>
      <td>${dish.cuisine}</td>
      <td>${dish.ingredients.join(", ")}</td>
      <td class="price">$${dish.price.toFixed(2)}</td>
    `;
    menuBody.appendChild(row);
  });
}

// 🔍 Search button functionality
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search").value.toLowerCase();

  const filtered = allDishes.filter(dish => {
    return (
      dish.name.toLowerCase().includes(query) ||
      dish.cuisine.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.ingredients.join(", ").toLowerCase().includes(query)
    );
  });

  displayMenu(filtered);
});
