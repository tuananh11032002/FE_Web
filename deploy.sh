echo "Switching to branch master"
git checkout main

echo "Build app ..."
npm run build

echo "Deploy app ..."
scp -r build/* root@112.78.1.194:/var/www/html/misaproject.click/

echo "Done!"