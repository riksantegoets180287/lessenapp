# Deployment Instructies

## Exporteren voor diva.summacollege.nl/lessen

De applicatie is geconfigureerd om te draaien op `diva.summacollege.nl/lessen`.

### Stappen:

1. **Build de applicatie** (al gedaan):
   ```bash
   npm run build
   ```

2. **Upload de inhoud van de `dist` folder**:
   - Alle bestanden in de `dist` folder moeten worden geüpload naar de server
   - Upload naar de directory die correspondeert met `/lessen/` op je webserver
   - Zorg ervoor dat de mappenstructuur behouden blijft (vooral de `assets` folder)

3. **Server Configuratie**:
   - De app is een Single Page Application (SPA)
   - Configureer je webserver om alle requests naar `/lessen/*` door te sturen naar `/lessen/index.html`

   **Voor Apache (.htaccess in /lessen/ folder)**:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /lessen/
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /lessen/index.html [L]
   </IfModule>
   ```

   **Voor Nginx**:
   ```nginx
   location /lessen/ {
     try_files $uri $uri/ /lessen/index.html;
   }
   ```

### Bestanden om te uploaden:

- `dist/index.html` → `/lessen/index.html`
- `dist/assets/*` → `/lessen/assets/*`

### Test de deployment:

Na upload, bezoek: `https://diva.summacollege.nl/lessen`

### Data Opslag:

De applicatie gebruikt localStorage in de browser voor:
- Lesmateriaal content
- Bezoekersstatistieken
- Admin sessies

Geen database of server-side opslag nodig.

### Admin Toegang:

- Druk 7x op de "9" toets binnen 5 seconden om admin mode te activeren
- Admin wachtwoord is ingesteld in de applicatie
