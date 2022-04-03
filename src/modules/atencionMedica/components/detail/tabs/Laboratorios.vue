<template>
  <v-card tile>
    <v-toolbar
        :color="color"
        dark
        dense
        tile
        flat
    >
      <v-toolbar-title>Exámenes de Laboratorios</v-toolbar-title>
<!--      <v-spacer></v-spacer>-->
<!--      <template v-if="permisos.edit">-->
<!--        <c-tooltip-->
<!--            left-->
<!--            tooltip="Editar Sección"-->
<!--            :disabled="$vuetify.breakpoint.smAndUp"-->
<!--        >-->
<!--          <v-btn-->
<!--              :color="`${color} darken-3`"-->
<!--              depressed-->
<!--              :small="!!$vuetify.breakpoint.xsOnly"-->
<!--              :fab="$vuetify.breakpoint.xsOnly"-->
<!--              @click="editItem"-->
<!--          >-->
<!--            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-pencil</v-icon>-->
<!--            {{$vuetify.breakpoint.smAndUp ? 'Editar Sección' : ''}}-->
<!--          </v-btn>-->
<!--        </c-tooltip>-->
<!--      </template>-->
    </v-toolbar>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <v-simple-table v-if="item">
            <template v-slot:default>
              <thead>
              <tr>
                <th>Registro</th>
                <th>Examen</th>
                <th>Resultado</th>
                <th>Fecha</th>
                <th>Prestador</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(examen, examenIndex) in item.examenes"
                  :key="examenIndex"
              >
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      Creación: {{examen.created_at || ''}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Actualización: {{examen.updated_at || ''}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
                <td>
                  {{ (examen.examen && examen.examen.prueba) || '' }}
                </td>
                <td>
                  {{ examen.resultado  }} {{ (examen.examen && examen.examen.unidad) || ''  }}
                </td>
                <td>
                  {{ examen.fecha || '' }}
                </td>
                <td>
                  <v-list-item-content v-if="examen.with_prestador_object">
                    <v-list-item-subtitle>
                      {{ examen.with_prestador_object.nombre_sede }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Código: {{examen.with_prestador_object.codigohabilitacion}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'Laboratorios',
  props: {
    item: {
      type: Object,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data: () => ({
  }),
  watch: {
    item: {
      handler(val) {
        val && this.assign()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  methods: {
    editItem() {
      // this.$refs.registerItem.open(this.clone(this.item))
    },
    assign() {
    }
  }
}
</script>