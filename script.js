const logo = document.getElementById("crazyLogo");
let isCrazy = false;
let dx = 5;
let dy = 5;
let interval;

logo.addEventListener("click", () => {
  if (!isCrazy) {
    logo.classList.add("crazy");
    isCrazy = true;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    interval = setInterval(() => {
      x += dx;
      y += dy;

      if (x <= 0 || x + logo.clientWidth >= window.innerWidth) dx *= -1;
      if (y <= 0 || y + logo.clientHeight >= window.innerHeight) dy *= -1;

      logo.style.left = x + "px";
      logo.style.top = y + "px";
    }, 15);

  } else {
    clearInterval(interval);
    logo.classList.remove("crazy");
    logo.style = "";
    isCrazy = false;
  }
});