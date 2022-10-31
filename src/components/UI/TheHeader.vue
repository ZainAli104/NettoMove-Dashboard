<template>
  <header>
    <nav>
      <h1>
        Authentication
      </h1>
      <ul>
        <li>
          <router-link to="/home" v-if="isLoggedIn">Home</router-link>
        </li>
        <!-- <li v-if="!isLoggedIn">
            <router-link to="/auth">SignIn</router-link>
        </li>
        <li v-else>
            <router-link to="/auth" @click="logOut">Logout</router-link>
        </li> -->
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('logOut');
      this.$router.replace('/auth');
    }
  }
};
</script>

<style scoped>
header {
  width: 100%;
  height: 4rem;
  background-color: #3d008d;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, rgb(58, 195, 177), rgb(47, 208, 111));
  /* background: linear-gradient(to right, #ff4b2b, #ff416c); */
}

header a {
  text-decoration: none;
  /* color: #f391e3; */
  color: white;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
}

a:active,
a:hover,
a.router-link-active {
  /* border: 1px solid #f391e3; */
  border: 1px solid white;
  border-radius: 30px;

}

h1 {
  margin: 0;
  color: white;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>