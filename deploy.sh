#!/bin/bash
DEPLOY_PATH=deploy_folder
HEROKU_APP_NAME=appcashflow
INIT_DIR=`pwd`
rm -rf ../$DEPLOY_PATH
mkdir -p ../$DEPLOY_PATH

cd api

for i in *
do
  case "$i" in
      node_modules|"")
      echo "$i ignorado!"    
    ;;
      *)
        `cp -r $i ../../$DEPLOY_PATH/$i`
      ;;
  esac
done

cd ../..
cd $DEPLOY_PATH
git init
heroku git:remote -a $HEROKU_APP_NAME
git add .
git commit -m "Deploy "`date +%s`
git push -f heroku master
cd ..
rm -rf $DEPLOY_PATH
echo "Publicado!"

# rsync -av
# echo "Deploying to Heroku app $HEROKU_APP_NAME ..."
# echo 'Comprimindo arquivos...'
# cd api
# tar --exclude=node_modules -zcf deploy.tar.gz *
# echo 'OK!'
# cd ..
# mv api/deploy.tar.gz .

# echo 'Enviando arquivos...'
# URL_BLOB=`curl -s -n -X POST https://api.heroku.com/apps/$HEROKU_APP_NAME/sources \
# 	-H 'Accept: application/vnd.heroku+json; version=3' \
# 	-H "Authorization: Bearer $HEROKU_API_KEY"`

# PUT_URL=`echo $URL_BLOB | python -c 'import sys, json; print(json.load(sys.stdin)["source_blob"]["put_url"])'`
# GET_URL=`echo $URL_BLOB | python -c 'import sys, json; print(json.load(sys.stdin)["source_blob"]["get_url"])'`

# curl $PUT_URL  -X PUT -H 'Content-Type:' --data-binary @deploy.tar.gz

# REQ_DATA="{\"source_blob\": {\"url\":\"$GET_URL\", \"version\": \"$HEROKU_VERSION\"}}"

# BUILD_OUTPUT=`curl -s -n -X POST https://api.heroku.com/apps/$HEROKU_APP_NAME/builds \
# 	-d "$REQ_DATA" \
# 	 -H 'Accept: application/vnd.heroku+json; version=3' \
# 	 -H "Content-Type: application/json" \
# 	 -H "Authorization: Bearer $HEROKU_API_KEY"`
# STREAM_URL=`echo $BUILD_OUTPUT | python -c 'import sys, json; print(json.load(sys.stdin)["output_stream_url"])'`
# echo 'passou aki'

# curl $STREAM_URL
# rm deploy.tar.gz