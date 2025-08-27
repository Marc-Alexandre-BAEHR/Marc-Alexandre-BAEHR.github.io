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
                    <h2>${projet.nom}</h2>
                    <p><dt><strong>Description :</strong></dt><dd>${projet.description.join("<br>")}</dd></p>
                    <p><dt><strong>Taille du groupe :</strong></dt><dd>${projet.equipe > 1 ? `${projet.equipe} pers.` : `Seul`}</dd></p>
                    <p><dt><strong>Technologies :</strong></dt><dd>${projet.technologies.join(', ')}</dd></p>

                    <div class="gallery-container" id="gallery-container">
                    ${projet.images.length > 0 ?
                        `<img class="gallery-image" id="gallery-image" src="${projet.images[0]}" alt="Image du projet">
                            ${projet.images.length > 1 ? `
                                    <div class="gallery-controls">
                                    <button class="gallery-btn" id="prev-btn"> Précédent </button>
                                    <span class="gallery-counter" id="gallery-counter">1 / ${projet.images.length}</span>
                                    <button class="gallery-btn" id="next-btn"> Suivant   </button>
                                    </div>`
                            :
                            `<span class="gallery-counter" id="gallery-counter">1 / ${projet.images.length}</span>`
                        }` : `<p class="no-images-message">${no_images_message}</p>`
                    }
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
