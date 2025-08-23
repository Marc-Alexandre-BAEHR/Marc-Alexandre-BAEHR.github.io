function formatTechnologies(technos) {
    const isMobile = window.innerWidth <= 768;

    // partie si c'est pas mobile ou techno -= 2
    if (!isMobile)
        return technos.join(', ');
    if (technos.length <= 2)
        return technos.join(', ');

    // partie recaculé pour mobile si + de 2 techno
    const visibles = technos.slice(0, 2).join(', ');
    const rest = technos.length - 2;
    return `${visibles}, +${rest}`;
}


document.addEventListener('DOMContentLoaded', () => {
    fetch('/projects/projets.json')
        .then(response => response.json())
        .then(data => {
            const sidebar = document.getElementById('sidebar');

            data.projets.forEach((projet, index) => {
                const item = document.createElement('div');
                item.classList.add('project-item');
                item.innerHTML = `
                    <strong>${projet.nom}</strong><br>
                    <span class="project-technos">${projet.technologies.join(', ')}</span>
                `;
                item.addEventListener('click', () => {
                    afficherDetails(projet, item);
                });
                sidebar.appendChild(item);

                item.innerHTML = `
                <div class="project-header">
                    <strong>${projet.nom}</strong>
                    <span class="project-date">${projet.date}</span>
                </div>
                <span class="project-technos">${formatTechnologies(projet.technologies)}</span>
                `;
            });

            function afficherDetails(projet, elementClique) {
                const details = document.getElementById('project-details');

                const allItems = document.querySelectorAll('.project-item');
                allItems.forEach(item => item.classList.remove('active-project'));

                elementClique.classList.add('active-project');

                details.innerHTML = `
                    <h2>${projet.nom}</h2>
                    <p><dt><strong>Description :        </dt></strong><dd>${projet.description.join("<br>")}</p></dd>
                    <p><dt><strong>Taille du groupe :   </dt></strong><dd> ${projet.equipe} pers.</p></dd>
                    <p><dt><strong>Technologies :       </dt></strong><dd>${projet.technologies.join(', ')}</p></dd>

                    <div class="gallery-container" id="gallery-container">
                    ${projet.images.length > 0 ? `
                        <img class="gallery-image" id="gallery-image" src="${projet.images[0]}" alt="Image du projet">
                        <div class="gallery-controls">
                            <button class="gallery-btn" id="prev-btn">⬅️</button>
                            <span class="gallery-counter" id="gallery-counter">1 / ${projet.images.length}</span>
                            <button class="gallery-btn" id="next-btn">➡️</button>
                        </div>
                    ` : `
                        <p class="no-images-message">Aucune image n’a été fournie pour ce projet.</p>
                    `}
                    </div>
                `;

                // images du projet
                if (projet.images.length > 0) {
                    let currentIndex = 0;
                    const imageEl = document.getElementById('gallery-image');
                    const counterEl = document.getElementById('gallery-counter');
                    const prevBtn = document.getElementById('prev-btn');
                    const nextBtn = document.getElementById('next-btn');

                    function updateGallery() {
                    imageEl.src = projet.images[currentIndex];
                    counterEl.textContent = `${currentIndex + 1} / ${projet.images.length}`;
                    }

                    prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + projet.images.length) % projet.images.length;
                    updateGallery();
                    });

                    nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % projet.images.length;
                    updateGallery();
                    });
                }
            }
        });
});

