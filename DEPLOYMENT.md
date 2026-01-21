# Deployment Instructies

## Exporteren voor diva.summacollege.nl/lessen

De applicatie is geconfigureerd om te draaien op `diva.summacollege.nl/lessen` met een Supabase database voor centrale data opslag.

### Vereisten:

- Supabase account en project (al geconfigureerd)
- Webserver met ondersteuning voor SPA routing

### Stappen:

1. **Environment Variables configureren**:

   De applicatie gebruikt Supabase voor data opslag. Zorg ervoor dat de volgende environment variabelen beschikbaar zijn:

   ```bash
   VITE_SUPABASE_URL=https://ivhsjqkmeoldqtefllkp.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2aHNqcWttZW9sZHF0ZWZsbGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTE3MjEsImV4cCI6MjA4NDU2NzcyMX0.KnLMVcLosjy88FpwpMh1YWGQgMjz5bLu3EYZ3bo46x0
   ```

   **Let op**: Deze waarden zijn al ingebakken in de build, dus je hoeft ze niet opnieuw in te stellen op de server.

2. **Build de applicatie**:
   ```bash
   npm run build
   ```

3. **Upload de inhoud van de `dist` folder**:
   - Alle bestanden in de `dist` folder moeten worden geüpload naar de server
   - Upload naar de directory die correspondeert met `/lessen/` op je webserver
   - Zorg ervoor dat de mappenstructuur behouden blijft (vooral de `assets` folder)

4. **Server Configuratie**:
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

De applicatie gebruikt **Supabase** als centrale database voor:
- Lesmateriaal content (topics, lessons, parts)
- Bezoekersstatistieken (totaal pageviews, unieke bezoekers)
- Klikstatistieken per item

**Voordelen**:
- Alle bezoekers zien dezelfde content
- Statistieken worden centraal bijgehouden
- Wijzigingen in de admin interface zijn direct zichtbaar voor alle gebruikers
- Data blijft bewaard, ook als de browser cache wordt gewist

### Admin Toegang:

- Druk 7x op de "9" toets binnen 5 seconden om admin mode te activeren
- Admin wachtwoord is ingesteld in de applicatie
- In de admin interface kun je:
  - Content beheren (topics, lessons, parts toevoegen/bewerken/verwijderen)
  - Statistieken bekijken (bezoekers, clicks)
  - Alles wordt automatisch opgeslagen in de Supabase database

### Database Schema:

De volgende tabellen zijn aangemaakt in Supabase:
- `topics` - Onderwerpen/hoofdcategorieën
- `lessons` - Lessen binnen een onderwerp
- `parts` - Onderdelen binnen een les
- `stats` - Centrale bezoekersstatistieken
- `clicks` - Klikstatistieken per item

### Troubleshooting:

- Als de data niet laadt, controleer of de Supabase URL en API key correct zijn
- Bekijk de browser console voor eventuele foutmeldingen
- Zorg ervoor dat de Supabase database toegankelijk is (RLS policies zijn correct ingesteld)
