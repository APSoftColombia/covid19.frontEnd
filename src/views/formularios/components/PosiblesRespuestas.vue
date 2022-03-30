<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="920"
  >
    <template v-slot:activator="{ on }">
      <v-badge
          bordered
          color="indigo"
          :content="pregunta.posibles_respuestas.length"
          :value="pregunta.posibles_respuestas.length"
          overlap
      >
        <v-btn
            v-on="on"
            :block="block"
            class="white--text"
            color="primary"
        >
          <v-icon left>mdi-format-list-checks</v-icon>
          Posibles Respuestas
        </v-btn>
      </v-badge>
    </template>
    <v-card>
      <ValidationObserver
          ref="formPosiblesRespuestas"
          v-slot="{ invalid, validated, passes, validate }"
          tag="form"
          autocomplete="off"
          @submit.prevent="submitPosiblesRespuestas"
      >
        <v-toolbar class="elevation-0">
          <v-list-item class="pa-0">
            <v-list-item-avatar
                color="primary"
                class="mr-2"
            >
              <v-icon class="white--text">mdi-format-list-checks</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Posibles Respuestas</v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                {{ preguntaCopia ? preguntaCopia.pregunta : '' }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                  text
                  icon
                  @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-toolbar>
        <v-divider class="mt-0"/>
        <v-card-text v-if="preguntaCopia">
          <v-row align="center">
            <v-autocomplete
                v-model="fuente"
                :label="(fuente ? 'F' : 'Crear a partir de f') + 'uente de datos'"
                :items="fuentesDatos"
                item-value="id"
                item-text="nombre"
                class="mr-2"
                return-object
                hide-details
                outlined
                dense
            />
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="primary"
                    @click="assignManual"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Crear registro manual</span>
            </v-tooltip>
          </v-row>
          <v-simple-table
              :dense="true"
              fixed-header
          >
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Fuente Datos</th>
                <th class="text-left">Nombre</th>
                <th class="text-left" width="120">Valor</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(item, indexItem) in preguntaCopia.posibles_respuestas"
                  :key="indexItem"
              >
                <td>{{ item.nombre_fuente }}</td>
                <td>
                  <ValidationProvider
                      :vid="`nombre${indexItem}`"
                      name="nombre"
                      rules="required"
                      v-slot="{ errors, valid }"
                  >
                    <v-text-field
                        v-model="item.nombre"
                        outlined
                        dense
                        :error-messages="errors"
                    />
                  </ValidationProvider>
                </td>
                <td class="py-1 justify-center">
                  <ValidationProvider
                      :vid="`valor${indexItem}`"
                      name="valor"
                      v-slot="{ errors, valid }"
                  >
                    <v-text-field
                        v-model.number="item.valor"
                        type="number"
                        min="0"
                        outlined
                        dense
                        :error-messages="errors"
                    />
                  </ValidationProvider>
                </td>
                <th class="text-center">
                  <v-btn
                      text
                      icon
                      color="error"
                      @click.stop="preguntaCopia.posibles_respuestas.splice(indexItem, 1)"
                  >
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </th>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-divider class="ma-0"/>
        <v-card-actions>
          <v-btn @click="dialog = false">
            <v-icon left>mdi-close</v-icon>
            Cerrar
          </v-btn>
          <v-spacer/>
          <v-btn
              type="submit"
              color="primary"
          >
            <v-icon left>fas fa-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'PosiblesRespuestas',
  props: {
    block: {
      type: Boolean,
      default: false
    },
    pregunta: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    fuente: null,
    preguntaCopia: null
  }),
  computed: {
    ...mapGetters([
      'fuentesDatos'
    ])
  },
  watch: {
    'dialog': {
      handler(val) {
        val && (this.preguntaCopia = this.clone(this.pregunta))
      },
      immediate: true
    },
    'preguntaCopia.posibles_respuestas': {
      handler(val) {
        val && this.nameFuentePosibleRespuesta()
      },
      immediate: true
    },
    fuente(val) {
      val && this.assignFuente()
    }
  },
  methods: {
    submitPosiblesRespuestas() {
      this.$refs.formPosiblesRespuestas.validate().then(result => {
        if (result) {
          this.pregunta.posibles_respuestas = this.clone(this.preguntaCopia.posibles_respuestas)
          this.dialog = false
        }
      })
    },
    assignManual() {
      this.preguntaCopia.posibles_respuestas.splice(0, 0,
          {
            id: null,
            uuid: this.$uuid.v1(),
            nombre: null,
            fuente_datos_opcione_id: null,
            valor: null,
            habilitado: 1,
            pregunta_uuid: this.preguntaCopia.uuid
          }
      )
    },
    assignFuente() {
      let opcionesFiltradas = []
      if (this.preguntaCopia.posibles_respuestas.length && this.preguntaCopia.posibles_respuestas.filter(y => y.fuente_datos_opcione_id).length) {
        opcionesFiltradas = this.fuente.opciones.filter(x => !this.preguntaCopia.posibles_respuestas.map(z => z.fuente_datos_opcione_id).find(j => j === x.id))
      } else {
        opcionesFiltradas = this.fuente.opciones
      }
      this.preguntaCopia.posibles_respuestas = this.preguntaCopia.posibles_respuestas.concat(opcionesFiltradas.map(x => {
        return {
          id: null,
          uuid: this.$uuid.v1(),
          nombre: x.nombre,
          fuente_datos_opcione_id: x.id,
          valor: null,
          habilitado: 1,
          pregunta_uuid: this.preguntaCopia.uuid
        }
      }))
      setTimeout(() => {
        this.fuente = null
      }, 60)
    },
    nameFuentePosibleRespuesta() {
      this.preguntaCopia.posibles_respuestas.map(y => {
        y.nombre_fuente = this.fuentesDatos.find(i => y.fuente_datos_opcione_id && i.opciones.find(j => j.id === y.fuente_datos_opcione_id)) ? this.fuentesDatos.find(i => i.opciones.find(j => j.id === y.fuente_datos_opcione_id)).nombre : 'Manual'
      })
    }
  }
}
</script>
