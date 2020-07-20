<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Download YouTube video</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="mdi-music-note"
                    type="url"
                    v-model="URL"
                    :rules="URLRules"
                  ></v-text-field>

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="download">Download</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// @ is an alias to /sr
import SocketIO from "socket.io-client"

export default {
  name: "Home", 
  data() {
    return {
      URL: "",
      URLRules: [
        v => !!v || 'The video URL is required',
        // eslint-disable-next-line
        v => /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v) || `This isn't a YouTube URL`,
      ],
      socket: {},
      connected: false
    }
  },
  methods: {
    download() {
      if(!this.$refs.form.validate()) return;
      this.socket.emit("download", this.URL)
      this.socket.on("progress", console.log)

    }
  },
  created() {
    this.socket = SocketIO("http://localhost:4000")
    this.socket.on("connect", () => this.connected = true)
  }
};
</script>
