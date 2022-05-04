# Postgres SQL

## Init

- Se connecter avec l’admin à la bdd `psql postgres`
- créer user `CREATE ROLE bgf WITH LOGIN PASSWORD 'bgf';`
- créer  `CREATE DATABASE bgf OWNER bgf;`
    - `\l`lister  
    - `DROP DATABASE bgf` supprimer 


## Feed DB
alimenter la bdd avec un fichier *.sql*
    `psql -U etudiant -d ma_bdd -f ./data/create_db.sql`
    `psql -U oquiz -d oquiz -f ./data/migration_user.sql`
    `psql -U okanban -d okanban -f ./data/create_db.sql`
    `psql -U ocolis -d ocolis -f ./ocolis.sql`






