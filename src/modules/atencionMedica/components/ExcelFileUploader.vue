<template>
  <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="1020px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="green"
          dark
          v-bind="attrs"
          v-on="on"
      >
        <v-icon class="mr-1">mdi-file-excel</v-icon>
        Gestionar archivo
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar
              color="green"
          >
            <v-icon class="white--text">mdi-file-excel</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
                class="title"
            >
              Gestion de archivo
            </v-list-item-title>
            <p
                class="ma-0 subtitle-2"
            >
              Carga y vista de resultados
            </p>
          </v-list-item-content>
          <v-list-item-action style="flex-direction: row">
            <v-btn
                class="mr-4 mb-1"
                color="green"
                dark
                :href="templatePath"
            >
              <v-icon class="mr-1">mdi-file-excel</v-icon>
              Plantilla
              <v-icon class="ml-1">mdi-download</v-icon>
            </v-btn>
            <v-btn
                icon
                large
                @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-text style="height: 100%;">
        <v-container fluid class="pb-0">
          <v-row dense>
            <v-col cols="12">
              <ValidationObserver ref="formFile">
                <v-row>
                  <v-col cols="12" sm="4" xl="3">
                    <c-date
                        v-model="month"
                        label="Mes de cargue"
                        type="month"
                        name="mes de cargue"
                        rules="required"
                        :max="moment().format('YYYY-MM-DD')"
                        :dense="false"
                    />
                  </v-col>
                  <v-col cols="12" sm="8" xl="9">
                    <ValidationProvider
                        name="archivo"
                        rules="required"
                        v-slot="{ errors }"
                    >
                      <v-file-input
                          label="Archivo"
                          v-model="file"
                          accept=".xls,.xlsx"
                          prepend-icon="mdi-file-upload"
                          :error-messages="errors"
                          outlined
                      >
                        <template v-slot:append-outer>
                          <v-btn
                              v-if="file && month"
                              style="bottom: 8px !important;"
                              color="primary"
                              dark
                              @click="fileUpload"
                          >
                            Cargar
                            <v-icon class="ml-2">mdi-file-upload</v-icon>
                          </v-btn>
                        </template>
                      </v-file-input>
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </ValidationObserver>
            </v-col>
            <v-col cols="12" v-if="errors.length">
              <v-subheader class="title error--text">El archivo cargado presenta {{ errors.length }}
                error{{ errors.length === 1 ? '' : 'es' }}
              </v-subheader>
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                  <tr
                      v-for="(error, errorIndex) in errors"
                      :key="errorIndex"
                  >
                    <td
                        class="text-center"
                        style="height: 24px !important;"
                    >
                      {{ errorIndex + 1 }}
                    </td>
                    <td
                        style="height: 24px !important; white-space:normal !important;"
                    >
                      {{ error }}
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <loading :value='loading' absolute/>
    </v-card>
  </v-dialog>
</template>

<script>
import {store} from '@/store/store'

export default {
  name: 'ExcelFileUploader',
  data: () => ({
    file: null,
    month: null,
    errors: [],
    dialog: false,
    loading: false,
    templatePath: `${process.env.BASE_URL}files/templates/ANEXO4_8.xlsx`
  }),
  watch: {
    dialog: {
      handler(val) {
        if (val) this.open()
      },
      immediate: false
    }
  },
  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.$refs.formFile.reset()
      this.file = null
      this.month = null
      this.errors = []
      this.dialog = false
    },
    fileUpload() {
      this.$refs.formFile.validate().then(result => {
        if (result) {
          this.loading = true
          this.errors = []
          let data = new FormData()
          data.append('archivo', this.file)
          data.append('mes', this.month)
          this.axios.post('load-seguimientos', data)
              .then(() => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: 'El cargue del archivo se realizó correctamente.'
                })
                store.commit('atencionMedicaRCVModule/SET_COUNTER')
                this.close()
              })
              .catch(error => {
                this.loading = false
                if (error?.response?.data?.errors?.length) {
                  this.errors = error.response.data.errors
                  store.commit('atencionMedicaRCVModule/SET_LOADS_COUNTER')
                } else {
                  this.$store.commit('snackbar', {color: 'error', message: ' al cargar el archivo.', error: error})
                }
              })
        }
      })
    }
  }
}
</script>