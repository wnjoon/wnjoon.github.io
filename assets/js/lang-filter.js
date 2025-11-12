document.addEventListener('DOMContentLoaded', function() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  // Load saved language preference (default to 'ko')
  const savedLang = localStorage.getItem('selectedLang') || 'ko';
  setActiveLanguage(savedLang);
  
  langButtons.forEach(button => {
    button.addEventListener('click', function() {
      const selectedLang = this.getAttribute('data-lang');
      
      // Save preference
      localStorage.setItem('selectedLang', selectedLang);
      
      // Update active button
      langButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter posts
      filterPosts(selectedLang);
    });
  });
  
  function setActiveLanguage(lang) {
    langButtons.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    filterPosts(lang);
  }
  
  function filterPosts(lang) {
    const postItems = document.querySelectorAll('.post-item');
    let visibleCount = 0;
    const limit = 10; // Match the limit in menu.yml
    
    // Check if we're on the archive page - don't apply limit there
    const isArchivePage = window.location.pathname.includes('/archive');
    
    postItems.forEach(item => {
      const postLang = item.getAttribute('data-lang');
      
      // Only show posts matching the selected language
      if (postLang === lang) {
        visibleCount++;
        // Apply limit only on non-archive pages
        if (isArchivePage || visibleCount <= limit) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      } else {
        item.style.display = 'none';
      }
    });
    
    // Show/hide "show more" link based on whether there are hidden posts
    const showMoreContainer = document.querySelector('.show-more-container');
    if (showMoreContainer) {
      if (visibleCount > limit) {
        showMoreContainer.style.display = '';
      } else {
        showMoreContainer.style.display = 'none';
      }
    }
    
    // Update post count if it exists
    updatePostCount(visibleCount);
  }
  
  function updatePostCount(count) {
    // Find the post count element (looks for <strong>X posts</strong>)
    const countElements = document.querySelectorAll('p strong');
    
    countElements.forEach(element => {
      const text = element.textContent;
      // Check if it contains "posts" or "post"
      if (text.includes('posts') || text.includes('post')) {
        // Update the count while preserving the rest of the text
        element.textContent = text.replace(/\d+/, count);
      }
    });
  }
});
