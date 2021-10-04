<template>
  <v-card>
    <v-card-title>
      <span>Dependencias</span>
      <v-spacer></v-spacer>
      <v-btn
          color="indigo"
          dark
          @click="itemRegister(null)"
      >
        <v-icon left>fas fa-plus</v-icon>
        Nuevo
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-simple-table
          v-if="items && items.length"
          dense
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Dependencia</th>
            <th class="text-left">Responsable</th>
            <th class="text-center">Opciones</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, itemIndex) in items"
              :key="`item${itemIndex}`"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.dependencia }}</td>
            <td>
              <v-list-item class="pa-0" v-if="item.responsable">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">
                    {{ item.responsable.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                      v-if="item.responsable.telefono"
                      class="body-2 text-truncate"
                  >
                    Teléfono: {{ item.responsable.telefono }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </td>
            <td>
              <v-btn
                  color="warning"
                  icon
                  @click="itemRegister(item)"
                  class="mr-1"
              >
                <v-icon small>fas fa-edit</v-icon>
              </v-btn>
              <v-btn
                  color="error"
                  icon
                  @click="itemEliminar(item)"
              >
                <v-icon small>fas fa-trash-alt</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <p
          v-else
          class="font-weight-bold text--disabled title text-center"
      >
        No hay dependencias registradas
      </p>
    </v-card-text>
    <form-registro
        ref="formRegistro"
        @guardado="getItems"
    />
    <eliminar
        ref="eliminar"
        @guardado="getItems"
    />
    <app-section-loader :status="loading"/>
  </v-card>
</template>

<script>
import Eliminar from './Eliminar'
import FormRegistro from './FormRegistro'

export default {
  name: 'IndexDependencias',
  components: {
    Eliminar,
    FormRegistro
  },
  data: () => ({
    items: [],
    loading: false,
  }),
  methods: {
    itemRegister (item) {
      this.$refs.formRegistro.open(item)
    },
    itemEliminar (item) {
      this.$refs.eliminar.open(item)
    },
    getItems () {
      this.loading = true
      this.axios.get('dependencias').then(response => {
        this.items = response.data
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {color: "error", message: ` al cargar los resgistros de dependencias`, error: error})
      })
    }
  },
  created() {
    this.getItems()
  }
}
</script>