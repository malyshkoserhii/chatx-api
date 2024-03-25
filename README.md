sudo lsof -i :5432
sudo kill -9 293  
sudo lsof -i -P | grep LISTEN | grep :5432
docker-compose up -d
npx prisma migrate dev --create-only
npx prisma db push
npx prisma studio
