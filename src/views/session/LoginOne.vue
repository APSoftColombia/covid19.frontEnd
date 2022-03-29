<template>
  <v-container
      fluid
      style="height: 100% !important; background-color: white !important;"
  >
    <v-row
        style="height: 100% !important;"
        justify="center"
        align="center"
    >
      <v-col
          v-if="$vuetify.breakpoint.smAndUp && datos && datos.imagen_inicio !== 'logoSucre.png'"
          cols="12"
          sm="6"
      >
        <v-row
            style="height: 100% !important;"
            justify="center"
            align="center"
        >
          <v-card
              v-if="imagenName"
              class="transparent"
              flat
          >
            <v-responsive :aspect-ratio="3/4">
              <v-img :src="`/static/logos/aspect3-4/${imagenName}`" />
            </v-responsive>
            <app-section-loader
                style="z-index: 10 !important;"
                :status="loading"
            />
          </v-card>
        </v-row>
      </v-col>
      <v-col
          cols="12"
          class="mx-auto"
          sm="8"
          md="6"
          lg="4"
      >
        <div class="session-table-cell text-center">
          <div class="session-content">
            <img
                :src="`/static/logos/logo_apsoft.png`"
                class="img-responsive mb-2 rounded"
                width="80%"
            />
            <h2 class="mb-4">Inicio de sesión</h2>
            <p class="fs-14">Ingrese nombre de usuario y contraseña para acceder.</p>
            <ValidationObserver
                class="mb-5"
                ref="observer"
                v-slot="{ invalid, validated, passes, validate }"
                tag="form"
                autocomplete="off"
                @submit.prevent="signIn"
            >
              <ValidationProvider
                  name="nombre de usuario"
                  rules="required"
                  v-slot="{ errors, valid }"
              >
                <v-text-field
                    label="Nombre de Usuario"
                    outlined
                    v-model="email"
                    :success="valid"
                    :error-messages="errors"
                />
              </ValidationProvider>
              <ValidationProvider
                  name="contraseña"
                  rules="required"
                  v-slot="{ errors, valid }"
              >
                <v-text-field
                    label="Contraseña"
                    outlined
                    v-model="password"
                    :success="valid"
                    :error-messages="errors"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                />
              </ValidationProvider>
              <v-checkbox
                  color="primary"
                  label="Recordarme"
                  v-model="checkbox"
              />
              <div>
                <v-btn
                    large
                    block
                    class="mb-2"
                    type="submit"
                    color="primary"
                    :loading="loading"
                >
                  Iniciar sesión
                </v-btn>
              </div>
            </ValidationObserver>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppConfig from 'Constants/AppConfig'
import Vue from 'vue'

export default {
  name: 'Login',
  data: () => ({
    datos: null,
    loading: false,
    showPassword: false,
    checkbox: false,
    email: null,
    password: null,
    imagenName: null,
    appLogo: AppConfig.appLogo2,
    brand: AppConfig.brand
  }),
  created() {
    window.FreshworksWidget('hide')
    this.getDatosEmpresa()
  },
  methods: {
    getDatosEmpresa() {
      this.loading = true
      Vue.axios.get(`${Vue.axios.defaults.baseURL.includes('api') ? '' : 'api/'}configuraciones`)
          .then(response => {
            this.imagenName = response.data.imagen_inicio
            this.datos = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: 'al recuperar los datos de empresa.',
              error: error
            })
          })
    },
    signIn() {
      this.$refs.observer.validate().then(result => {
        if (result) {
          this.loading = true
          this.$store.dispatch('signIn', {username: this.email, password: this.password})
              .then(() => {
                this.loading = false
              })
        }
      })
    }
  }
}
</script>