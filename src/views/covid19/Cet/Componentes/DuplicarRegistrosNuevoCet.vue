<template>
  <v-dialog v-model="dialog" max-width="1200px" persistent>
    <template v-slot:activator="{ on }">
      <v-btn
          color="green"
          class="white--text mr-2"
          v-on="on"
          @click.stop="open"
      >
        <v-icon left>fas fa-file-download</v-icon>
        Migrar Registros
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Migrar registros a nuevo archivo
      </v-card-title>
      <v-card-text>
        <ValidationObserver ref="formBuscar" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col class="pb-0" cols="12" sm="12" md="5" lg="5">
              <ValidationProvider name="nombre archivo origen" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                    label="Archivo origen del registro"
                    v-model="data.cet_id_origen"
                    :items="cets"
                    outlined
                    dense
                    item-value="id"
                    clearable
                    :error-messages="errors"
                >
                  <template v-slot:selection="{ item, index }">
                    <div class="pa-0 text-truncate" style="width: 100% !important;">
                      {{ item.nombre_archivo + ' - ' + item.fecha_proceso }}
                    </div>
                  </template>
                  <template v-slot:item="{ item, index }">
                    <template>
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>{{ item.nombre_archivo }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.fecha_proceso }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12" md="5" lg="5">
              <c-texto
                  label="Identificacion del confirmado"
                  v-model="data.identificacion"
                  outlined
                  dense
                  clearable
                  name="identificaion del confirmado"
                  rules="required"
              ></c-texto>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12" md="2" lg="2">
              <v-btn
                  class="info"
                  type="submit"
                  text
                  icon
                  @click="buscarNucleo"
              >
                <v-icon color="white">fas fa-search</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </ValidationObserver>
        <v-row>
          <v-col cols="12">
            <v-simple-table dense class="text-capitalize">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Persona</th>
                  <th class="text-left">Parentesco</th>
                  <th class="text-left">Fecha Nacimiento</th>
                </tr>
                </thead>
                <tbody>
                <template>
                  <tr v-for="(contacto, index) in data.nucleo" :key="index">
                    <td>
                      <v-list-item>
                        <v-list-item-content style="display: grid !important;">
                          <v-list-item-title class="body-2">Caso: {{ contacto.numero_caso }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">BDUA: {{ contacto.bdua_afl_id }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-list-item>
                        <v-icon class="mr-2" v-if="contacto.covid_contacto === 1">fas fa-virus</v-icon>
                        <v-icon class="mr-2" v-if="contacto.fue_confirmado === 1" color="orange">fas fa-virus</v-icon>
                        <v-icon class="mr-2" v-if="contacto.autoriza_eps" size="32px">mdi mdi-currency-usd</v-icon>
                        <v-list-item-content style="display: grid !important;">
                          <v-list-item-title class="body-2">{{ [contacto.apellido1, contacto.apellido2, contacto.nombre1, contacto.nombre2].filter(x => x).join(' ') }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">{{contacto.tipoid}} {{contacto.identificacion}} - Cel. {{ contacto.celular}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>{{ getParentesco(contacto) }}</td>
                    <td>{{ contacto.fecha_nacimiento }}</td>
                  </tr>
                </template>
                </tbody>
              </template>
            </v-simple-table>
            <template v-if="data && !data.nucleo.length">
              <v-row>
                <div class="grey--text mx-auto mt-2">
                  No hay registros para mostrar
                </div>
              </v-row>
            </template>
          </v-col>
        </v-row>
        <ValidationObserver ref="formCrearNucleo" v-slot="{ invalid, validated, passes, validate }" autocomplete="off" v-if="data && data.nucleo && data.nucleo.length">
          <v-row>
            <v-col class="pb-0" cols="12" sm="12" md="6" lg="6">
              <ValidationProvider name="nombre archivo destino" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                    label="Archivo destino"
                    v-model="data.cet_id_destino"
                    :items="cets"
                    outlined
                    dense
                    item-value="id"
                    clearable
                    :error-messages="errors"
                >
                  <template v-slot:selection="{ item, index }">
                    <div class="pa-0 text-truncate" style="width: 100% !important;">
                      {{ item.nombre_archivo + ' - ' + item.fecha_proceso }}
                    </div>
                  </template>
                  <template v-slot:item="{ item, index }">
                    <template>
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>{{ item.nombre_archivo }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.fecha_proceso }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12" md="2" lg="2">
              <v-btn
                  class="info"
                  type="submit"
                  @click="crearNucleo"
              >Crear</v-btn>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-btn text block @click="close" :disabled="loadingButton" :loading="loadingButton">Cerrar</v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "DuplicarRegistrosNuevoCet",
  data: () => ({
    cets: [],
    data: {
      identificacion: null,
      cet_id_origen: null,
      cet_id_destino: null,
      nucleo: []
    },
    dialog: false,
    loading: false,
    loadingButton: false,
  }),
  computed: {
    ...mapGetters([
      "parentescos",
    ])
  },
  methods: {
    getCets(){
      this.axios.get('cets').then(response => {
        this.cets = response.data
      }).catch(error => {
        this.$store.commit('snackbar', {color: 'error', message: ' al obtener archivos subidos', error: error})
      })
    },
    open(){
      this.dialog = true
      this.getCets()
    },
    close(){
      this.dialog = false
      this.cets = []
      this.data = {
        identificacion: null,
        cet_id_origen: null,
        cet_id_destino: null,
        nucleo: []
      }
    },
    getParentesco(contacto){
      return this.parentescos && this.parentescos.length && this.parentescos.find(x => x.id === contacto.parentesco_id)
          ? this.parentescos.find(x => x.id === contacto.parentesco_id).descripcion : ''
    },
    buscarNucleo(){
      this.$refs.formBuscar.validate().then(result => {
        if(result) {
          this.loading = true
          this.axios.get(`return-nucleo-familiar?identificacion=${this.data.identificacion}&cet_id_origen=${this.data.cet_id_origen}`).then(response => {
            this.data.nucleo = response.data
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: ' al obtener registros', error: error})
          })
        }
      })
    },
    crearNucleo(){
      this.$refs.formCrearNucleo.validate().then(result => {
        if(result) {
          this.loading = true
          this.axios.post(`duplicar-nucleo-familiar-a-nuevo-cet`, this.data).then(response => {
            response
            this.$emit('reloadTable')
            this.loading = false
            this.close()
          }).catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: ' al crear registros', error: error})
          })
        }
      })
    }
  },
  created() {
    this.getCets()
  }
}
</script>

<style scoped>

</style>