import numpy as np
import matplotlib.pyplot as plt

# Initialisation des variables
init_cost = 3.738
cost_coef = 1.07
init_productivity = 1.67
capital = 10  # Capital initial (argent disponible)
time_step = 1  # Unité de temps, par exemple 1 minute
nb_gen = 1  # Nombre initial de générateurs
multipliers = 1  # Coefficient multiplicateur de productivité (initialement 1)

# Listes pour stocker les valeurs à afficher
times = [0]  # Temps initial (en minutes)
productions = [init_productivity * nb_gen * multipliers]  # Production initiale
capitals = [capital]  # Capital initial
costs = [init_cost * cost_coef ** nb_gen]  # Coût initial du générateur

# Fonction pour calculer le coût d'un générateur
def cost_of_generator(nb_gen):
    return init_cost * cost_coef ** nb_gen

# Fonction pour ajuster le multiplicateur en fonction du nombre de générateurs
def update_multiplier(nb_gen):
    if nb_gen >= 200:
        return 16  # Multiplicateur pour 200 générateurs
    elif nb_gen >= 100:
        return 8   # Multiplicateur pour 100 générateurs
    elif nb_gen >= 50:
        return 4   # Multiplicateur pour 50 générateurs
    elif nb_gen >= 25:
        return 2   # Multiplicateur pour 25 générateurs
    else:
        return 1   # Pas de multiplicateur pour moins de 25 générateurs

# Simulation du jeu
time = 0  # Initialisation du temps
while time < 3000:  # Limiter la simulation à 1000 minutes (par exemple)
    # Calcul de la production à chaque instant
    total_production = init_productivity * nb_gen * multipliers  # Production totale du moment
    
    # Accumuler la production au capital
    capital += total_production * time_step
    
    # Acheter un générateur si le capital est suffisant
    if capital >= cost_of_generator(nb_gen + 1):
        nb_gen += 1  # Acheter un générateur
        capital -= cost_of_generator(nb_gen)  # Réduire le capital du coût du générateur
        
        # Mettre à jour le multiplicateur en fonction du nombre de générateurs
        multipliers = update_multiplier(nb_gen)
    
    # Enregistrer les valeurs pour afficher les courbes
    time += time_step
    times.append(time)
    productions.append(total_production)
    capitals.append(capital)
    costs.append(cost_of_generator(nb_gen))

# Création de subplots pour afficher les 3 courbes sur un seul graphique
fig, ax1 = plt.subplots()

# Tracer la courbe de la production
ax1.plot(times, productions, label="Production", color="blue")
ax1.set_xlabel("Temps (minutes)")
ax1.set_ylabel("Production", color="blue")
ax1.tick_params(axis='y', labelcolor="blue")

# Création d'un deuxième axe pour le capital et le coût
ax2 = ax1.twinx()
ax2.plot(times, capitals, label="Capital", color="green")
ax2.set_ylabel("Capital", color="green")
ax2.tick_params(axis='y', labelcolor="green")

ax3 = ax1.twinx()  # Un autre axe pour le coût
ax3.spines['right'].set_position(('outward', 60))  # Décaler l'axe droit pour le coût
ax3.plot(times, costs, label="Coût des générateurs", color="red")
ax3.set_ylabel("Coût des générateurs", color="red")
ax3.tick_params(axis='y', labelcolor="red")

# Titre et légende
fig.suptitle("Simulation de l'Idle Game : Production, Capital, Coût")
fig.tight_layout()  # Pour éviter que les labels se chevauchent

# Affichage de la grille et de la légende
ax1.grid(True)
fig.legend(loc="upper left", bbox_to_anchor=(0.1,0.9))

# Affichage
plt.show()
