// Propriétés des générateurs 
const generateurs = [
    { nom: "Sablier Régressif", cout: 3.738, coeff: 1.07, temps: 0.6, tempsInitial: 0.6, revenu: 1, prod: 1.67, niveau: 0, multiple: 1, timerId: null },
    { nom: "Horloge Inversée", cout: 60, coeff: 1.15, temps: 3, tempsInitial: 3, revenu: 60, prod: 20, niveau: 0, multiple: 1, timerId: null },
    { nom: "Montre Rétrogradable", cout: 720, coeff: 1.14, temps: 6, tempsInitial: 6, revenu: 540, prod: 90, niveau: 0, multiple: 1, timerId: null },
    { nom: "Déchronomètre", cout: 8640, coeff: 1.13, temps: 12, tempsInitial: 12, revenu: 4320, prod: 360, niveau: 0, multiple: 1, timerId: null },
    { nom: "Turbine Chronologique", cout: 103680, coeff: 1.12, temps: 24, tempsInitial: 24, revenu: 51840, prod: 2160, niveau: 0, multiple: 1, timerId: null },
    { nom: "Téléporteur Fluctuant", cout: 1244160, coeff: 1.11, temps: 96, tempsInitial: 96, revenu: 622080, prod: 6480, niveau: 0, multiple: 1, timerId: null },
    { nom: "Puits Perpétuel ", cout: 14929920, coeff: 1.10, temps: 384, tempsInitial: 384, revenu: 7464960, prod: 19440, niveau: 0, multiple: 1, timerId: null },
    { nom: "tunnel Eternelle", cout: 179159040, coeff: 1.09, temps: 1536, tempsInitial: 1536, revenu: 89579520, prod: 58320, niveau: 0, multiple: 1, timerId: null },
    { nom: "Faille Chronologique", cout: 2149908480, coeff: 1.08, temps: 6144, tempsInitial: 6144, revenu: 1074954240, prod: 174960, niveau: 0, multiple: 1, timerId: null },
    { nom: "portail Absolu", cout: 25798901760, coeff: 1.07, temps: 36864, tempsInitial: 36864, revenu: 29668737024, prod: 804816, niveau: 0, multiple: 1, timerId: null }
];

let capital = 5; // Capital initial
let lifetimeEarnings = 0;
let previousEarnings = 0;

const capital_element = document.getElementById("capital");

function convertirEnTemps(capital) { 
    const secondesParMillenaire = 1000 * 365.25 * 86400; // Secondes dans un millénaire
    const secondesParSiecle = 100 * 365.25 * 86400; // Secondes dans un siècle
    const secondesParAn = 365.25 * 86400; // Secondes dans une année
    const secondesParMois = 30.44 * 86400; // Secondes dans un mois moyen
    const secondesParJour = 86400; // Secondes dans un jour
    const secondesParHeure = 3600; // Secondes dans une heure
    const secondesParMinute = 60; // Secondes dans une minute

    // Calcul des différentes unités
    const millenaires = Math.floor(capital / secondesParMillenaire);
    capital %= secondesParMillenaire;

    const siecles = Math.floor(capital / secondesParSiecle);
    capital %= secondesParSiecle;

    const années = Math.floor(capital / secondesParAn);
    capital %= secondesParAn;

    const mois = Math.floor(capital / secondesParMois);
    capital %= secondesParMois;

    const jours = Math.floor(capital / secondesParJour);
    capital %= secondesParJour;

    const heures = Math.floor(capital / secondesParHeure);
    capital %= secondesParHeure;

    const minutes = Math.floor(capital / secondesParMinute);
    const secondes = Math.floor(capital % secondesParMinute);

    // Construction dynamique de la liste des grandeurs disponibles
    const grandeurs = [];
    if (millenaires > 0) grandeurs.push({ label: 'millénaire(s)', valeur: millenaires });
    if (siecles > 0) grandeurs.push({ label: 'siècle(s)', valeur: siecles });
    if (années > 0) grandeurs.push({ label: 'année(s)', valeur: années });
    if (mois > 0) grandeurs.push({ label: 'mois', valeur: mois });
    if (jours > 0) grandeurs.push({ label: 'jour(s)', valeur: jours });
    if (heures > 0) grandeurs.push({ label: 'heure(s)', valeur: heures });
    if (minutes > 0) grandeurs.push({ label: 'minute(s)', valeur: minutes });
    if (secondes > 0 || grandeurs.length === 0) grandeurs.push({ label: 'seconde(s)', valeur: secondes });

    // Limiter à trois grandeurs (en priorité du plus grand au plus petit)
    const resultat = grandeurs.slice(0, 3).map(g => `${g.valeur} ${g.label}`);
    return resultat.join(', ');
}

function updateProgressBar(capital) {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    // Calcul du pourcentage en échelle logarithmique
    const maxLog = 308; // Correspond à e308
    const progress = Math.log10(capital) / maxLog * 100;

    // Mise à jour de la barre et du texte
    progressBar.style.width = `${Math.min(progress, 100)}%`; // Limite à 100%
    progressText.textContent = `${progress.toFixed(2)}%`;

    // Affichage d'un message lorsque 100% est atteint
    if (progress >= 100) {
        progressText.textContent = "∞ (Progression terminée)";
    }
}


function updateAffichageCycle() {
    capital_element.textContent = convertirEnTemps(capital);
    document.getElementById("anges_potentiels").textContent = calculerInvestisseurs(lifetimeEarnings, previousEarnings, DIVISOR);
    updateProgressBar(capital)
    generateurs.forEach((generateur, index) => {
        mettreAJourGenerateur(index);
    });

}


// Calcule le coût actuel du générateur en fonction de son niveau
function cost_gen(generateur) {
    return generateur.cout * Math.pow(generateur.coeff, generateur.niveau);
}

// Achète un générateur
function acheterGenerateur(index) {
    const generateur = generateurs[index];
    const coutActuel = cost_gen(generateur);

    if (capital >= coutActuel) {
        capital -= coutActuel;
        generateur.niveau++;
        ajusterTempsCycle(generateur);
        lancerProduction(generateur);

        // Mise à jour ciblée après achat
        mettreAJourGenerateur(index);
        updateAffichageCycle();
    }
}


// Fonction qui ajuste le temps de cycle en fonction du niveau
function ajusterTempsCycle(generateur) {
    // Vérifie si le niveau a atteint un palier spécifique et ajuste le temps en conséquence
    if (generateur.niveau === 25 || generateur.niveau === 50 || generateur.niveau === 100 || generateur.niveau === 200 || generateur.niveau === 400) {
        generateur.temps /= 2;  // Divise le temps de cycle par 2
    }
}


function lancerProduction(generateur) {
    // Arrête un timer existant s'il y en a un
    if (generateur.timerId !== null) {
        clearInterval(generateur.timerId);
    }

    const revenuParCycle = generateur.revenu * generateur.niveau * calculerMultiplicateur();

    // Démarre un nouveau timer pour la production
    generateur.timerId = setInterval(() => {
        if (generateur.niveau > 0) { // Ne produit que si le niveau est supérieur à 0
            capital += revenuParCycle;
            lifetimeEarnings += revenuParCycle;
            updateAffichageCycle();
        }
    }, generateur.temps * 1000);
}

function creerGenerateurDepuisTemplate(generateur, index) {
    const template = document.getElementById("template-generateur");
    const clone = template.content.cloneNode(true);

    // Remplit les données spécifiques du générateur
    clone.querySelector(".nom").textContent = generateur.nom;
    clone.querySelector(".niveau").textContent = generateur.niveau;
    clone.querySelector(".production").textContent = (generateur.prod * generateur.niveau).toFixed(2);
    clone.querySelector(".temps").textContent = generateur.temps.toFixed(2);

    // Configure le bouton pour afficher uniquement le prix
    const bouton = clone.querySelector(".acheter-btn");
    bouton.id = `generateur${index}`;
    bouton.textContent = convertirEnTemps(cost_gen(generateur));
    bouton.addEventListener("click", () => acheterGenerateur(index));

    return clone;
}

function mettreAJourBouton(capital, costgen, bouton) {
    if (capital >= costgen) {
        bouton.classList.remove("inactif"); // Retirer la classe inactif
        bouton.classList.add("actif"); // Ajouter la classe actif
        // bouton.textContent = "Acheter"; // Texte actif
    } else {
        bouton.classList.remove("actif"); // Retirer la classe actif
        bouton.classList.add("inactif"); // Ajouter la classe inactif
        // bouton.textContent = "Capital insuffisant"; // Texte inactif
    }
}

function mettreAJourGenerateur(index) {
    const generateur = generateurs[index];
    const generateurElement = document.getElementById(`generateur${index}`).closest(".generateur");

    // Mise à jour des informations spécifiques
    generateurElement.querySelector(".niveau").textContent = generateur.niveau;
    generateurElement.querySelector(".production").textContent = (generateur.prod * generateur.niveau).toFixed(2);
    generateurElement.querySelector(".temps").textContent = generateur.temps.toFixed(2);

    // Mise à jour du texte du bouton pour afficher uniquement le prix
    const bouton = generateurElement.querySelector(".acheter-btn");
    bouton.textContent = convertirEnTemps(cost_gen(generateur));
    mettreAJourBouton(capital, cost_gen(generateur), bouton);
}

const upgrades = [
    { name: "Angel Sacrifice", business: "All Businesses", price: 10000, description: "All profits x3", reference: "26,861 (40,000)", effect: () => { applyUpgrade("Angel Sacrifice"); } },
    { name: "Angelic Mutiny", business: "Angel Investor", price: 100000, description: "Angel Investor Effectiveness +2%", reference: "727,492 (800,000)", effect: () => { applyUpgrade("Angelic Mutiny"); } },
    { name: "Angelic Rebellion", business: "Angel Investor", price: 100000000, description: "Angel Investor Effectiveness +2%", reference: "1.029 Billion", effect: () => { applyUpgrade("Angelic Rebellion"); } }
];

function applyUpgrade(upgradeName) {
    switch (upgradeName) {
        case "Angel Sacrifice":
            generateurs.forEach(gen => gen.revenu *= 3);
            break;
        case "Angelic Mutiny":
            angelInvestorEffectiveness += 0.02;
            break;
        case "Angelic Rebellion":
            angelInvestorEffectiveness += 0.02;
            break;
    }
    updateAffichageCycle();
}

function creerUpgradeDepuisTemplate(upgrade, index) {
    const template = document.getElementById("template-upgrade");
    const clone = template.content.cloneNode(true);

    // Remplit les données spécifiques de l'upgrade
    clone.querySelector(".name").textContent = upgrade.name;
    clone.querySelector(".business").textContent = upgrade.business;
    clone.querySelector(".price").textContent = upgrade.price;
    clone.querySelector(".description").textContent = upgrade.description;
    clone.querySelector(".reference").textContent = upgrade.reference;

    // Configure le bouton pour acheter l'upgrade
    const bouton = clone.querySelector(".acheter-upgrade-btn");
    bouton.id = `upgrade${index}`;
    bouton.addEventListener("click", () => acheterUpgrade(index));

    return clone;
}

function acheterUpgrade(index) {
    const upgrade = upgrades[index];
    if (angelInvestors >= upgrade.price) {
        angelInvestors -= upgrade.price;
        upgrade.effect();
        updateAnges();
    }
}

function initUpgrades() {
    const upgradesContainer = document.getElementById("upgrades-container");

    // Vide le conteneur pour éviter les doublons
    upgradesContainer.innerHTML = "";

    upgrades.forEach((upgrade, index) => {
        const upgradeElement = creerUpgradeDepuisTemplate(upgrade, index);
        upgradesContainer.appendChild(upgradeElement);
    });
}

function saveGameData() {
    const gameData = {
        angelInvestors,
        totalCumulativeEarnings,
        sacrificedAngels,
        lifetimeEarnings,
        previousEarnings,
        capital,
        generateurs: generateurs.map(gen => ({
            niveau: gen.niveau,
            temps: gen.temps,
            timerId: gen.timerId
        }))
    };
    localStorage.setItem('idleGameData', JSON.stringify(gameData));
}

function loadGameData() {
    const savedData = localStorage.getItem('idleGameData');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        angelInvestors = gameData.angelInvestors;
        totalCumulativeEarnings = gameData.totalCumulativeEarnings;
        sacrificedAngels = gameData.sacrificedAngels;
        lifetimeEarnings = gameData.lifetimeEarnings;
        previousEarnings = gameData.previousEarnings;
        capital = gameData.capital;
        generateurs.forEach((gen, index) => {
            gen.niveau = gameData.generateurs[index].niveau;
            gen.temps = gameData.generateurs[index].temps;
            gen.timerId = gameData.generateurs[index].timerId;
        });
    }
}

window.addEventListener('beforeunload', saveGameData);

// Initialisation de l'interface
function init() {
    loadGameData();
    const generateursContainer = document.getElementById("generateurs-container");

    // Vide le conteneur pour éviter les doublons
    generateursContainer.innerHTML = "";

    generateurs.forEach((generateur, index) => {
        const generateurElement = creerGenerateurDepuisTemplate(generateur, index);
        generateursContainer.appendChild(generateurElement);
        mettreAJourGenerateur(index);
    });

    // Met à jour les informations globales
    updateAffichageCycle();
    updateAnges();
    initUpgrades();
}

// Initialisation de l'interface
init();
