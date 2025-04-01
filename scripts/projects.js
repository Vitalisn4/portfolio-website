// Projects Management
const addProjectForm = document.getElementById("addProjectForm")
const projectsGrid = document.getElementById("projectsGrid")
const noProjects = document.getElementById("noProjects")
const filterButtons = document.querySelectorAll(".filter-btn")

// Form elements
const projectName = document.getElementById("projectName")
const projectDescription = document.getElementById("projectDescription")
const projectCategory = document.getElementById("projectCategory")
const projectTechnologies = document.getElementById("projectTechnologies")
const projectImage = document.getElementById("projectImage")
const projectDemo = document.getElementById("projectDemo")
const projectRepo = document.getElementById("projectRepo")

// Function to show a modal (replace with your actual modal implementation)
function showModal(message) {
  alert(message) // A simple alert for demonstration purposes
}

// Add project form submission
addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form values
  const name = projectName.value.trim()
  const description = projectDescription.value.trim()
  const category = projectCategory.value
  const technologies = projectTechnologies.value
    .trim()
    .split(",")
    .map((tech) => tech.trim())
  const demoUrl = projectDemo.value.trim()
  const repoUrl = projectRepo.value.trim()

  // Handle image upload
  const imageFile = projectImage.files[0]

  if (imageFile) {
    const reader = new FileReader()

    reader.onload = (e) => {
      // Create project object with image
      const project = {
        id: Date.now(),
        name,
        description,
        category,
        technologies,
        image: e.target.result,
        demoUrl,
        repoUrl,
        date: new Date().toLocaleDateString(),
      }

      // Save project
      saveProject(project)
    }

    reader.readAsDataURL(imageFile)
  } else {
    // Create project object without image
    const project = {
      id: Date.now(),
      name,
      description,
      category,
      technologies,
      image: null,
      demoUrl,
      repoUrl,
      date: new Date().toLocaleDateString(),
    }

    // Save project
    saveProject(project)
  }
})

// Save project to localStorage
function saveProject(project) {
  // Get existing projects or initialize empty array
  const projects = JSON.parse(localStorage.getItem("projects")) || []

  // Add new project
  projects.push(project)

  // Save to localStorage
  localStorage.setItem("projects", JSON.stringify(projects))

  // Update projects display
  displayProjects()

  // Reset form
  addProjectForm.reset()

  // Show success message
  showModal("Project added successfully!")
}

// Display projects
function displayProjects(category = "all") {
  const projects = JSON.parse(localStorage.getItem("projects")) || []

  if (projects.length > 0) {
    noProjects.style.display = "none"

    // Filter projects by category if needed
    const filteredProjects = category === "all" ? projects : projects.filter((project) => project.category === category)

    if (filteredProjects.length === 0) {
      projectsGrid.innerHTML = `<p class="no-filtered-projects">No projects found in this category.</p>`
      return
    }

    projectsGrid.innerHTML = ""

    filteredProjects.forEach((project) => {
      const projectCard = document.createElement("div")
      projectCard.className = "project-card"

      // Default image if none provided
      const imageUrl = project.image || "/placeholder.svg?height=200&width=300"

      // Create tech tags HTML
      const techTags = project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")

      projectCard.innerHTML = `
                <img src="${imageUrl}" alt="${project.name}" class="project-image">
                <div class="project-info">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${techTags}
                    </div>
                    <div class="project-links">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-link demo-link">Live Demo</a>` : ""}
                        ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" class="project-link repo-link">GitHub</a>` : ""}
                        <button class="project-link repo-link delete-project" data-id="${project.id}">Delete</button>
                    </div>
                </div>
            `

      projectsGrid.appendChild(projectCard)
    })

    // Add event listeners for delete buttons
    document.querySelectorAll(".delete-project").forEach((button) => {
      button.addEventListener("click", (e) => {
        const projectId = Number.parseInt(e.target.getAttribute("data-id"))
        deleteProject(projectId)
      })
    })
  } else {
    noProjects.style.display = "block"
    projectsGrid.innerHTML = ""
  }
}

// Delete project
function deleteProject(projectId) {
  let projects = JSON.parse(localStorage.getItem("projects")) || []

  // Filter out the project to delete
  projects = projects.filter((project) => project.id !== projectId)

  // Save updated projects array
  localStorage.setItem("projects", JSON.stringify(projects))

  // Update projects display
  displayProjects(getActiveCategory())

  // Show success message
  showModal("Project deleted successfully!")
}

// Get active category
function getActiveCategory() {
  const activeButton = document.querySelector(".filter-btn.active")
  return activeButton ? activeButton.getAttribute("data-filter") : "all"
}

// Project filtering
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    button.classList.add("active")

    // Get filter category
    const category = button.getAttribute("data-filter")

    // Display filtered projects
    displayProjects(category)
  })
})

// Load projects on page load
document.addEventListener("DOMContentLoaded", () => {
  displayProjects()
})

