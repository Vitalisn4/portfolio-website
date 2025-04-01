// DOM Elements
const themeToggle = document.getElementById("themeToggle")
const menuToggle = document.getElementById("menuToggle")
const navMenu = document.getElementById("navMenu")
const navLinks = document.querySelectorAll(".nav-link")
const successModal = document.getElementById("successModal")
const closeModal = document.querySelector(".close-modal")
const modalMessage = document.getElementById("modalMessage")

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark")

  // Save theme preference to localStorage
  const isDarkMode = document.body.classList.contains("dark")
  localStorage.setItem("darkMode", isDarkMode)
})

// Check for saved theme preference
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("darkMode")

  if (savedTheme === "true") {
    document.body.classList.add("dark")
  }
})

// Mobile Menu Toggle
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a nav link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    navMenu.classList.remove("active")

    // Remove active class from all links
    navLinks.forEach((navLink) => {
      navLink.classList.remove("active")
    })

    // Add active class to clicked link
    link.classList.add("active")
  })
})

// Highlight active section in navigation
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section")
  const scrollPosition = window.scrollY

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
})

// Scroll Animation
function checkScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll")

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top
    const screenPosition = window.innerHeight / 1.2

    if (elementPosition < screenPosition) {
      element.classList.add("animate")
    }
  })
}

window.addEventListener("scroll", checkScroll)
window.addEventListener("load", checkScroll)

// Modal Functions
function showModal(message) {
  modalMessage.textContent = message
  successModal.style.display = "flex"
}

closeModal.addEventListener("click", () => {
  successModal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.style.display = "none"
  }
})

// CV Upload and Download
const cvUpload = document.getElementById("cvUpload")
const downloadCV = document.getElementById("downloadCV")
const cvPreview = document.getElementById("cvPreview")

cvUpload.addEventListener("change", (e) => {
  const file = e.target.files[0]

  if (file) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileName = file.name
      const fileSize = Math.round(file.size / 1024) // Convert to KB

      // Store CV data in localStorage
      localStorage.setItem("cvData", e.target.result)
      localStorage.setItem("cvName", fileName)

      // Update preview
      cvPreview.innerHTML = `
                <div class="cv-file">
                    <div class="file-icon"></div>
                    <div class="file-info">
                        <p class="file-name">${fileName}</p>
                        <p class="file-size">${fileSize} KB</p>
                    </div>
                </div>
            `

      // Enable download button
      downloadCV.disabled = false

      showModal("CV uploaded successfully!")
    }

    reader.readAsDataURL(file)
  }
})

downloadCV.addEventListener("click", () => {
  const cvData = localStorage.getItem("cvData")
  const cvName = localStorage.getItem("cvName")

  if (cvData && cvName) {
    const link = document.createElement("a")
    link.href = cvData
    link.download = cvName
    link.click()
  }
})

// Check if CV exists in localStorage
document.addEventListener("DOMContentLoaded", () => {
  const cvData = localStorage.getItem("cvData")
  const cvName = localStorage.getItem("cvName")

  if (cvData && cvName) {
    const fileSize = Math.round((cvData.length * 3) / 4 / 1024) // Estimate size from base64

    cvPreview.innerHTML = `
            <div class="cv-file">
                <div class="file-icon"></div>
                <div class="file-info">
                    <p class="file-name">${cvName}</p>
                    <p class="file-size">${fileSize} KB</p>
                </div>
            </div>
        `

    downloadCV.disabled = false
  }
})

// Certificate Upload
const certificateUpload = document.getElementById("certificateUpload")
const certificatesList = document.getElementById("certificatesList")
const noCertificates = document.getElementById("noCertificates")

certificateUpload.addEventListener("change", (e) => {
  const file = e.target.files[0]

  if (file) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileName = file.name
      const fileData = e.target.result

      // Get existing certificates or initialize empty array
      const certificates = JSON.parse(localStorage.getItem("certificates")) || []

      // Add new certificate
      certificates.push({
        name: fileName,
        data: fileData,
        date: new Date().toLocaleDateString(),
      })

      // Save to localStorage
      localStorage.setItem("certificates", JSON.stringify(certificates))

      // Update certificates display
      displayCertificates()

      showModal("Certificate added successfully!")
    }

    reader.readAsDataURL(file)
  }
})

function displayCertificates() {
  const certificates = JSON.parse(localStorage.getItem("certificates")) || []

  if (certificates.length > 0) {
    noCertificates.style.display = "none"

    certificatesList.innerHTML = ""

    certificates.forEach((cert, index) => {
      const certElement = document.createElement("div")
      certElement.className = "certificate-item"

      const isImage = cert.data.startsWith("data:image")

      certElement.innerHTML = `
                ${
                  isImage
                    ? `<img src="${cert.data}" alt="${cert.name}" class="certificate-image">`
                    : `<div class="file-icon"></div>`
                }
                <p class="certificate-name">${cert.name}</p>
                <p class="certificate-date">Added: ${cert.date}</p>
                <button class="btn secondary-btn view-certificate">View</button>
                <button class="btn primary-btn delete-certificate" data-index="${index}">Delete</button>
            `

      certificatesList.appendChild(certElement)
    })

    // Add event listeners for delete buttons
    document.querySelectorAll(".delete-certificate").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index")
        deleteCertificate(index)
      })
    })

    // Add event listeners for view buttons
    document.querySelectorAll(".view-certificate").forEach((button, index) => {
      button.addEventListener("click", () => {
        const cert = certificates[index]

        // Create a temporary link to open/download the certificate
        const link = document.createElement("a")
        link.href = cert.data
        link.target = "_blank"
        link.click()
      })
    })
  } else {
    noCertificates.style.display = "block"
    certificatesList.innerHTML = ""
  }
}

function deleteCertificate(index) {
  const certificates = JSON.parse(localStorage.getItem("certificates")) || []

  certificates.splice(index, 1)

  localStorage.setItem("certificates", JSON.stringify(certificates))

  displayCertificates()

  showModal("Certificate deleted successfully!")
}

// Load certificates on page load
document.addEventListener("DOMContentLoaded", displayCertificates)

