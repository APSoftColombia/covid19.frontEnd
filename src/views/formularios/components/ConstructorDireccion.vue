<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="920"
  >
    <v-card>
      <v-toolbar>
        <v-avatar
            size="38"
            color="blue"
            class="mr-2"
        >
          <v-icon class="white--text">fas fa-map-signs</v-icon>
        </v-avatar>
        <v-list-item class="pa-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title>Constructor de direcciones</v-list-item-title>
            <v-list-item-subtitle>{{ esUrbana ? 'Urbana' : 'Rural' }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                class="ml-4"
                color="warning"
                @click.stop="resetAll"
            >
              <v-icon left>mdi-restore</v-icon>
              Resetear
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-toolbar>
      <v-divider class="ma-0 pa-0"/>
      <v-container
          fluid
          class="py-2"
      >
        <v-row
            v-if="esUrbana && direccion"
            class="justify-center align-center"
            dense
        >
          <v-col
              class="pb-0"
              cols="12"
              sm="4"
              md="3"
          >
            <v-autocomplete
                v-model="direccion.campo1"
                :items="nombresCalles"
                clearable
                outlined
                dense
            ></v-autocomplete>
          </v-col>
          <v-col class="pb-0" cols="12" sm="4" md="3">
            <v-text-field
                v-model="direccion.campo2"
                outlined
                dense
            />
          </v-col>
          <v-col
              class="mb-3"
              cols="12"
              sm="2"
              md="3"
          >
            <v-checkbox
                class="mb-0 mt-0 ml-2"
                v-model="direccion.campo4"
                label="Bis"
                hide-details
            />
            <v-divider/>
          </v-col>
          <v-col
              class="pb-0"
              cols="12"
              sm="4"
              md="3"
          >
            <v-autocomplete
                v-model="direccion.campo5"
                :items="cardinales"
                clearable
                outlined
                dense
            />
          </v-col>
          <v-col
              class="pb-0"
              cols="12"
              sm="4"
              md="3"
          >
            <v-autocomplete
                v-model="direccion.campo6"
                :items="nombresCalles"
                clearable
                outlined
                dense
            />
          </v-col>
          <v-col
              class="pb-0"
              cols="12"
              sm="4"
              md="3"
          >
            <v-text-field
                v-model="direccion.campo7"
                outlined
                dense
            />
          </v-col>
          <v-col
              class="pb-0"
              cols="12"
              sm="4"
              md="3"
          >
            <v-autocomplete
                v-model="direccion.campo10"
                :items="cardinales"
                clearable
                outlined
                dense
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-subheader v-if="esUrbana">Datos adicionales de la dirección</v-subheader>
          <v-col cols="12">
            <v-simple-table
                :dense="true"
                fixed-header
            >
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">
                    <v-autocomplete
                        v-model="adicional.campo1"
                        :items="esUrbana ? adicionalesUrbana : adicionalesRural"
                        clearable
                        outlined
                        dense
                    />
                  </th>
                  <th class="text-left">
                    <v-text-field
                        v-model="adicional.campo2"
                        outlined
                        dense
                    />
                  </th>
                  <th class="text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                            class="mb-6"
                            icon
                            v-on="on"
                            color="primary"
                            @click="assignAdicional"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Asignar datos adicionales</span>
                    </v-tooltip>
                  </th>
                </tr>
                </thead>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <span>
          <v-icon
              color="green"
              left
          >
            fas fa-map-signs
          </v-icon>
          <strong>{{ stringDireccion }}</strong>
        </span>
      </v-container>
      <v-divider class="ma-0 pa-0"/>
      <v-card-actions>
        <v-btn @click.stop="cancel">
          <v-icon left>mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-spacer/>
        <v-btn
            @click.stop="submitDireccion"
            color="primary"
        >
          <v-icon left>fas fa-save</v-icon>
          Guardar
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'ConstructorDireccion',
  props: {
    esUrbana: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    loading: false,
    dialog: false,
    stringDireccion: null,
    direccion: null,
    adicional: {
      campo1: null,
      campo2: null
    },
    adicionalString: null,
    makeDireccionUrbana: {
      campo1: null,
      campo2: null,
      campo3: null,
      campo4: false,
      campo5: null,
      campo6: null,
      campo7: null,
      campo8: null,
      campo9: null,
      campo10: null
    }
  }),
  watch: {
    'direccion': {
      handler() {
        this.construirString()
      },
      deep: true
    },
    'adicional': {
      handler() {
        this.construirString()
      },
      deep: true
    },
    esUrbana() {
      this.resetAll()
    }
  },
  computed: {
    ...mapGetters([
      'nombresCalles',
      'cardinales',
      'adicionalesRural',
      'adicionalesUrbana',
      'ABCDario'
    ])
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    open() {
      this.dialog = true
      if (!this.stringDireccion) this.assign()
    },
    resetAll() {
      this.assign()
      this.$emit('save', null)
    },
    assign() {
      this.direccion = this.esUrbana ? this.clone(this.makeDireccionUrbana) : null
      this.resetAdicional()
      this.adicionalString = null
    },
    resetAdicional() {
      this.adicional.campo1 = null
      this.adicional.campo2 = null
    },
    assignAdicional() {
      this.adicionalString = (this.adicionalString || '') + (' ' + this.clone(`${this.adicional.campo1} ${this.adicional.campo2}`))
      this.construirString()
      this.resetAdicional()
    },
    construirString() {
      this.stringDireccion = null
      this.stringDireccion = [this.esUrbana ?
          [
            this.direccion.campo1,
            this.direccion.campo2,
            this.direccion.campo3,
            (this.direccion.campo4 ? 'BIS' : null),
            this.direccion.campo5,
            this.direccion.campo6,
            this.direccion.campo7,
            this.direccion.campo8,
            this.direccion.campo9,
            this.direccion.campo10
          ].filter(x => x).join(' ') : '', this.adicionalString, this.adicional.campo1, this.adicional.campo2].join(' ')
    },
    submitDireccion() {
      this.$emit('save', this.stringDireccion)
      this.cancel()
    }
  }
}
</script>
