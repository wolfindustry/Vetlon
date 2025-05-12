document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const orderForm = document.getElementById("orderForm");

  openModal.addEventListener("click", () => (modal.style.display = "flex"));
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

const btn = document.getElementById("button");
btn.addEventListener("click", function () {
  const fname = document.getElementById("name").value;
  const desc = document.getElementById("desc").value;
  const url = document.getElementById("url").value;


  function showAlert(message) {
    const alert = document.getElementById("alert");
    alert.textContent = message;
    alert.classList.remove("hidden");

    setTimeout(() => {
      alert.classList.add("hidden");
    }, 2000); // 2000ms = 2 sekund
  }


  const data = {
    name: fname,
    description: desc,
    img_url: url,
  };

  // 1. POST so‘rovi
  fetch("http://localhost:8000/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      showAlert('Xizmat muvaffaqiyatli qoshildi')
      console.log("malumot yuborildi");
    });
});

const btn1 = document.getElementById("button1")
btn1.addEventListener('click', function () {
    const id = document.getElementById("id").value
    const amount = document.getElementById("amount").value

    dat = {
      id : id,
      amount : amount
    }

    
  function showAlert(message) {
    const alert = document.getElementById("alert1");
    alert.textContent = message;
    alert.classList.remove("hidden");

    setTimeout(() => {
      alert.classList.add("hidden");
      location.reload()
    }, 2000); // 2000ms = 2 sekund
  }

  fetch("http://localhost:8000/api/costs/update", {
    method: "POST",
    headers : {
      "Content-type" : "application/json"
    },
    body : JSON.stringify(dat)
  }).then((res) => res.json()) 
  .then((data) => showAlert('Narx yangilandi'))
})