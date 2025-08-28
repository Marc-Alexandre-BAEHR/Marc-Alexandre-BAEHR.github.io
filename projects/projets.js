function formatTechnologies(technos) {
    const isMobile = window.innerWidth <= 768;

    if (!isMobile)
        return technos.join(', ');
    if (technos.length <= 2)
        return technos.join(', ');

    const visibles = technos.slice(0, 2).join(', ');
    const rest = technos.length - 2;
    return `${visibles}, +${rest}`;
}

const no_images_message = "Aucune image n'a été fournie pour ce projet.";

document.addEventListener('DOMContentLoaded', () => {
    fetch('/projects/projets.json')
        .then(response => response.json())
        .then(data => {
            const sidebar = document.getElementById('sidebar');

            data.projets.forEach((projet, index) => {
                const item = document.createElement('div');
                item.setAttribute("data-id", projet.id);
                item.classList.add('project-item');
                item.innerHTML = `
                <div class="project-header">
                    <strong>${projet.nom}</strong>
                    <span class="project-date">${projet.date}</span>
                </div>
                <span class="project-technos">${formatTechnologies(projet.technologies)}</span>
                `;
                item.addEventListener('click', () => {
                    afficherDetails(projet, item);
                });

                sidebar.appendChild(item);
            });

            function afficherDetails(projet, elementClique) {
                const details = document.getElementById('project-details');
                const allItems = document.querySelectorAll('.project-item');

                allItems.forEach(item => item.classList.remove('active-project'));
                elementClique.classList.add('active-project');

                details.innerHTML = `
                <div class="details-grid">
                    <!-- Colonne gauche (3 blocs) -->
                    <div class="card info-card name-card">
                    <span class="section-title">Nom</span>
                    <div class="info-value">${projet.nom}</div>
                    </div>

                    <div class="card info-card date-card">
                    <span class="section-title">Date du projet</span>
                    <div class="info-value">${projet.date}</div>
                    </div>

                    <div class="card info-card team-card">
                    <span class="section-title">Taille du groupe</span>
                    <div class="info-value">
                        ${projet.equipe > 1 ? `${projet.equipe} personnes` : `1 personne`}
                    </div>
                    </div>

                    <!-- Description (prend la hauteur des 3 blocs de gauche) -->
                    <div class="card desc-card">
                    <span class="section-title">Description du projet</span>
                    <div class="desc-text">${projet.description.join("<br>")}</div>
                    </div>

                    <!-- Galerie -->
                    <div class="card gallery-card">
                    <span class="section-title">Galerie d’images</span>
                    ${projet.images.length > 0 ? `
                        <div class="gallery-container" id="gallery-container">
                        <img class="gallery-image" id="gallery-image"
                            src="${projet.images[0]}" alt="Image du projet">
                        </div>
                        <div class="gallery-controls gallery-controls--bar">
                        <button class="gallery-btn" id="prev-btn">PRÉCÉDENT</button>
                        <span class="gallery-counter" id="gallery-counter">1 / ${projet.images.length}</span>
                        <button class="gallery-btn" id="next-btn">SUIVANT</button>
                        </div>
                    ` : `<p class="no-images-message">${no_images_message}</p>`}
                    </div>

                    <!-- Technologies -->
                    <div class="card tech-card">
                    <span class="section-title">Technologie(s) utilisé(s)</span>
                    <div class="tech-grid">
                        ${
                        projet.technologies.map(t => `
                            <div class="tech-item">
                            <div class="tech-thumb">
                                <img src="/projects/technologies/${t}.png" alt="${t}" title="${t}">
                            </div>
                            <!-- <span class="tech-name">${t}</span> -->
                            </div>
                        `).join("")
                        }
                    </div>
                    </div>
                </div>
                `;

                history.replaceState(null, null, `#${projet.id}`);

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

                    // Boutons pour switch d'images
                    prevBtn.addEventListener('click', () => {
                        currentIndex = (currentIndex - 1 + projet.images.length) % projet.images.length;
                        updateGallery();
                    });

                    nextBtn.addEventListener('click', () => {
                        currentIndex = (currentIndex + 1) % projet.images.length;
                        updateGallery();
                    });

                    // Si clic alors ouvre image
                    imageEl.addEventListener("click", () => {
                        window.open(projet.images[currentIndex], "_blank");
                    });
                }
            }

            // Si hash dans l'url
            function handleHash() {
                const hash = location.hash.replace('#', '');
                if (!hash)
                    return;
                const projet = data.projets.find(p => p.id === hash);
                if (projet) {
                    const item = document.querySelector(`.project-item[data-id="${projet.id}"]`);
                    if (item)
                        afficherDetails(projet, item);
                } else
                    history.replaceState(null, null, window.location.pathname);
            }

            // 1ère fois
            handleHash();

            // Le reste du temps
            window.addEventListener('hashchange', handleHash);
        });
});
