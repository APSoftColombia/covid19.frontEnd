<template>
  <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;" class="mt-5">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="teal" large>fas fa-users</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                Nucleo Familiar
              </h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12">
            <div class="grey--text text-center">
              <h5>Contactos del caso confirmado</h5>
            </div>
            <v-simple-table dense class="text-capitalize">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Persona</th>
                  <th class="text-left">Fecha Nacimiento</th>
                  <th class="text-left">Opciones</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="afiliado && afiliado.confirmado && afiliado.confirmado.contactos && afiliado.confirmado.contactos.length">
                  <tr v-for="(contacto, index) in afiliado.confirmado.contactos" :key="index">
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
                        <icon-tooltip v-if="[contacto.fecha_expedicion, contacto.codigo_departamento, contacto.codigo_municipio, contacto.celular].filter(x => !x).length" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
                        <v-icon class="mr-2" v-if="contacto.covid_contacto === 1">fas fa-virus</v-icon>
                        <v-icon class="mr-2" v-if="contacto.autoriza_eps">fas fa-dollar-sign</v-icon>
                        <v-list-item-content style="display: grid !important;">
                          <v-list-item-title class="body-2">{{ [contacto.nombre1, contacto.nombre2, contacto.apellido1, contacto.apellido2].filter(x => x).join(' ') }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">{{contacto.tipoid}} {{contacto.identificacion}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>{{ contacto.fecha_nacimiento }}</td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on"
                                 color="blue"
                                 icon
                                 @click="editarContacto(contacto, setNoToAuthEPS)"
                          >
                            <v-icon>far fa-edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Editar {{ contacto.covid_contacto === 2 ? 'Contacto' : 'Confirmado' }}</span>
                      </v-tooltip>
                      <v-tooltip top v-if="contacto.covid_contacto === 2">
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on" icon>
                            <desvincular-afiliado
                                @desvinculado="refreshAfiliado"
                                :contactoID="contacto.id"
                                :afiliadoID="afiliado.confirmado.id"
                            ></desvincular-afiliado>
                          </v-btn>
                        </template>
                        <span>Desvincular Contacto</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
                </tbody>
              </template>
            </v-simple-table>
            <template v-if="afiliado && afiliado.confirmado && afiliado.confirmado.contactos && !afiliado.confirmado.contactos.length">
              <v-row>
                <div class="grey--text mx-auto mt-2">
                  No hay registros para mostrar
                </div>
              </v-row>
            </template>
          </v-col>
          <v-col cols="12">
            <div class="grey--text text-center">
              <h5>Contactos sin vincular</h5>
              <v-btn icon x-small @click="openInfo = true">
                <v-icon>fas fa-question-circle</v-icon>
              </v-btn>
            </div>
            <v-row>
              <v-spacer></v-spacer>
              <v-text-field style="max-width: 400px" v-model="search" append-icon="search" label="Search" hide-details></v-text-field>
            </v-row>
            <template>
              <v-data-table
                  :headers="headers"
                  :items="afiliado.sinVincular"
                  :search="search"
              >
                <template v-slot:item.id="{ item }">
                  <v-list-item>
                    <v-list-item-content style="display: grid !important;">
                      <v-list-item-title class="body-2">Caso: {{ item.numero_caso }}</v-list-item-title>
                      <v-list-item-subtitle class="text-truncate">BDUA: {{ item.bdua_afl_id }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-slot:item.persona="{ item }">
                  <v-list-item>
                    <v-list-item-content style="display: grid !important;">
                      <v-list-item-title class="body-2">{{ [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ') }}</v-list-item-title>
                      <v-list-item-subtitle class="text-truncate">{{item.tipoid}} {{item.identificacion}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-slot:item.opciones="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-switch
                          v-on="on"
                          :loading="item.loading"
                          :disabled="item.loading"
                          @change="desvincular(item)"
                          v-model="item.id_bdua_af_confirmado"
                          :value="item.id_bdua_af_confirmado"
                      ></v-switch>
                    </template>
                    <span>Vincular Contacto</span>
                  </v-tooltip>
                </template>
                <template v-slot:no-data>
                  <div class="text-center grey--text">
                    No hay registros para mostrar
                  </div>
                </template>
              </v-data-table>
            </template>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="openInfo" width="600px">
      <v-card>
        <v-card-text class="subtitle-1">
          <p class="pt-8">
            Presione click sobre el boton 'Vincular Contacto' que se encuentra en la columna de 'Opciones'
            en la siguiente tabla para vincular contactos al confirmado
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="openInfo=false">
            <v-icon>mdi-close</v-icon>
            <span>Cerrar</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <editar-contacto
        ref="editarContacto"
        @editado="refreshAfiliado"
    ></editar-contacto>
  </v-expansion-panels>
</template>

<script>
  const DesvincularAfiliado = () => import('./DesvincularAfiliado')
  const EditarContacto = () => import('./EditarContacto')
  export default {
    name: "ContactosTables",
    data: () => ({
      datos: [],
      panel: [],
      search: '',
      openInfo: false,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        {
          text: 'Fecha Diagnostico',
          align: 'start',
          value: 'fecha_diagnostico',
        },
        {
          text: 'Persona',
          align: 'start',
          value: 'persona',
        },
        {
          text: 'Fecha Nacimiento',
          align: 'start',
          value: 'fecha_nacimiento',
        },
        {
          text: 'Opciones',
          align: 'center',
          value: 'opciones',
        },
      ],
    }),
    props: {
      abierto: {
        type: Boolean,
        default: true
      },
      afiliado: {
        type: [Array, Object],
        default: null
      },
    },
    computed: {
      setNoToAuthEPS() {
        return this.afiliado.confirmado.contactos.find(contacto => contacto.autoriza_eps === 1)
      }
    },
    components: {
      DesvincularAfiliado,
      EditarContacto
    },
    watch: {
      abierto: {
        handler (val) {
          if (this) {
            this.panel = val ? [0] : []
          }
        },
        immediate: true
      },
    },
    methods: {
      refreshAfiliado() {
        this.$emit('refreshAfiliado', this.afiliado.confirmado.id)
      },
      editarContacto(contacto, setNoToAuthEPS){
        this.$refs.editarContacto.open(contacto, setNoToAuthEPS)
      },
      desvincular(contacto){
        contacto.loading = true
        this.axios.put(`vincular-contacto/${contacto.id}/persona/${this.afiliado.confirmado.id}`).then(response => {
          response
          this.$store.commit('snackbar', {color: 'success', message: `contacto vinculado con exito`})
          this.refreshAfiliado()
          contacto.loading = false
        }).catch(error => {
          contacto.loading = false
          this.$store.commit('snackbar', {color: 'success', message: ` al vincular contacto`, error:error})
        })
      }
    }
  }
</script>

<style scoped>

</style>