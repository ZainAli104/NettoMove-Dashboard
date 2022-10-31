<template>
    <h2>System Setting</h2>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('changeTitle', 'System Setting');
  },
};
</script>
