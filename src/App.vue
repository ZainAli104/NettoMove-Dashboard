<template>
  <router-view />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");
* {
  box-sizing: border-box;
}

body {
  background: #f6f5f7;
  font-family: "Montserrat", sans-serif;
  height: 100vh;
  margin: 0px 0 0px;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
