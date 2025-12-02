// document.getElementById("email").addEventListener("click", function (event) {
//   event.preventDefault();
//   const email = "alnath165@gmail.com";
//   const spanCopy = document.getElementById("copy");
//   navigator.clipboard
//     .writeText(email)
//     .then(() => {
//       spanCopy.style.opacity = "1";
//       setTimeout(() => {
//         spanCopy.style.opacity = "0";
//       }, 3000);
//     })
//     .catch((error) => console.error("erro ao copiar e-mail: ", error));
// });

// function updateNavVisibility() {
//   let widthWindow = window.innerWidth;
//   const navTop = document.querySelector("#nav-top");
//   const footer = document.querySelector("#rodape");

//   if (!navTop || !footer) {
//     console.log("Elementos não encontrados no DOM");
//     return;
//   }

//   if (widthWindow <= 768) {
//     console.log("menor ou igual a 768px");
//     navTop.style.display = "none";
//     footer.style.display = "block";
//   } else {
//     navTop.style.display = "block";
//     footer.style.display = "none";
//   }
// }

// window.addEventListener("DOMContentLoaded", updateNavVisibility);
// window.addEventListener("resize", updateNavVisibility);

// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado — iniciando scripts');

  // tratar elemento(s) de e-mail (há duplicates no HTML)
  const emailEls = document.querySelectorAll('#email');
  if (emailEls.length === 0) {
    console.warn('Nenhum #email encontrado');
  } else {
    emailEls.forEach(el =>
      el.addEventListener('click', (event) => {
        event.preventDefault();
        const email = 'alnath165@gmail.com';
        const spansCopy = document.querySelectorAll('.copy');
        navigator.clipboard.writeText(email)
          .then(() => {
            if (spansCopy) {
              spansCopy.forEach(sp => { sp.style.opacity = '1';});
              setTimeout(() => { spansCopy.forEach(sp => { sp.style.opacity = '0';}) }, 3000);
            }
          })
          .catch((error) => console.error('erro ao copiar e-mail: ', error));
      })
    );
  }

  function updateNavVisibility() {
    try {
      const widthWindow = window.innerWidth;
      const navTop = document.querySelector('#nav-top');
      const footer = document.querySelector('#rodape');

      if (!navTop || !footer) {
        console.warn('nav-top ou rodape não encontrado no DOM');
        return;
      }

      console.log('updateNavVisibility — largura:', widthWindow);
      if (widthWindow <= 768) {
        navTop.style.display = 'none';
        footer.style.display = 'block';
      } else {
        navTop.style.display = 'block';
        footer.style.display = 'none';
      }
    } catch (err) {
      console.error('Erro em updateNavVisibility:', err);
    }
  }

  updateNavVisibility();
  window.addEventListener('resize', updateNavVisibility);
});
// ...existing code...