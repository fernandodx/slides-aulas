<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { initFirebase } from "@/services/firebase.config";

onMounted(() => {
  initFirebase();
});
</script>

<style>
/* Global App Container */
</style>
