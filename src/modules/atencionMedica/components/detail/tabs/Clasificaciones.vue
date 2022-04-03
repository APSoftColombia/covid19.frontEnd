<template>
  <v-card tile>
    <v-toolbar
        :color="color"
        dark
        dense
        tile
        flat
    >
      <v-toolbar-title>Clasificaciones</v-toolbar-title>
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
              <tbody>
                <tr>
                  <th class="font-weight-bold">Clasificación de RCV</th>
                  <td>{{ item.clasificacion_rcv }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Tasa de Filtración Glomerular (TFGE) KCG</th>
                  <td>{{ item.tfge_kcg_anterior }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Clasificación Estadio ERC KCG</th>
                  <td>{{ item.estadio_erc_kcg_anterior }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Tasa de Filtración Glomerular (TFGE) SCHWARTZ</th>
                  <td>{{ item.tfge_schwartz_anterior }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Clasificación Estadio ERC SCHWARTZ</th>
                  <td>{{ item.estadio_erc_schwartz_anterior }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Tasa de Filtración Glomerular ACTUAL (COCKROFT-GAULT)</th>
                  <td>{{ item.tfg_actual_cockroft_gault }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Clasificación Estadio ERC ACTUAL (COCKROFT-GAULT)</th>
                  <td>{{ item.estadio_erc_actual_cockroft_gault }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Tasa de Filtración Glomerular ACTUAL (SCHWARTZ)</th>
                  <td>{{ item.tfg_actual_schwartz }}</td>
                </tr>
                <tr>
                  <th class="font-weight-bold">Clasificación Estadio ERC ACTUAL (SCHWARTZ)</th>
                  <td>{{ item.estadio_erc_actual_schwartz }}</td>
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
  name: 'Clasificaciones',
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
  data: () => ({}),
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
    permisos() {
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