# Démarche DevOps – Projet Pawbook

---

## 1. Organisation du développement

### Gestion de projet 🗃️

Outil : Trello

Colonnes utilisées : Backlog, Sprint en cours, Sprint +1, En cours, En pause, Terminé, et une colonne mensuelle regroupant tous les tickets terminés du mois.

Chaque tâche est un ticket, déplacé de En cours → Terminé une fois finalisé. Chaque fin de mois, tous les tickets terminés vont dans la colonne du mois.

Les sprints permettent de planifier et prioriser le travail sur une période donnée.

### Branches GitHub 🌿

Branches utilisées :
- main → réserve pour la future version stable.
- developement → branche principale de développement (actuellement tout y est centralisé).
- production → pour le déploiement.

Processus :
- Développement sur developement.
- Une fois prête pour mise en production → merge vers production.

### Commits ✅

Les commits sont atomiques (un commit = une modification cohérente).

Les messages de commit sont explicites et décrivent précisément l’action.

Exemples :

- install tsconfig-paths & update package.json in server side + fix infrastructure
- Create validation schema with zod for login

### Tests unitaires 🧪

Philosophie : écrire les tests avant la feature (TDD), afin de valider les comportements attendus.

Exemple : tests pour la fonction login dans authServices.

```typescript
describe("1/ Login", () => {
    it("should return an error if email is missing", async () => {
        const invalidCredentials = { email: "", password: "password123" };

        await expect(authServices.login(invalidCredentials))
            .rejects
            .toThrow("E-mail et mot de passe requis");
    })

    it("should return an error if password is missing", async () => {
        const invalidCredentials2 = { email: UnitUser.john.email, password: "" };

        await expect(authServices.login(invalidCredentials2))
            .rejects
            .toThrow("E-mail et mot de passe requis");
    })

    it("should return an error if user is not found", async () => {
        const nonExistentUser: LoginDto = {
            email: "unknown@example.com",
            password: "password123"
        };

        await expect(authServices.login(nonExistentUser))
            .rejects
            .toThrow("Pas de compte trouvé pour cet e-mail");
    })

    it("should return an error if password is incorrect", async () => {
        const wrongPasswordCredentials: LoginDto = {
            email: UnitUser.john.email,
            password: "wrongpassword"
        };

        await expect(authServices.login(wrongPasswordCredentials))
            .rejects
            .toThrow("Mot de passe invalide");
    })

    it("should return a JWT token if credentials are correct", async () => {
        const payload = jwt.decode(validTestToken) as any;

        expect(payload.id).toBe(UnitUser.john.id);
        expect(payload.email).toBe(UnitUser.john.email);
        expect(payload.role).toBe("USER");
    })
});
```

Exemple de fonction testée (login dans authServices) :
```typescript
async login(credentials: LoginDto): Promise<string> {
    if (!credentials.email || !credentials.password) {
        throw new Error("E-mail et mot de passe requis");
    }

    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
        console.error("[AuthService] Aucun utilisateur trouvé pour:", credentials.email);
        throw new Error("Pas de compte trouvé pour cet e-mail");
    }

    const isPasswordValid = await this.argon2Services.verifyPassword(
        credentials.password,
        user.password,
    );

    if (!isPasswordValid) {
        throw new Error("Mot de passe invalide");
    }

    const token = this.jwtAuthService.generateToken({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        name: user.name,
        role: user.role,
    });

    return token;
}
```
---

## 2. Conteneurisation

Le projet Pawbook est entièrement conteneurisé avec Docker afin de garantir un environnement homogène entre le développement et la production.

### Dockerfile – Frontend (Svelte 5) 🐋

- Utilisation de node:20-alpine.
- Installation via pnpm.
- Copie des dépendances et du code client.
- Lancement en mode développement (pnpm dev).

### Dockerfile – Backend (Node.js / Express / TypeScript) 🐋

- Même base (node:20-alpine).
- Installation via pnpm.
- Copie des sources du serveur.
- Exposition du port 3000.
- Lancement en mode développement (pnpm dev).

### Docker-compose 🐳

Définit deux services :
- api (backend – port 3000)
- client (frontend – port 5173)
- Utilisation des fichiers .env.
- Montage de volumes pour permettre le hot-reload pendant le développement.
- Dépendances explicites (client dépend de api).

---


## 3. Pipelines CI/CD

### Objectifs

- Automatiser le cycle de vie du projet (tests, build, déploiement).
- Assurer la qualité du code avant chaque mise en production.
- Standardiser le process de déploiement pour éviter les erreurs manuelles.

### Choix : CircleCI

#### Raisons :
- Indépendant de GitHub (contrairement à GitHub Actions).
- Moins complexe que Jenkins, mais suffisamment robuste.
- Intégration simple avec Docker.

#### Exemple de pipeline envisagé

| Phase               | Actions réalisées                                                                                                                                                      |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Build 🛠️           | Installation des dépendances avec pnpm.<br/>Lancement du build front & back                                                                                            |
| Test 👩‍🔬          | Exécution des tests unitaires (jest)<br/>Vérification de la couverture de code                                                                                         |
| Conteneurisation 🐳 | Build des images Docker (client et api)                                                                                                                                |
| Déploiement 🍾      | Push des images vers un registre Docker (DockerHub ou GitHub Container Registry)<br/>Déploiement sur l’infrastructure cible via docker-compose ou Kubernetes (à venir) |