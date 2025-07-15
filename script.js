
       // Enhanced BrimmBot function
function toggleBrimmBot() {
  const frame = document.getElementById("brimmbot-frame")
  const button = document.getElementById("brimmbot-button")

  if (frame) {
    const isHidden = frame.style.display === "none" || frame.style.display === ""
    frame.style.display = isHidden ? "block" : "none"

    // Update button appearance
    if (button) {
      button.style.transform = isHidden ? "scale(0.9)" : "scale(1)"
      button.style.opacity = isHidden ? "0.8" : "1"
    }
  }
}

// Make function globally available
window.toggleBrimmBot = toggleBrimmBot

// Enhanced launch BrimmBot function
function launchBrimmBotFromPage() {
  const frame = document.getElementById("brimmbot-frame")
  if (frame && frame.style.display === "none") {
    frame.style.display = "block"
  }
}

// Add event listener for the launch button
document.addEventListener("DOMContentLoaded", () => {
  const launchBtn = document.getElementById("launch-brimmbot")
  if (launchBtn) {
    launchBtn.addEventListener("click", launchBrimmBotFromPage)
  }
})

// Contact form handling
//document.addEventListener("DOMContentLoaded", () => {
  //const contactForm = document.getElementById("contact-form");

  //if (contactForm) {
    //contactForm.addEventListener("submit", async (e) => {
     // e.preventDefault();

      //const formData = new FormData(contactForm);
      //const data = {
  //name: formData.get("from_name"),
  //email: formData.get("reply_to"),
  //message: formData.get("message"),
//};

      //try {
        //const response = await fetch("http://localhost:8000/send-email/", {
         // method: "POST",
          //headers: {
          //  "Content-Type": "application/x-www-form-urlencoded",
          //},
          //body: new URLSearchParams(data),
        //});

        //const result = await response.json();
        //if (result.success) {
         // showSuccessPopup();
         // contactForm.reset();
        //} else {
        //  alert("Failed to send message: " + result.message);
        //}
     // } catch (err) {
      //  console.error("Error:", err);
      //  alert("Something went wrong. Please try again.");
      //}
    //});
  //}

  // Show success popup
  function showSuccessPopup() {
    const popup = document.getElementById("success-popup");
    if (popup) {
      popup.style.display = "flex";
      popup.style.opacity = "0";
      setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.transition = "opacity 0.3s ease-in-out";
      }, 10);
    }
  }

  // Close success popup
  function closeSuccessPopup() {
    const popup = document.getElementById("success-popup");
    if (popup) {
      popup.style.opacity = "0";
      setTimeout(() => {
        popup.style.display = "none";
      }, 300);
    }
  }

  // Close popup when clicking outside
  document.addEventListener("click", (e) => {
    const popup = document.getElementById("success-popup");
    if (popup && e.target === popup) {
      closeSuccessPopup();
    }
  });

  // Close popup with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSuccessPopup();
    }
  });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" })
}

// Download resume function
function downloadResume() {
  // Replace 'resume.pdf' with your actual resume file path
  const link = document.createElement("a")
  link.href = "resume.pdf" // Update this path to your actual resume file
  link.download = "Tatiana_Brimm_Resume.pdf"
  link.click()
}

// Skills filtering
document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded and DOM ready")

  const defaultButton = document.querySelector(".filter-btn[data-filter='main']")
  if (defaultButton) {
    filterSkills("main", defaultButton)
  }
})

function filterSkills(category, button) {
  const skills = document.querySelectorAll(".skill-card");
  const buttons = document.querySelectorAll(".filter-btn");

  // Update active button
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  // Filter skills using data attribute
  skills.forEach((skill) => {
    if (skill.dataset.category === category) {
      skill.style.display = "flex";
    } else {
      skill.style.display = "none";
    }
  });
}

// Project filtering
function filterProjects(category) {
  const projects = document.querySelectorAll(".project-card")
  const buttons = document.querySelectorAll(".filter-btn")

  buttons.forEach((btn) => btn.classList.remove("active"))
  const clickedBtn = Array.from(buttons).find((btn) => btn.textContent.trim().toLowerCase() === category.toLowerCase())
  if (clickedBtn) clickedBtn.classList.add("active")

  projects.forEach((project) => {
    const tags = project.dataset.category.toLowerCase()
    if (category === "All" || tags.includes(category.toLowerCase())) {
      project.style.display = "block"
    } else {
      project.style.display = "none"
    }
  })
}

// Navigation active state
window.addEventListener("scroll", () => {
  const sections = ["home", "about", "skills", "projects", "blog", "contact"]
  const scrollPosition = window.scrollY + 100
  sections.forEach((section) => {
    const element = document.getElementById(section)
    const navLink = document.querySelector(`a[href="#${section}"]`)
    if (element && navLink) {
      const { offsetTop, offsetHeight } = element
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"))
        navLink.classList.add("active")
      }
    }
  })
})

// Initialize skills filter to show main skills by default
document.addEventListener("DOMContentLoaded", () => {
  filterSkills("main", document.querySelector('[data-filter="main"]'))
})
