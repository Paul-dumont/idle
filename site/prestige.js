let angelInvestors = 0;
let totalCumulativeEarnings = 0; 
let sacrificedAngels = 0;

const DIVISOR = 10;
let angelInvestorEffectiveness = 0.02; // Initial effectiveness

function calculerInvestisseurs(lifetimeEarnings, previousEarnings, divisor) {
    const newAngels = Math.floor(Math.sqrt(lifetimeEarnings / divisor));
    const previousAngels = Math.floor(Math.sqrt(previousEarnings / divisor));
    return Math.max(0, newAngels - previousAngels);
}

function updateAnges() {
    document.getElementById("ange_count").textContent = angelInvestors;
    document.getElementById("ange_bonus").textContent = (angelInvestors * 2) + "%";
    document.getElementById("previous_earnings").textContent = previousEarnings.toFixed(2);
    document.getElementById("total_cumulative_earnings").textContent = totalCumulativeEarnings.toFixed(2);
}

function resetJeu() {
    const nouveauxAnges = calculerInvestisseurs(lifetimeEarnings, previousEarnings, DIVISOR);
    angelInvestors += nouveauxAnges;

    // Ajouter les gains de la session actuelle au total cumulé
    totalCumulativeEarnings += lifetimeEarnings;

    // Réinitialiser les gains de la session
    previousEarnings = lifetimeEarnings;
    lifetimeEarnings = 0;

    // Réinitialiser les générateurs et le capital
    generateurs.forEach(gen => {
        gen.niveau = 0;
        gen.temps = gen.tempsInitial;  // Réinitialisation de la durée du cycle à la valeur initiale

        // Arrête la production en supprimant les timers actifs
        if (gen.timerId !== null) {
            clearInterval(gen.timerId);
            gen.timerId = null; // Réinitialise le timerId
        }
    });

    capital = 5;

    updateAffichageCycle(); // Mise à jour de l'affichage du capital et des anges potentiels
    updateAnges(); // Mise à jour de l'affichage des informations sur les anges
    init();
}

function calculerMultiplicateur() {
    return 1 + (angelInvestors * angelInvestorEffectiveness); // Use the updated effectiveness
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

function init() {
    loadGameData();
    const generateursContainer = document.getElementById("generateurs-container");

    // ...existing code...

    // Met à jour les informations globales
    updateAffichageCycle();
    updateAnges();
    initUpgrades();
}

