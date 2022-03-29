<template>
  <v-dialog
      v-model="dialog"
      max-width="500"
  >
    <v-card class="pa-4">
      <ValidationObserver
          ref="formChangePassword"
          v-slot="{ invalid, validated, passes, validate }"
          tag="form"
          autocomplete="off"
          @submit.prevent="submit"
      >
        <v-card-title class="headline px-0 pt-0">{{ heading }}</v-card-title>
        <v-card-text class="px-0 pt-0">
          Digite la nueva contraseña del usuario <strong>{{ name }}</strong>.
          <v-row>
            <v-col cols="12">
              <ValidationProvider
                  name="Contraseña"
                  :rules="{minlength:8, required: true, regex:password}"
                  v-slot="{ errors, valid }"
              >
                <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    dense
                    outlined
                    label="Contraseña"
                    :error-messages="errors"
                    :autocomplete="false"
                    @click:append="showPassword = !showPassword"
                />
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-btn
              :color="colorCancel"
              @click="close"
          >
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn
              :color="colorConfirm"
              type="submit"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
        <app-section-loader :status="loading" />
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmChangePassword',
  props: {
    heading: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    colorConfirm: {
      type: String,
      default: 'primary'
    },
    colorCancel: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      password: null,
      showPassword: false,
    }
  },
  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.$emit('cancel')
    },
    submit() {
      this.$refs.formChangePassword.validate().then(result => {
        if (result) {
          this.$emit('confirm', this.password)
        }
      })
    }
  }
}
</script>
