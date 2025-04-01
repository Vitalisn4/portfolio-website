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

// Certificate Management
const certificateForm = document.getElementById("certificateForm")
const certificateName = document.getElementById("certificateName")
const certificateIssuer = document.getElementById("certificateIssuer")
const certificateDate = document.getElementById("certificateDate")
const certificateDescription = document.getElementById("certificateDescription")
const certificateUpload = document.getElementById("certificateUpload")
const certificatesList = document.getElementById("certificatesList")
const noCertificates = document.getElementById("noCertificates")

// Add certificate form submission
certificateForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const file = certificateUpload.files[0]

  if (file) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileData = e.target.result

      // Create certificate object
      const certificate = {
        id: Date.now(),
        name: certificateName.value.trim(),
        issuer: certificateIssuer.value.trim(),
        date: certificateDate.value,
        description: certificateDescription.value.trim(),
        file: {
          name: file.name,
          type: file.type,
          data: fileData,
        },
        uploadDate: new Date().toLocaleDateString(),
      }

      // Get existing certificates or initialize empty array
      const certificates = JSON.parse(localStorage.getItem("certificates")) || []

      // Add new certificate
      certificates.push(certificate)

      // Save to localStorage
      localStorage.setItem("certificates", JSON.stringify(certificates))

      // Update certificates display
      displayCertificates()

      // Reset form
      certificateForm.reset()

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

    certificates.forEach((cert) => {
      const certElement = document.createElement("div")
      certElement.className = "certificate-item"

      const isImage = cert.file.type.startsWith("image")
      const isPDF = cert.file.type === "application/pdf"

      // Format the date
      const certDate = new Date(cert.date)
      const formattedDate = certDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      certElement.innerHTML = `
                <div class="certificate-header">
                    <div>
                        <h4 class="certificate-title">${cert.name}</h4>
                        <p class="certificate-issuer">Issued by: ${cert.issuer}</p>
                        <p class="certificate-earned">Earned: ${formattedDate}</p>
                    </div>
                </div>
                <p class="certificate-description">${cert.description}</p>
                ${
                  isImage
                    ? `<img src="${cert.file.data}" alt="${cert.name}" class="certificate-image" onclick="openCertificateModal('${cert.id}')">`
                    : isPDF
                      ? `<div class="pdf-preview" onclick="openCertificateModal('${cert.id}')">
                        <div class="pdf-icon"></div>
                        <p>Click to view PDF</p>
                    </div>`
                      : `<div class="file-preview">
                        <div class="file-icon"></div>
                        <p>${cert.file.name}</p>
                    </div>`
                }
                <div class="certificate-actions">
                    <button class="btn secondary-btn" onclick="openCertificateModal('${cert.id}')">View</button>
                    <button class="btn primary-btn" onclick="downloadCertificate('${cert.id}')">Download</button>
                    <button class="btn error-btn" onclick="deleteCertificate('${cert.id}')">Delete</button>
                </div>
            `

      certificatesList.appendChild(certElement)
    })
  } else {
    noCertificates.style.display = "block"
    certificatesList.innerHTML = ""
  }
}

function deleteCertificate(id) {
  let certificates = JSON.parse(localStorage.getItem("certificates")) || []

  certificates = certificates.filter((cert) => cert.id != id)

  localStorage.setItem("certificates", JSON.stringify(certificates))

  displayCertificates()

  showModal("Certificate deleted successfully!")
}

function downloadCertificate(id) {
  const certificates = JSON.parse(localStorage.getItem("certificates")) || []
  const certificate = certificates.find((cert) => cert.id == id)

  if (certificate) {
    const link = document.createElement("a")
    link.href = certificate.file.data
    link.download = certificate.file.name
    link.click()
  }
}

// Create certificate modal elements
const certificateModal = document.createElement("div")
certificateModal.className = "certificate-modal"
certificateModal.innerHTML = `
    <div class="certificate-modal-content">
        <span class="certificate-modal-close">&times;</span>
        <div id="certificateModalContent"></div>
    </div>
`
document.body.appendChild(certificateModal)

const certificateModalContent = document.getElementById("certificateModalContent")
const certificateModalClose = document.querySelector(".certificate-modal-close")

certificateModalClose.addEventListener("click", () => {
  certificateModal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === certificateModal) {
    certificateModal.style.display = "none"
  }
})

function openCertificateModal(id) {
  const certificates = JSON.parse(localStorage.getItem("certificates")) || []
  const certificate = certificates.find((cert) => cert.id == id)

  if (certificate) {
    const isImage = certificate.file.type.startsWith("image")
    const isPDF = certificate.file.type === "application/pdf"

    if (isImage) {
      certificateModalContent.innerHTML = `
                <img src="${certificate.file.data}" alt="${certificate.name}" class="certificate-modal-image">
            `
    } else if (isPDF) {
      certificateModalContent.innerHTML = `
                <iframe src="${certificate.file.data}" class="certificate-modal-pdf"></iframe>
            `
    } else {
      certificateModalContent.innerHTML = `
                <div class="file-preview">
                    <div class="file-icon"></div>
                    <p>${certificate.file.name}</p>
                    <a href="${certificate.file.data}" download="${certificate.file.name}" class="btn primary-btn">Download</a>
                </div>
            `
    }

    certificateModal.style.display = "flex"
  }
}

// Load certificates on page load
document.addEventListener("DOMContentLoaded", () => {
  displayCertificates()
})

