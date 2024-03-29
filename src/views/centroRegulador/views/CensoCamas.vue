<template>
  <v-container fluid>
    <page-title-bar title="Censo de Camas">
      <template
          v-if="permisos.censoCamasGestionar"
          slot="actions"
      >
        <c-tooltip
            left
            tooltip="Registrar Censo"
            :disabled="$vuetify.breakpoint.smAndUp"
        >
          <v-btn
              color="primary"
              depressed
              :small="!!$vuetify.breakpoint.xsOnly"
              :fab="$vuetify.breakpoint.xsOnly"
              @click="createItem(null)"
          >
            <v-icon v-if="$vuetify.breakpoint.xsOnly">mdi-plus</v-icon>
            {{ $vuetify.breakpoint.smAndUp ? 'Registrar Censo' : '' }}
          </v-btn>
        </c-tooltip>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            clearable
            filled
            outlined
            rounded
        />
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-data-table
              id="table-hemocomponentes"
              :headers="headers"
              :items="items"
              hide-default-footer
              hide-default-header
              disable-pagination
              dense
          >
            <template
                v-slot:header="{ props: { headers } }"
            >
              <thead>
              <tr>
                <th rowspan="2">
                  Fecha Reporte
                </th>
                <th rowspan="2">
                  IPS
                </th>
                <th colspan="2" class="centered"> A D U L T O S</th>
                <th colspan="2" class="centered"> N E O N A T A L</th>
                <th colspan="2" class="centered"> P E D I A T R Í A</th>
                <th class="centered"> U R G E N C I A S </th>
              </tr>
              <tr>
                <th class="centered px-4">UCI</th>
                <th class="centered">UCI COVID</th>
                <th class="centered px-4">UCI</th>
                <th class="centered">UCI COVID</th>
                <th class="centered px-4">UCI</th>
                <th class="centered">UCI COVID</th>
                <th class="centered">GENERAL</th>
              </tr>
              </thead>
            </template>
            <template
                v-slot:item="{item}"
            >
              <tr>
                <td>
                  {{ item.fecha_reporte ? moment(item.fecha_reporte).format('DD/MM/YYYY HH:mm') : '' }}
                </td>
                <td>
                  <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="body-2">{{ item.nombre }}</v-list-item-title>
                    <v-list-item-title class="caption">Cód. {{ item.codigo_habilitacion }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <c-tooltip
                        top
                        tooltip="Registrar Censo"
                        v-if="permisos.censoCamasGestionar"
                    >
                      <v-btn
                          color="primary"
                          depressed
                          x-small
                          fab
                          @click="createItem(item)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </c-tooltip>
                  </v-list-item-action>
                </v-list-item>
                </td>
                <td class="font-weight-bold text-center">
                  <value-table
                      :disponible="item.camas_adu_uci"
                      :total="item.camas_adu_uci_total"
                  />
                </td>
                <td class="font-weight-bold text-center">
                  <value-table
                      :disponible="item.camas_adu_uci_covid"
                      :total="item.camas_adu_uci_covid_total"
                  />
                </td>
                <td class="font-weight-bold text-center">
                  <value-table
                      :disponible="item.camas_neo_uci"
                      :total="item.camas_neo_uci_total"
                  />
                </td>
                <td class="font-weight-bold text-center">
                  <value-table
                      :disponible="item.camas_neo_uci_covid"
                      :total="item.camas_neo_uci_covid_total"
                  />
                </td>
                <td class="font-weight-bold text-center">
                  <value-table
                      :disponible="item.camas_ped_uci"
                      :total="item.camas_ped_uci_total"
                  />
                </td>
                <td class="font-weight-bold text-center">
                  <value-table
                      :disponible="item.camas_ped_uci_covid"
                      :total="item.camas_ped_uci_covid_total"
                  />
                </td>
                <td class="font-weight-bold text-center">
                  <v-chip label color="green">
                    <c-tooltip tooltip="Disponible" left>
                      <v-icon left>mdi-alpha-d-circle-outline</v-icon>
                    </c-tooltip>
                    {{item.camas_urgencias}}
                  </v-chip>
                </td>
              </tr>
            </template>
            <template
                v-if="totalized"
                v-slot:body.append
            >
              <tr>
                <td class="font-weight-bold text-center" colspan="2">TOTAL</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_adu_uci }}</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_adu_uci_covid }}</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_neo_uci }}</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_neo_uci_covid }}</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_ped_uci }}</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_ped_uci_covid }}</td>
                <td class="font-weight-bold text-center">{{ totalized.camas_urgencias }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <registro-censo-camas
        :dialog.sync="dialogRegister"
        :codigo_habilitacion="codigoItem"
        @saved="getItems"
    />
    <loading :value='loading' absolute/>
  </v-container>
</template>

<script>
import lodash from 'lodash'
import RegistroCensoCamas from '../components/censoCamas/RegistroCensoCamas'
import ValueTable from '../components/censoCamas/ValueTable'

export default {
  name: 'CensoCamas',
  components: {
    ValueTable,
    RegistroCensoCamas
  },
  data: () => ({
    loading: false,
    dialogRegister: false,
    codigoItem: null,
    search: '',
    headers: [
      {
        text: 'Fecha Reporte',
        align: 'start',
        value: 'fecha_reporte',
      },
      {
        text: 'IPS',
        align: 'start',
        value: 'ips',
      },
      {
        text: 'UCI adulto',
        align: 'center',
        sortable: false,
        value: 'camas_adu_uci',
      },
      {
        text: 'UCI adulto COVID',
        align: 'center',
        sortable: false,
        value: 'camas_adu_uci_covid',
      },
      {
        text: 'UCI neonatal',
        align: 'center',
        sortable: false,
        value: 'camas_neo_uci',
      },
      {
        text: 'UCI neonatal COVID',
        align: 'center',
        sortable: false,
        value: 'camas_neo_uci_covid',
      },
      {
        text: 'UCI pediatría',
        align: 'center',
        sortable: false,
        value: 'camas_ped_uci',
      },
      {
        text: 'UCI pediatría COVID',
        align: 'center',
        sortable: false,
        value: 'camas_ped_uci_covid',
      },
      {
        text: 'Urgencias',
        align: 'center',
        sortable: false,
        value: 'camas_urgencias',
      },
    ],
    originalItems: []
  }),
  created() {
    this.getItems()
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('centroRegulador')
    },
    items() {
      return this.search ? this.originalItems.filter(x => (x.nombre.toLowerCase().search(this.search.toLowerCase()) > -1) || (x.codigo_habilitacion.toLowerCase().search(this.search.toLowerCase()) > -1)) : this.originalItems
    },
    totalized() {
      if (this.items?.length) {
        return {
          camas_adu_uci: lodash.sumBy(this.items, 'camas_adu_uci'),
          camas_adu_uci_covid: lodash.sumBy(this.items, 'camas_adu_uci_covid'),
          camas_neo_uci: lodash.sumBy(this.items, 'camas_neo_uci'),
          camas_neo_uci_covid: lodash.sumBy(this.items, 'camas_neo_uci_covid'),
          camas_ped_uci: lodash.sumBy(this.items, 'camas_ped_uci'),
          camas_ped_uci_covid: lodash.sumBy(this.items, 'camas_ped_uci_covid'),
          camas_urgencias: lodash.sumBy(this.items, 'camas_urgencias'),
        }
      }
      return null
    }
  },
  methods: {
    createItem(item) {
      this.codigoItem = item?.codigo_habilitacion || null
      this.dialogRegister = true
    },
    getItems() {
      this.loading = true
      this.axios.get('camas')
          .then(response => {
            this.originalItems = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: ' al recuperar los registros del censo de camas.',
              error: error
            })
          })
          .finally(() => this.loading = false)
    }
  }
}
</script>

<style>
#table-hemocomponentes td, th {
  padding-left: 10px !important;
  padding-right: 10px !important;
  min-width: 80px;
}

#table-hemocomponentes .centered {
  text-align: center !important;
}

#table-hemocomponentes th {
  height: 28px !important;
}
</style>