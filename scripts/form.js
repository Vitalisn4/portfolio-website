// Contact Form Validation and Submission
const contactForm = document.getElementById("contactForm")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const subjectInput = document.getElementById("subject")
const messageInput = document.getElementById("message")

// Error message elements
const nameError = document.getElementById("nameError")
const emailError = document.getElementById("emailError")
const subjectError = document.getElementById("subjectError")
const messageError = document.getElementById("messageError")

// Validation functions
function validateName() {
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Name is required"
    return false
  } else if (nameInput.value.trim().length < 2) {
    nameError.textContent = "Name must be at least 2 characters"
    return false
  } else {
    nameError.textContent = ""
    return true
  }
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Email is required"
    return false
  } else if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = "Please enter a valid email address"
    return false
  } else {
    emailError.textContent = ""
    return true
  }
}

function validateSubject() {
  if (subjectInput.value.trim() === "") {
    subjectError.textContent = "Subject is required"
    return false
  } else if (subjectInput.value.trim().length < 3) {
    subjectError.textContent = "Subject must be at least 3 characters"
    return false
  } else {
    subjectError.textContent = ""
    return true
  }
}

function validateMessage() {
  if (messageInput.value.trim() === "") {
    messageError.textContent = "Message is required"
    return false
  } else if (messageInput.value.trim().length < 10) {
    messageError.textContent = "Message must be at least 10 characters"
    return false
  } else {
    messageError.textContent = ""
    return true
  }
}

// Add input event listeners for real-time validation
nameInput.addEventListener("input", validateName)
emailInput.addEventListener("input", validateEmail)
subjectInput.addEventListener("input", validateSubject)
messageInput.addEventListener("input", validateMessage)

// Function to show the modal
function showModal(message) {
  const successModal = document.getElementById("successModal")
  const modalMessage = document.getElementById("modalMessage")
  modalMessage.textContent = message
  successModal.style.display = "flex"
}

// Form submission
contactForm.addEventListener("submit", (e) => {
  // Validate all fields
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isSubjectValid = validateSubject()
  const isMessageValid = validateMessage()

  // If any validation fails, prevent form submission
  if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
    e.preventDefault()
    return
  }

  // Store message in localStorage as a backup
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    subject: subjectInput.value.trim(),
    message: messageInput.value.trim(),
    date: new Date().toLocaleString(),
  }

  const messages = JSON.parse(localStorage.getItem("contactMessages")) || []
  messages.push(formData)
  localStorage.setItem("contactMessages", JSON.stringify(messages))

  // Form will be submitted to Formspree
  // We don't need to prevent default here
})

