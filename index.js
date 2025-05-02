document.getElementById("email").addEventListener("click", function (event) {
    event.preventDefault();
    const email = "alnath165@gmail.com";
    const spanCopy = document.getElementById("copy");
    navigator.clipboard.writeText(email).then(() => {
        spanCopy.style.opacity = '1';
        setTimeout(() => {
            spanCopy.style.opacity = '0';
        }, 3000)
    }).catch((error) => console.error("erro ao copiar e-mail: ", error));
});