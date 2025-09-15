// Portfolio navigation and interactions
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    setupGridItemEvents();
    setupProjectListEvents();
    setupInteractiveElements();
    initializeAnimations();
}

// Grid item navigation
let originalContent = null;

function setupGridItemEvents() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-id');
            showProjectDetail(projectId);
        });
    });
}

function setupProjectListEvents() {
    const projectItems = document.querySelectorAll('.project-list-item');
    
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-id');
            showProjectDetail(projectId);
        });
    });
}

function showProjectDetail(projectId) {
    const rightColumn = document.querySelector('.right-column');
    
    // Save original content
    if (!originalContent) {
        originalContent = rightColumn.innerHTML;
    }
    
    // Highlight current project in the list
    highlightCurrentProject(projectId);
    
    // Create detail container with animation
    createDetailContainer(rightColumn, projectId);
}

function highlightCurrentProject(projectId) {
    const projectItems = document.querySelectorAll('.project-list-item');
    
    projectItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-id') === projectId);
    });
}

function createDetailContainer(rightColumn, projectId) {
    const detailContainer = document.createElement('div');
    detailContainer.classList.add('detail-container');
    
    // Initial position for slide animation
    Object.assign(detailContainer.style, {
        position: 'absolute',
        top: '0',
        right: '-100%',
        width: '100%',
        height: '100%',
        transition: 'right 0.5s ease',
        backgroundColor: '#fcfcfc',
        zIndex: '10'
    });
    
    // Create iframe for project content
    const iframe = createProjectIframe(projectId);
    const backButton = createBackButton();
    const nextButton = createNextButton(projectId);
    
    detailContainer.appendChild(iframe);
    rightColumn.appendChild(detailContainer);
    rightColumn.appendChild(backButton);
    rightColumn.appendChild(nextButton);
    
    // Trigger slide animation
    setTimeout(() => {
        detailContainer.style.right = '0';
        
        // Show buttons after iframe loads with fallback
        let buttonsShown = false;
        
        const showButtons = () => {
            if (!buttonsShown) {
                buttonsShown = true;
                setTimeout(() => {
                    backButton.style.opacity = '1';
                    nextButton.style.opacity = '1';
                }, 200);
            }
        };
        
        iframe.onload = showButtons;
        
        // Fallback: show buttons after 1 second regardless of iframe load status
        setTimeout(showButtons, 1000);
    }, 50);
}

function createProjectIframe(projectId) {
    const iframe = document.createElement('iframe');
    
    Object.assign(iframe, {
        src: `project${projectId}.html`,
        id: 'detail-iframe'
    });
    
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        overflow: 'hidden'
    });
    
    return iframe;
}

function createNextButton(currentProjectId) {
    const nextButton = document.createElement('div');
    nextButton.classList.add('next-button', 'svg-button');
    
    // Create SVG icon
    const svgIcon = document.createElement('img');
    svgIcon.src = '/svg/next.svg';
    svgIcon.classList.add('button-icon');
    
    nextButton.appendChild(svgIcon);
    
    Object.assign(nextButton.style, {
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        zIndex: '20',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: '0'
    });
    
    // Click handler - always get current project from iframe src
    nextButton.addEventListener('click', () => {
        const iframe = document.getElementById('detail-iframe');
        if (iframe && iframe.src) {
            // Extract current project ID from iframe src
            const match = iframe.src.match(/project(\d+)\.html/);
            const currentId = match ? match[1] : currentProjectId;
            const nextProjectId = getNextProjectId(currentId);
            updateProjectDetail(nextProjectId);
        }
    });
    
    return nextButton;
}

function getNextProjectId(currentId) {
    const currentNum = parseInt(currentId);
    const maxProjects = 10; // Total number of projects
    return currentNum >= maxProjects ? '1' : (currentNum + 1).toString();
}

function createBackButton() {
    const backButton = document.createElement('div');
    backButton.classList.add('back-button', 'svg-button');
    
    // Create SVG icon
    const svgIcon = document.createElement('img');
    svgIcon.src = '/svg/close.svg';
    svgIcon.classList.add('button-icon');
    
    backButton.appendChild(svgIcon);
    
    Object.assign(backButton.style, {
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        zIndex: '20',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: '0'
    });
    
    // Click handler
    backButton.addEventListener('click', () => closeProjectDetail(backButton));
    
    return backButton;
}

function updateProjectDetail(projectId) {
    highlightCurrentProject(projectId);
    
    const iframe = document.getElementById('detail-iframe');
    const backButton = document.querySelector('.back-button');
    const nextButton = document.querySelector('.next-button');
    
    if (iframe && backButton && nextButton) {
        // Hide buttons during transition
        backButton.style.opacity = '0';
        nextButton.style.opacity = '0';
        
        // Load new project
        iframe.src = `project${projectId}.html`;
        
        // Update next button click handler for new project and show buttons after load
        let buttonsShown = false;
        
        const showButtons = () => {
            if (!buttonsShown) {
                buttonsShown = true;
                // Remove old click handler and add new one
                const newNextButton = nextButton.cloneNode(true);
                nextButton.parentNode.replaceChild(newNextButton, nextButton);
                
                // Add click handler for next project
                newNextButton.addEventListener('click', () => {
                    const nextProjectId = getNextProjectId(projectId);
                    updateProjectDetail(nextProjectId);
                });
                
                setTimeout(() => {
                    backButton.style.opacity = '1';
                    newNextButton.style.opacity = '1';
                }, 200);
            }
        };
        
        iframe.onload = showButtons;
        
        // Fallback: show buttons after 1 second regardless of iframe load status
        setTimeout(showButtons, 1000);
    }
}

function closeProjectDetail(backButton) {
    const detailContainer = document.querySelector('.detail-container');
    const nextButton = document.querySelector('.next-button');
    
    // Hide both buttons first
    backButton.style.opacity = '0';
    if (nextButton) nextButton.style.opacity = '0';
    
    // Clear project list highlighting
    const projectItems = document.querySelectorAll('.project-list-item');
    projectItems.forEach(item => {
        item.classList.remove('active');
    });
    
    setTimeout(() => {
        // Slide out detail container
        if (detailContainer) {
            detailContainer.style.right = '-100%';
            
            // Clean up after animation
            setTimeout(() => {
                detailContainer.remove();
                backButton.remove();
                if (nextButton) nextButton.remove();
            }, 500);
        }
    }, 300);
}

// Interactive hover effects
function setupInteractiveElements() {
    const interactiveElements = document.querySelectorAll('.nav-item, .item, .social-link, .project-list-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (!element.classList.contains('project-list-item')) {
                element.style.opacity = '0.7';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (!element.classList.contains('project-list-item')) {
                element.style.opacity = '1';
            }
        });
    });
    
    // Setup social link click handlers
    setupSocialLinkHandlers();
}

function setupSocialLinkHandlers() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        const linkText = link.textContent.trim();
        
        // Email link handler
        if (linkText === 'Email') {
            link.addEventListener('click', () => {
                window.open('mailto:yd3015@nyu.edu', '_blank');
            });
        }
        
        // Portfolio link handlers (both versions)
        if (linkText === 'Portfolio' || linkText.includes('Design portfolio upon request')) {
            link.addEventListener('click', () => {
                showAccessCodeModal();
            });
        }
        
        // Resume button click handler
        if (linkText === 'Resume') {
            link.addEventListener('click', () => {
                showAboutMe();
            });
        }
    });
}

function showAccessCodeModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    
    Object.assign(modalOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    Object.assign(modalContent.style, {
        backgroundColor: '#fcfcfc',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        transform: 'scale(0.9)',
        transition: 'transform 0.3s ease'
    });
    
    // Modal title
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Portfolio Access';
    modalTitle.style.marginBottom = '1rem';
    modalTitle.style.fontSize = '1.5rem';
    modalTitle.style.fontWeight = 'bold';
    
    // Modal description
    const modalDescription = document.createElement('p');
    modalDescription.textContent = 'Please enter the access code to view the design portfolio:';
    modalDescription.style.marginBottom = '1.5rem';
    modalDescription.style.color = '#666';
    
    // Input field
    const accessCodeInput = document.createElement('input');
    accessCodeInput.type = 'password';
    accessCodeInput.placeholder = 'Enter access code';
    
    Object.assign(accessCodeInput.style, {
        width: '100%',
        padding: '0.8rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
        marginBottom: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    });
    
    // Error message
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Incorrect access code. Please try again.';
    
    Object.assign(errorMessage.style, {
        color: '#ff4444',
        fontSize: '0.9rem',
        marginBottom: '1rem',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '1rem';
    buttonsContainer.style.justifyContent = 'center';
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Access Portfolio';
    
    Object.assign(submitButton.style, {
        padding: '0.8rem 1.5rem',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    });
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    
    Object.assign(cancelButton.style, {
        padding: '0.8rem 1.5rem',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    });
    
    // Event handlers
    const handleSubmit = () => {
        const enteredCode = accessCodeInput.value.trim();
        
       
        const enteredHash = btoa(enteredCode).split('').reverse().join('');
        const correctHash = '=UjMwIzZuVGZl9ma';
        
        if (enteredHash === correctHash) {
           
            const encodedUrl = '=42ZpNXZk5yZuVGZl9mauc3d39yL6MHc0RHa'; 
            const decodedUrl = atob(encodedUrl.split('').reverse().join(''));
            window.open(decodedUrl, '_blank');
            closeModal();
        } else {
            // Incorrect code - show error
            errorMessage.style.opacity = '1';
            accessCodeInput.style.borderColor = '#ff4444';
            accessCodeInput.value = '';
            accessCodeInput.focus();
        }
    };
    
    const closeModal = () => {
        modalOverlay.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    };
    
    // Button event listeners
    submitButton.addEventListener('click', handleSubmit);
    cancelButton.addEventListener('click', closeModal);
    
    // Enter key handler
    accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Click outside to close
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Input focus handler to clear error
    accessCodeInput.addEventListener('focus', () => {
        errorMessage.style.opacity = '0';
        accessCodeInput.style.borderColor = '#ddd';
    });
    
    // Hover effects for buttons
    submitButton.addEventListener('mouseenter', () => {
        submitButton.style.backgroundColor = '#333';
    });
    
    submitButton.addEventListener('mouseleave', () => {
        submitButton.style.backgroundColor = '#000';
    });
    
    cancelButton.addEventListener('mouseenter', () => {
        cancelButton.style.backgroundColor = '#e0e0e0';
    });
    
    cancelButton.addEventListener('mouseleave', () => {
        cancelButton.style.backgroundColor = '#f0f0f0';
    });
    
    // Assemble modal
    buttonsContainer.appendChild(submitButton);
    buttonsContainer.appendChild(cancelButton);
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalDescription);
    modalContent.appendChild(accessCodeInput);
    modalContent.appendChild(errorMessage);
    modalContent.appendChild(buttonsContainer);
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Animate in
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
        accessCodeInput.focus();
    }, 10);
}

function showAboutMe() {
    const rightColumn = document.querySelector('.right-column');
    
    // Save original content if not already saved
    if (!originalContent) {
        originalContent = rightColumn.innerHTML;
    }
    
    // Create detail container with animation (similar to project detail)
    const detailContainer = document.createElement('div');
    detailContainer.classList.add('detail-container');
    
    // Initial position for slide animation
    Object.assign(detailContainer.style, {
        position: 'absolute',
        top: '0',
        right: '-100%',
        width: '100%',
        height: '100%',
        transition: 'right 0.5s ease',
        backgroundColor: '#fcfcfc',
        zIndex: '10'
    });
    
    // Create iframe for about me content
    const iframe = document.createElement('iframe');
    Object.assign(iframe, {
        src: 'about.html',
        id: 'about-iframe'
    });
    
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        overflow: 'hidden'
    });
    
    const backButton = createBackButton();
    
    detailContainer.appendChild(iframe);
    rightColumn.appendChild(detailContainer);
    rightColumn.appendChild(backButton);
    
    // Trigger slide animation
    setTimeout(() => {
        detailContainer.style.right = '0';
        
        // Show back button after iframe loads with fallback
        let buttonShown = false;
        
        const showButton = () => {
            if (!buttonShown) {
                buttonShown = true;
                setTimeout(() => {
                    backButton.style.opacity = '1';
                }, 200);
            }
        };
        
        iframe.onload = showButton;
        
        // Fallback: show button after 1 second regardless of iframe load status
        setTimeout(showButton, 1000);
    }, 50);
}

// Animation initialization
function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    fadeElements.forEach(el => observer.observe(el));
    
    // Initialize scroll reveal animations
    initializeScrollReveal();
}

// Scroll reveal animation system
function initializeScrollReveal() {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-slow, .scroll-reveal-gallery');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, we can stop observing this element
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        // Trigger when element is 20% visible
        threshold: 0.2,
        // Start triggering 100px before the element enters viewport
        rootMargin: '0px 0px -100px 0px'
    });
    
    scrollRevealElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

// Function to setup scroll animations for project detail pages
function setupProjectScrollAnimations() {
    // This function will be called when a project detail page loads
    setTimeout(() => {
        initializeScrollReveal();
    }, 100);
}