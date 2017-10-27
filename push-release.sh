set -e

git config --global user.email "ghlndsl@126.com"
git config --global user.name "gaohailang ci"
git checkout -b master
git add .
git commit -m "Update Data"
ssh-agent bash -c 'ssh-add ~/.ssh/id_rsa_6aa6ace89eee7def1892940bb02c3482;git push -f origin master'


# cdup=$(git rev-parse --show-cdup)
# if [ "$cdup" != '' ]
# then
#     git init
#     git remote --fetch add origin "$remote"
# fi
#
# if git rev-parse --verify origin/release-frontend > /dev/null 2>&1
# then
#     git checkout release-frontend
# else
#     git checkout --orphan release-frontend
# fi
