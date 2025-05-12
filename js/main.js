const container = document.getElementById('iii')


fetch("http://localhost:8000/api/services") // ID ni 1 qilib tekshirib ko'ring
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const cards = data.map((item, index) => {
      return `
                <div class="help-section_card">
                    <img src=${item.img_url} alt="doctor">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
        `;
    }).join("")

    container.innerHTML = cards;
  })
  .catch((error) => console.error("Xatolik:", error));
