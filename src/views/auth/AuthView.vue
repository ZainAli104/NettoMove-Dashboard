<template>
  <div>
    <the-header></the-header>
    <sign-up></sign-up>
  </div>
</template>

<script>
import TheHeader from "../../components/UI/TheHeader.vue";
import SignUp from "./signUp";

export default {
  components: {
    TheHeader,
    SignUp,
  },
};
</script>