<template>
  <v-card tile>
    <v-toolbar
        :color="color"
        dark
        dense
        tile
        flat
    >
      <v-toolbar-title>Valoraciones</v-toolbar-title>
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
        <v-col cols="12" md="4">
          <v-list class="notification-wrap" dense>
            <template v-for="(item, indexItem) in information">
              <v-subheader
                  v-if="item.subheader"
                  :key="`subheader${indexItem}`"
                  class="font-weight-bold body-2"
                  :class="item.classSubheader"
              >
                {{item.subheader}}
              </v-subheader>
              <v-list-item
                  v-else
                  :key="`listItem${indexItem}`"
                  class="pa-0"
              >
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{ item.label }}</v-list-item-subtitle>
                  <v-list-item-title v-if="item.body">
                    <h6 class="mb-0">{{ item.body }}</h6>
                  </v-list-item-title>
                  <v-list-item-subtitle
                      v-if="item.subtitle"
                      class="fs-12 fw-normal"
                      :class="item.clasSubtitle"
                  >
                    {{ item.subtitle }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                      v-if="item.subtitle2"
                      class="fs-12 fw-normal"
                      :class="item.clasSubtitle2"
                  >
                    {{ item.subtitle2 }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
        <v-col cols="12" md="8">
          <v-simple-table v-if="item">
            <template v-slot:default>
              <tbody>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Antihipertensivos IECA
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{
                        [(item.antihipertensivos_ieca ? item.antihipertensivos_ieca === 1 ? 'SI' : item.antihipertensivos_ieca === 2 ? 'NO' : '' : ''), (item.with_antihipertensivos_ieca_object && item.with_antihipertensivos_ieca_object.opcion) || ''].filter(x => x).join(': ')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Antihipertensivos ARA II
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{
                        [(item.antihipertensivos_ara_ii ? item.antihipertensivos_ara_ii === 1 ? 'SI' : item.antihipertensivos_ara_ii === 2 ? 'NO' : '' : ''), (item.with_antihipertensivos_ara2_object && item.with_antihipertensivos_ara2_object.opcion) || ''].filter(x => x).join(': ')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Enfermedad renal crónica
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{
                        item.with_diagnostico_enfermedad_renal_object && item.with_diagnostico_enfermedad_renal_object.opcion || ''
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Estadio de ERC
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.with_estadio_erc_object && item.with_estadio_erc_object.opcion || '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Novedades
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.with_novedad_option_object && item.with_novedad_option_object.opcion || '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Causa de la muerte
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.with_causa_muerte_object && item.with_causa_muerte_object.opcion || '' }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-if="item.fecha_muerte">
                      Fecha de Muerte: {{ moment(item.fecha_muerte).format('YYYY-MM-DD') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      Hospitalizado en los últimos 6 meses
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.hospitalizado_recientemente_institucion || '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </td>
              </tr>
              <tr>
                <td>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-weight-black">
                      IPS donde asiste
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.ips_donde_asiste || '' }}
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
  name: 'Valoraciones',
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
    information: []
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
    permisos() {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  methods: {
    editItem() {
      // this.$refs.registerItem.open(this.clone(this.item))
    },
    clasificaSiNo(value) {
      return value ? value === 1 ? 'SI': value === 2 ? 'NO' : '' : ''
    },
    assign() {
      this.information = []
      this.information.push(
          {
            subheader: 'Vacunación'
          },
          {
            label: `Hepatitis B: ${this.clasificaSiNo(this.item.fecha_vacunacion_hepatitisb)}`
          },
          {
            label: `Hepatitis C: ${this.clasificaSiNo(this.item.fecha_vacunacion_hepatitisc)}`
          },
          {
            subheader: 'Valoración',
            classSubheader: 'mt-4'
          },
          {
            label: `Nutrición: ${this.clasificaSiNo(this.item.fecha_valoracion_nutricion)}`
          },
          {
            label: `Internista: ${this.clasificaSiNo(this.item.fecha_valoracion_internista)}`
          },
          {
            label: `Nefrología: ${this.clasificaSiNo(this.item.fecha_valoracion_nefrologia)}`
          },
          {
            label: `Psicología: ${this.clasificaSiNo(this.item.fecha_valoracion_psicologia)}`
          },
          {
            label: `Endocrinología: ${this.clasificaSiNo(this.item.fecha_valoracion_endocrinologia)}`
          },
          {
            label: `Último electrocardiograma: ${this.clasificaSiNo(this.item.fecha_valoracion_electrocardiograma)}`
          },
          {
            label: `Control grupal: ${this.clasificaSiNo(this.item.control_grupal)}`
          },
          {
            label: `Control enfermería: ${this.clasificaSiNo(this.item.fecha_control_enfermeria)}`
          },
      )
    }
  }
}
</script>