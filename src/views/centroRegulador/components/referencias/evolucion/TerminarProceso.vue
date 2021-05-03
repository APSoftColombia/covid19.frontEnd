<template>
    <v-dialog
      v-model="dialog"
      max-width="620"
  >
    <template v-slot:activator="{ on, attrs }">
      <c-tooltip
          top
          :tooltip="accion.tooltip"
      >
        <v-btn
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            :color="accion.color"
            depressed
            fab
            x-small
        >
          <v-icon class="white--text">{{ accion.icon }}</v-icon>
        </v-btn>
      </c-tooltip>
    </template>
    <v-card>
      <v-toolbar dark :color="accion.color">
        <v-icon left>{{ accion.icon }}</v-icon>
        <v-toolbar-title>
          {{ accion.accion }} Presentación
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="pb-0">
        <ValidationObserver
            ref="formItem"
            v-slot="{ invalid, validated, passes, validate }"
            autocomplete="off"
        >
          <v-row dense>
            <v-col cols="12" sm="6">
              <c-date-manual
                  v-model="item.fecha"
                  label="Fecha"
                  name="Fecha"
                  rules="required"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-time
                  v-model="item.hora"
                  label="Hora"
                  name="Hora"
                  rules="required"
              />
            </v-col>
            <v-col cols="12">
              <c-text-area
                  label="Observaciones"
                  v-model="item.observaciones"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn
            text
            @click="close"
        >
          Cancelar
        </v-btn>
        <v-spacer/>
        <v-btn
            :color="accion.color"
            class="white--text"
            @click="save"
        >
          Guardar
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    name: 'TerminarProceso',
    props: {
        referencia: {
            type: Object,
            default: null
        },
        accion: {
            type: Object,
            default: null
        },
        id: {
            type: [String, Number],
            default: null
        }
    },
    data: () => ({
        dialog: false,
        loading: false,
    }),
    methods: {
        open() {
            this.dialog = true;
        },
        close() {
            this.dialog = false;
        },
        save() {
            console.log("Save");
        }
    }

}
</script>

<style>

</style>