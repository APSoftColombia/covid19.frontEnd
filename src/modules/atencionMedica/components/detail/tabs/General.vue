<template>
  <v-card tile>
    <v-toolbar
        :color="color"
        dark
        dense
        tile
        flat
    >
      <v-toolbar-title>General</v-toolbar-title>
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
          <v-row dense>
            <template v-for="(item, indexItem) in information">
              <v-col
                  cols="12"
                  :md="item.colmd"
                  :lg="item.collg"
                  :key="`col${indexItem}`"
              >
                <v-list class="notification-wrap">
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{ item.label }}</v-list-item-subtitle>
                      <v-list-item-title>
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
                </v-list>
              </v-col>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'General',
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
    permisos () {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  methods: {
    editItem() {
      // this.$refs.registerItem.open(this.clone(this.item))
    },
    assign() {
      this.information = []
      this.information.push(
          {
            label: 'Última consulta',
            body: this.item.fecha_ultima_consulta || '',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Adherencia al programa',
            body: this.item.adherencia_programa === null ? '' : this.item.adherencia_programa === 1 ? 'SI' : 'NO',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Ingreso nefroprotección EPS',
            body: this.item.fecha_nefroproteccion || '',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Tensión arterial',
            body: [this.item.ta_sistolica, this.item.ta_diastolica].join('/'),
            colmd: '6',
            collg: '4'
          },
          {
            label: 'HTA',
            body: [this.item.hta === null ? '' : this.item.hta === 1 ? 'SI' : 'NO', this.item.estadio_hta, this.item.fecha_dx_hta].filter(x => x).join(' | '),
            subtitle2: this.item.costo_hta.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 2}) || '',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'DM',
            body: [this.item.diabetes === null ? null : this.item.diabetes ? 'SI' : 'NO', this.item.fecha_dx_dm].filter(x => x).join(' | '),
            subtitle: this.item.costo_dm.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 2}) || '',
            colmd: '6',
            collg: '4'
          },
          // {
          //   label: 'Insulinorequiriente',
          //   body: this.item.insulinorequiriente === null ? '' : this.item.insulinorequiriente === 1 ? 'SI' : 'NO',
          //   colmd: '6',
          //   collg: '4'
          // },
          {
            label: 'CIE10',
            body: this.item.cie10 || '',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Etiología ERC',
            body: (this.item.with_etiologia_enfermedad_renal_object && this.item.with_etiologia_enfermedad_renal_object.opcion) || '',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Circunferencia Abdominal',
            body: this.item.circunferencia_abdominal === null ? '' : `${this.item.circunferencia_abdominal}cm`,
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Peso',
            body: this.item.peso === null ? '' : `${this.item.peso}Kg`,
            subtitle: this.item.fecha_peso,
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Talla',
            body: this.item.talla === null ? '' : `${this.item.talla}cm`,
            subtitle: this.item.fecha_talla,
            colmd: '6',
            collg: '4'
          },
          {
            label: 'IMC',
            body: this.item.imc || '',
            subtitle: this.item.clasificacion_imc,
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Alcohol',
            body: this.item.alcohol === null ? '' : this.item.alcohol === 1 ? 'SI' : 'NO',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Tabaquismo',
            body: this.item.tabaquismo === null ? '' : this.item.tabaquismo === 1 ? 'SI' : 'NO',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Sedentarismo',
            body: this.item.sedentarismo === null ? '' : this.item.sedentarismo === 1 ? 'SI' : 'NO',
            colmd: '6',
            collg: '4'
          }
      )
    }
  }
}
</script>