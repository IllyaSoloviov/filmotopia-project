// додає Footer і Header на сторінки
document.addEventListener("DOMContentLoaded", () => {

    activeLinkFunction();
    setTimeout(modalAuthorization, 50);
});
// стилізує активну вкладку в header
function activeLinkFunction() {
    const links = document.querySelectorAll('header ul li a');
    let currentPage = window.location.pathname.split("/").pop().toLowerCase();

    if (currentPage === "" || currentPage === "/") {
        currentPage = "index.html";
    }

    links.forEach(link => {
        const hrefPage = link.getAttribute("href").split("/").pop().toLowerCase();
        if (hrefPage === currentPage) {
            setTimeout(() => {
                link.classList.add("activeHref");
            }, 50);
        }
    });
}
// модельне вікно авторизації
function modalAuthorization(){
    const loginButtons = document.querySelectorAll(".logInButton");
    loginButtons.forEach(loginButton => {
        loginButton.addEventListener("click", () => {
            console.log('DONE');
         const modalAuthorization = document.createElement('div');
            modalAuthorization.classList.add("modalAuthorization");
            modalAuthorization.innerHTML = `
            <div class="modalWindowAut">
            <span class="modalCloseAut">&times;</span>
            <h2>Login</h2>
            <form id="loginForm">
                <div class="formGroup">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Enter username" required>
                </div>
                <div class="formGroup">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter password" required>
                </div>
                <button type="submit" class="submitBtn">Log In</button>
            </form>
        </div>`;
            document.body.appendChild(modalAuthorization);

            setTimeout(() => {
                modalAuthorization.querySelector('.modalWindowAut').classList.add('appearance');
            }, 50);

            modalAuthorization.querySelector('.modalCloseAut').addEventListener('click', () => modalAuthorization.remove());
            modalAuthorization.addEventListener('click', (e) => {
                if (e.target === modalAuthorization) modalAuthorization.remove();
            });
        })
    })
}