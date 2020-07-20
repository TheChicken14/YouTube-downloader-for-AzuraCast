<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1>AzuraCast YouTube downloader</h1>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>
