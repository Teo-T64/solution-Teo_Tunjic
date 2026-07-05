# Solution-Teo_Tunjic

FullStack zadatak

Pokretanje projekta:
+ Napravite prazan direktorij proizvoljnog imena, downloadajte repozitorij kao ZIP ili klonirajte u tekući ditektorij

```git clone https://github.com/Teo-T64/solution-Teo_Tunjic.git```

+ Backend je deployan uz pomoć platforme Render (free instanca - spori odgovori)
+ Za frontend potrebno je ući u direktorij i naredbom ```npm install``` instalirati potrebne pakete za aplikaciju
+ Za kreiranje dist foldera koristite narebu ```npm run build```
+ Frontend je također deployan uz pomoć platforme Netlify, link je ```https://solutionabysalto.netlify.app```, kako biste vidjeli aplikaciju logirajte se kao postojeći user.

```
username : michaelw
password: michaelwpass
```
+ Sadržaj ```.env``` file-a je ```VITE_BACKEND_URL = link s rendera```

Dokumentirani endpointovi u backendu:
+ ```/api/auth/login``` -> Logiranje korisnika
+ ```/api/auth/me``` -> Dohvaćanje podataka o korisniku
+ ```/api/favorites``` -> Dohvaćanje korisnikovih omiljenih proizvoda
+ ```/api/favorites/{id}``` -> Brisanje/dodavanje omiljenog proizvoda
+ ```/api/products``` -> Dohvaćanje proizvoda
+ ```/api/products/{id}``` -> Dohvaćanje detalja za pojedini proizvod
+ ```/api/products/filter``` -> Filtriranje proizvoda
+ ```/api/products/search``` -> Pretraga proizvoda

Korišteni AI alat je Google Gemini, nema specfičnog tehnike promptinga, već je korišten za poboljšanje frontend koda za TanStack Query i stiliziranje aplikacije, u backendu za provjeru točnosti koda.
