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
                Contactos
              </h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12">
            <div class="grey--text text-center">
              <h5>Contactos del Afiliado</h5>
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
                        <v-list-item-content style="display: grid !important;">
                          <v-list-item-title class="body-2">{{ contacto.nombre }}</v-list-item-title>
                          <v-list-item-subtitle class="text-truncate">{{contacto.tipoid}} {{contacto.identificacion}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>{{ contacto.fecha_nacimiento }}</td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon>
                              <editar-contacto
                                  :contacto="contacto"
                                  :afiliado="afiliado.confirmado"
                              ></editar-contacto>
                            </v-btn>
                        </template>
                        <span>Editar Contacto</span>
                      </v-tooltip>
                      <v-tooltip top>
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
              <h5>Contactos</h5>
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
                      <v-list-item-title class="body-2">{{ item.nombre }}</v-list-item-title>
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
      headers: [
        {
          text: 'ID',
          align: 'start',
          filterable: false,
          value: 'id',
        },
        {
          text: 'Fecha Diagnostico',
          align: 'start',
          filterable: false,
          value: 'fecha_diagnostico',
        },
        {
          text: 'Persona',
          align: 'start',
          filterable: false,
          value: 'persona',
        },
        {
          text: 'Fecha Nacimiento',
          align: 'start',
          filterable: false,
          value: 'fecha_nacimiento',
        },
        {
          text: 'Opciones',
          align: 'center',
          filterable: false,
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