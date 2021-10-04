<template>
  <v-dialog
      v-model="dialog"
      width="720px"
      persistent
  >
    <v-card>
      <v-toolbar
          dark
          :color="item && item.id ? 'warning' : 'indigo'"
      >
        <v-icon left>fas fa-{{item && item.id ? 'edit' : 'plus'}}</v-icon>
        <v-toolbar-title>{{ item && item.id ? 'Editar' : 'Crear' }} Dependencia</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
            icon
            dark
            @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <ValidationObserver ref="formItem">
          <v-row v-if="item">
            <v-col cols="12">
              <c-texto
                  v-model="item.dependencia"
                  label="Nombre Dependencia"
                  name="nombre dependencia"
                  rules="required"
              >
              </c-texto>
            </v-col>
            <v-col cols="12">
              <ValidationProvider name="Responsable asignado" rules="required" v-slot="{ errors }">
                <v-autocomplete
                    :label="item.responsable_id ? 'Responsable' : 'Seleccionar Responsable'"
                    v-model="item.responsable_id"
                    :items="responsables"
                    outlined
                    :error-messages="errors"
                    :filter="filterResponsables"
                    item-value="id"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-list-item class="pa-0" style="width: 100% !important;">
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>{{item.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{tiposDocumentoIdentidad && item.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''}} {{item.numero_documento_identidad}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item, index }">
                    <template>
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>{{item.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{tiposDocumentoIdentidad && item.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''}} {{item.numero_documento_identidad}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn @click="close">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="save" class="white--text" :color="item && item.id ? 'warning' : 'indigo'">
          <v-icon left>fas fa-save</v-icon>
          <span>Guardar</span>
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'FormRegistroDependencia',
  data: () => ({
    dialog: false,
    loading: false,
    item: null,
    itemM: {
      id: null,
      dependencia: null,
      user_id: null
    },
    responsables: [],
    filterResponsables (item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.numero_documento_identidad + ' ' + item.name)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    }
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad'
    ])
  },
  methods: {
    open (item) {
      if (item) this.item = this.clone(item)
      else this.item = this.clone(this.itemM)

      this.getResponsables()
      this.dialog = true
    },
    close () {
      this.$refs.formItem.reset()
      this.dialog = false
      this.loading = false
      setTimeout(() => {
        this.item = null
      }, 400)
    },
    save(){
      this.$refs.formItem.validate().then(result => {
        if(result){
          this.loading = true
          let request = !this.item.id
              ? this.axios.post('dependencias', this.item)
              : this.axios.put(`dependencias/${this.item.id}`, this.item)
          request.then(() => {
            this.$store.commit('snackbar', {color: 'success', message: `La dependencia se ha ${this.item.id ? 'editado' : 'creado'} correctamente`})
            this.$emit('guardado')
            this.close()
          }).catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: ` al ${this.item.id ? 'actualizar' : 'crear'} la dependencia`,
              error: error
            })
          })
        }
      })
    },
    getResponsables() {
      this.axios.get(`user`)
          .then(response => {
            this.responsables = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los registros de los responsables de bodega.`,
              error: error
            })
          })
    }
  }
}
</script>