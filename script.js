;(() => {
  const guess =
    ["localhost","127.0.0.1"].includes(location.hostname)
      ? "http://127.0.0.1:8000"
      : "https://portfolio-backend-yzg8.onrender.com"; // Render URL
  // Only set if not already set by another script
  window.API_BASE = window.API_BASE || guess;
})();


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
document.getElementById("brimmbot-button")?.addEventListener("click", toggleBrimmBot);

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
const API_BASE = window.API_BASE;

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const body = {
      first_name: fd.get("first_name")?.toString().trim(),
      last_name:  fd.get("last_name")?.toString().trim(),
      email:      fd.get("email")?.toString().trim(),
      subject:    fd.get("subject")?.toString().trim(),
      message:    fd.get("message")?.toString().trim(),
      company:    fd.get("company")?.toString().trim(), // honeypot
    };

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.classList.add("opacity-60","cursor-not-allowed");

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });
      let data; try { data = await res.json(); } catch { data = {}; }
      if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);

      showSuccessPopup();
      contactForm.reset();
    } catch (err) {
      console.error(err);
      alert("Couldnt send your message. Please email me directly.");
    } finally {
      btn.disabled = false; btn.classList.remove("opacity-60","cursor-not-allowed");
    }
  });
}

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
;

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


document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  // Show only 'main' cards by default
  skillCards.forEach(card => {
    card.style.display = card.classList.contains("main") ? "flex" : "none";
  });

  // 👉 Make sure the 'Main Skills' button shows as active on load
  const defaultButton = document.querySelector(".filter-btn[data-filter='main']");
  if (defaultButton) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    defaultButton.classList.add("active");
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Toggle active button styles
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Show matching cards, hide others
      skillCards.forEach(card => {
        card.style.display = card.classList.contains(filter) ? "flex" : "none";
      });
    });
  });
});

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

// Mailchimp


document.getElementById("subscribe-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = document.getElementById("first_name").value.trim();
  const lastName  = document.getElementById("last_name").value.trim();
  const email     = document.getElementById("email").value.trim();
  const honeypot  = document.getElementById("company").value.trim(); // spam trap
  const msgBox    = document.getElementById("subscribe-msg");

  if (honeypot) {
    msgBox.textContent = "Submission blocked.";
    msgBox.classList.remove("hidden"); msgBox.classList.add("bg-red-500","text-white");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email }),
    });

    // robust error handling
    let data;
    try { data = await res.json(); }
    catch { throw new Error(`Non-JSON response (status ${res.status})`); }

    if (!res.ok) throw new Error(data.detail || data.message || `HTTP ${res.status}`);

    msgBox.textContent = data.message || "Thanks for subscribing! Check your email to confirm.";
    msgBox.classList.remove("hidden"); msgBox.classList.add("bg-green-500","text-white");
  } catch (err) {
    console.error(err);
    msgBox.textContent = "Something went wrong. Please try again.";
    msgBox.classList.remove("hidden"); msgBox.classList.add("bg-red-500","text-white");
  }
});




