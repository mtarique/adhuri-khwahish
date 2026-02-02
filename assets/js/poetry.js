document.addEventListener('DOMContentLoaded', () => {
    const blogsContainer = document.getElementById('blogs-container');
    const username = 'ajay_pandey_efb031226b375';
    const apiUrl = `https://dev.to/api/articles?username=${username}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(articles => {
            blogsContainer.innerHTML = ''; // Clear loading spinner

            if (articles.length === 0) {
                blogsContainer.innerHTML = '<div class="col-12 text-center text-white">No articles found.</div>';
                return;
            }

            articles.forEach(article => {
                const card = createBlogCard(article);
                blogsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            blogsContainer.innerHTML = '<div class="col-12 text-center text-danger">Failed to load articles. Please try again later.</div>';
        });
});

function createBlogCard(article) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    // Use a placeholder if cover_image is missing
    const imageSrc = article.cover_image || 'https://placehold.co/600x400?text=No+Image';

    col.innerHTML = `
        <div class="card h-100 blog-card">
            <div class="card-img-wrapper">
                <img src="${imageSrc}" class="card-img-top" alt="${article.title}">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate-2">${article.title}</h5>
                <p class="card-text text-muted small mb-2">${new Date(article.published_at).toLocaleDateString()}</p>
                <p class="card-text flex-grow-1 text-truncate-3">${article.description}</p>
                <a href="article.html?slug=${article.slug}" class="btn btn-outline-primary mt-3 stretched-link">Read</a>
            </div>
        </div>
    `;

    return col;
}
