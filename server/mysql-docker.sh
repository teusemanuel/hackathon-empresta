# Backup
docker-compose exec mysql /usr/bin/mysqldump -u root --password=admin empresta > backup-initial.sql

# Restore
docker-compose exec -T mysql /usr/bin/mysql -u root --password=admin empresta < backup-initial.sql
