const API_KEY = import.meta.env.VITE_NASA_API_KEY;

function getLocalDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const today = getLocalDateString();
document.querySelector("#datepicker").value = today;

function loadAPOD(date) {
  document.querySelector("#app").innerHTML = "<p>loading...</p>";

  const url = date
    ? `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
    : `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let media;
      if (data.media_type === "image") {
        media = `<img src="${data.url}"/>`;
      } else if (data.media_type === data.url.includes("youtube")) {
        media = `<iframe src="${data.url}" controls></iframe>`;
      } else {
        media = `<video src="${data.url}" controls></video>`;
      }

      document.querySelector("#app").innerHTML = `
        <h1 class = "animation">${data.title}</h1>
        ${media}
        <p>${data.explanation}</p>
      `;
    })
    .catch(err => {
      document.querySelector("#app").innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

loadAPOD(); // load today's picture initially

document.querySelector("#datepicker").addEventListener("change", (e) => {
  loadAPOD(e.target.value);
});