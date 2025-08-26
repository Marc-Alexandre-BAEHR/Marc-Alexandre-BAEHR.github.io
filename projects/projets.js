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

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/projects/projets.css";
document.head.appendChild(link);


const no_images_message = "Aucune image n'a été fournie pour ce projet.";


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

            // fonction qui affiche les détails du projet (donc la page à droite)

            function afficherDetails(projet, elementClique) {
                const details = document.getElementById('project-details');

                const allItems = document.querySelectorAll('.project-item');
                allItems.forEach(item => item.classList.remove('active-project'));

                elementClique.classList.add('active-project');

                details.innerHTML = `
                    <h2>${projet.nom}</h2>
                    <p><dt><strong>Description :        </dt></strong><dd>${projet.description.join("<br>")}</p></dd>
                    <p><dt><strong>Taille du groupe :   </dt></strong><dd> ${projet.equipe > 1 ? `${projet.equipe} pers.` : `Seul`}</p></dd>
                    <p><dt><strong>Technologies :       </dt></strong><dd>${projet.technologies.join(', ')}</p></dd>

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
                        }` : `< p class="no-images-message" > ${no_images_message} </p>`
                    }
                    </div>
                `;

                // mettre à jour l'url quand on a cliqué
                history.replaceState(null, null, `#${projet.id}`);

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

            // ouvrir le bon projet si y'a le hashtag dans l'url 
            // FONCTIONNE PAS POUR L'INSTANT
            // jsuis ;(

            const hash = location.hash.replace('#', '');
            if (hash) {
                console.log("hash :", hash);
                const projet = data.projets.find(p => p.id === hash);
                if (projet) {
                    console.log("projet :", projet);
                    const item = document.querySelector(`.project-item[data-id="${projet.id}"]`);
                    if (item)
                        afficherDetails(projet, item);
                }
            }
        });
});

