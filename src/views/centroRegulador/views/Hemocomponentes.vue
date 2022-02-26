<template>
  <v-container fluid>
    <page-title-bar title="Hemocomponentes"/>
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
              disable-pagination
              dense
          >
            <template v-slot:item.institucion="{item}">
              <v-list-item-content>
                <v-list-item-title class="body-2">{{ item.institucion }}</v-list-item-title>
                <v-list-item-title class="caption">{{ item.municipio }}, {{ item.departamento }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <template
                v-if="totalized"
                v-slot:body.append
            >
              <tr>
                <td class="font-weight-bold text-center">TOTAL</td>
                <td class="font-weight-bold text-center">{{ totalized.hemocomponente }}</td>
                <td class="font-weight-bold text-center">{{ totalized.o_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a1_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a2_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a1b_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a2b_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.b_p }}</td>
                <td class="font-weight-bold text-center">{{ totalized.o_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a1_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a2_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.ab_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a1b_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.a2b_n }}</td>
                <td class="font-weight-bold text-center">{{ totalized.b_n }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import lodash from 'lodash'
export default {
  name: 'Hemocomponentes',
  data: () => ({
    search: '',
    headers: [
      {
        text: 'Institución',
        align: 'start',
        value: 'institucion',
      },
      {
        text: 'Hemocomponente',
        align: 'start',
        value: 'hemocomponente',
      },
      {
        text: 'O+',
        align: 'center',
        sortable: false,
        value: 'o_p',
      },
      {
        text: 'A+',
        align: 'center',
        sortable: false,
        value: 'a_p',
      },
      {
        text: 'A1+',
        align: 'center',
        sortable: false,
        value: 'a1_p',
      },
      {
        text: 'A2+',
        align: 'center',
        sortable: false,
        value: 'a2_p',
      },
      {
        text: 'A1B+',
        align: 'center',
        sortable: false,
        value: 'a1b_p',
      },
      {
        text: 'A2B+',
        align: 'center',
        sortable: false,
        value: 'a2b_p',
      },
      {
        text: 'B+',
        align: 'center',
        sortable: false,
        value: 'b_p',
      },
      {
        text: 'O-',
        align: 'center',
        sortable: false,
        value: 'o_n',
      },
      {
        text: 'A-',
        align: 'center',
        sortable: false,
        value: 'a_n',
      },
      {
        text: 'A1-',
        align: 'center',
        sortable: false,
        value: 'a1_n',
      },
      {
        text: 'A2-',
        align: 'center',
        sortable: false,
        value: 'a2_n',
      },
      {
        text: 'AB-',
        align: 'center',
        sortable: false,
        value: 'ab_n',
      },
      {
        text: 'A1B-',
        align: 'center',
        sortable: false,
        value: 'a1b_n',
      },
      {
        text: 'A2B-',
        align: 'center',
        sortable: false,
        value: 'a2b_n',
      },
      {
        text: 'B-',
        align: 'center',
        sortable: false,
        value: 'b_n',
      },
    ],
    originalItems: []
  }),
  created() {
    this.getItems()
  },
  computed: {
    items() {
      return this.search ? this.originalItems.filter(x => (x.institucion.toLowerCase().search(this.search.toLowerCase()) > -1) || (x.hemocomponente.toLowerCase().search(this.search.toLowerCase()) > -1)) : this.originalItems
    },
    totalized () {
      if(this.items?.length && lodash.intersectionBy(this.items, 'hemocomponente').length === 1) {
        return {
          hemocomponente: this.items[0].hemocomponente,
          a1_n: lodash.sumBy(this.items, 'a1_n'),
          a1_p: lodash.sumBy(this.items, 'a1_p'),
          a1b_n: lodash.sumBy(this.items, 'a1b_n'),
          a1b_p: lodash.sumBy(this.items, 'a1b_p'),
          a2_n: lodash.sumBy(this.items, 'a2_n'),
          a2_p: lodash.sumBy(this.items, 'a2_p'),
          a2b_n: lodash.sumBy(this.items, 'a2b_n'),
          a2b_p: lodash.sumBy(this.items, 'a2b_p'),
          a_n: lodash.sumBy(this.items, 'a_n'),
          a_p: lodash.sumBy(this.items, 'a_p'),
          ab_n: lodash.sumBy(this.items, 'ab_n'),
          ab_p: lodash.sumBy(this.items, 'ab_p'),
          b_n: lodash.sumBy(this.items, 'b_n'),
          b_p: lodash.sumBy(this.items, 'b_p'),
          o_n: lodash.sumBy(this.items, 'o_n'),
          o_p: lodash.sumBy(this.items, 'o_p')
        }
      }
      return null
    }
  },
  methods: {
    getItems() {
      this.axios.get('hemocomponentes')
          .then(response => {
            this.originalItems = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: ' al recuperar los registros de los hemocomponentes.',
              error: error
            })
          })
    }
  }
}
</script>

<style>
#table-hemocomponentes td, th {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
</style>