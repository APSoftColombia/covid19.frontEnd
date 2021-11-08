<template>
  <v-dialog v-model="openInfo">
    <v-card>
      <v-toolbar dark color="teal">
        <v-icon left>fas fa-clipboard-list</v-icon>
        <v-toolbar-title id="inicio">Caso: {{ personaOrigen.numero_caso }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
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
                  <th class="text-left">Número</th>
                  <th class="text-left">Opciones</th>
                </tr>
                </thead>
                <tbody>
                <template>
                  <tr v-for="(contacto, index) in contactos" :key="index">
                    <td>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="body-2">ID: {{ contacto.id }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">Tipo: {{ contacto.covid_contacto === 1 ? 'Confirmado' : 'Contacto' }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-list-item>
                        <icon-tooltip v-if="contacto.producto_financiero === null" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
                        <v-icon class="mr-2" v-if="contacto.covid_contacto === 1" size="20px">fas fa-virus</v-icon>
                        <v-icon class="mr-2" v-if="contacto.fue_confirmado === 1" color="orange" size="20px">fas fa-virus</v-icon>
                        <v-icon class="mr-2" v-if="contacto.autoriza_eps" size="20px">mdi mdi-currency-usd</v-icon>
                        <v-list-item-content>
                          <v-list-item-title class="body-2">{{ [contacto.apellido1, contacto.apellido2, contacto.nombre1, contacto.nombre2].filter(x => x).join(' ') }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">{{contacto.tipoid}} {{contacto.identificacion}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>{{ getParentesco(contacto) }}</td>
                    <td>{{ contacto.fecha_nacimiento }}</td>
                    <td>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="body-2">Celular: {{ contacto.celular }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">Fijo: {{ contacto.telefono_fijo }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on"
                                 color="teal"
                                 icon
                                 @click="infoContacto(contacto)"
                          >
                            <v-icon>mdi-information-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Información</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
                </tbody>
              </template>
            </v-simple-table>
            <template v-if="contactos && !contactos.length">
              <v-row>
                <div class="grey--text mx-auto mt-2">
                  No hay registros para mostrar
                </div>
              </v-row>
            </template>
          </v-col>
          <informacion-persona
              ref="infoContacto"
          ></informacion-persona>
        </v-row>
      </v-card-text>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import InformacionPersona from "../InformacionPersona";
import {mapGetters} from "vuex";
  export default {
    name: "GrupoFamiliarTable",
    data: () => ({
      contactos: [],
      personaOrigen: [],
      openInfo: false,
      loading: false
    }),
    components: {
      InformacionPersona
    },
    computed: {
      ...mapGetters([
        "parentescos",
      ])
    },
    methods: {
      getParentesco(contacto){
        return this.parentescos && this.parentescos.length && this.parentescos.find(x => x.id === contacto.parentesco_id)
            ? this.parentescos.find(x => x.id === contacto.parentesco_id).descripcion : ''
      },
      open(item = null) {
        this.openInfo = true
        if(item) {
          this.personaOrigen = item;
          this.searchGrupoFamiliar(item)
        }
      },
      searchGrupoFamiliar(item) {
        this.loading = true
        this.axios.get(`cet-tamizajes/${item.identificacion_af_confirmado}/${item.cet_id}`).then((response) => {
          this.contactos = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {color: 'success', message: ` al conseguir registros`, error:error})
        })
      },
      close() {
        this.contactos = []
        this.personaOrigen = []
        this.openInfo = false
      },
      infoContacto(item){
        this.$refs.infoContacto.open(item.id)
      },
    }
  }
</script>

<style scoped>

</style>