aws sso login

export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --region us-east-2 --domain jumpcloud-artifacts --domain-owner 642920845081 --query authorizationToken --output text`

aws codeartifact login \
  --tool npm \
  --repository jumpcloud-node-modules \
  --domain jumpcloud-artifacts \
  --domain-owner 642920845081 \
  --region us-east-2

pnpm install