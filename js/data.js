document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btnl");
  btn.addEventListener("click", function () {
    const fname = document.getElementById("name").value;
    const fphone = document.getElementById("phone").value;
    const femail = document.getElementById("email").value;
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("error-message");
    const phoneValue = fphone;
    const emailValue = femail;

    const phoneRegex = /^\+998\d{9}$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isValid = true;

    // Telefon raqami to'g'riligini tekshirish
    if (!phoneRegex.test(phoneValue)) {
      isValid = false;
    }

    // Email to'g'riligini tekshirish
    if (!emailRegex.test(emailValue)) {
      isValid = false;
    }

    if (!isValid) {
      errorMessage.style.display = "block";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 2000);
    } else {
      const data = {
        name: fname,
        phone: fphone,
        email: femail,
      };

      fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          successMessage.style.display = "block";
          setTimeout(function () {
            message.style.display = "none";
          }, 1000);
          setTimeout(function () {
            modal.style.display = "none";
            location.reload();
          }, 2000);
        });
    }
  });
});

const cost = document.getElementById("costs");

fetch("http://localhost:8000/api/costs")
  .then((res) => res.json())
  .then((data) => {
    const cards = data
      .map((item, index) => {
        return `
               <div class="card-section_card">
                <div class="text-1">
                    <h3>Premium xizmat</h3>
                    <img src="/assets/icons/Icon.svg" alt="medicine">
                    <p>${item.amount} ming</p>
                </div>
                <div class="text-2">
                    <p>Shifokorlarimiz sizning uy hayvoningizga eng yaxshi shifokorlik xizmatini ta’minlaydi.</p>
                    <button>Hozir Xizmatni Buyurish</button>
                </div>
            </div>
        `;
      })
      .join("");

    cost.innerHTML = cards;
  });
