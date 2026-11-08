// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show");
        });
    });
}

// FAQ accordion
document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const isActive = item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach(faq => {
            faq.classList.remove("active");
            faq.querySelector(".faq-question span").textContent = "+";
        });

        if (!isActive) {
            item.classList.add("active");
            button.querySelector("span").textContent = "−";
        }
    });
});