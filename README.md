# Unique network documentation

Based on vuepress v2: [v2.vuepress.vuejs.org](https://v2.vuepress.vuejs.org/)

Common process: get develop, create new branch, make changes, open PR to develop

How to start:

```shell
git fetch
git checkout develop
git pull
git checkout -b feature/my_branch
yarn
```

To start the server in develop mode:
```shell
yarn dev
```

To check the build in production mode:
```shell
yarn build && yarn serve
```
