<template>
  <v-dialog v-model="dialog" width="720px" persistent>
    <template v-slot:activator="{ on }">
      <v-btn color="warning" v-if="vacunador && vacunador.id" x-small v-on="on" icon @click="dialog = true">
        <v-icon>fas fa-edit</v-icon>
      </v-btn>
      <v-btn v-else class="primary" @click="dialog = true" v-on="on">
        <v-icon left>fas fa-plus</v-icon>
        <span>Nuevo</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark :color="vacunador && vacunador.id ? 'warning' : 'indigo'">
        <v-icon left>fas fa-{{vacunador && vacunador.id ? 'edit' : 'plus'}}</v-icon>
        <v-toolbar-title>{{ vacunador && vacunador.id ? 'Editar' : 'Crear' }} Vacunador</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <ValidationObserver ref="formVacunador" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6">
              <c-texto
                  v-model="vacunadorD.apellido1"
                  label="Apellido 1"
                  name="apellido 1"
                  rules="required"
                  upper-case
              >
              </c-texto>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6">
              <c-texto
                  v-model="vacunadorD.apellido2"
                  label="Apellido 2"
                  name="apellido 2"
                  upper-case
              >
              </c-texto>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6">
              <c-texto
                  v-model="vacunadorD.nombre1"
                  label="Nombre 1"
                  name="nombre 1"
                  rules="required"
                  upper-case
              >
              </c-texto>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6">
              <c-texto
                  v-model="vacunadorD.nombre2"
                  label="Nombre 2"
                  name="nombre 2"
                  upper-case
              >
              </c-texto>
            </v-col>
            <v-col class="pb-0" cols="12" sm="6" md="6" lg="6">
              <c-select-complete
                  v-model="vacunadorD.tipo_identificacion"
                  label="Tipo identificación"
                  rules="required"
                  name="tipo identificación"
                  :items="tiposDocumentoIdentidad"
                  item-text="descripcion"
                  item-value="tipo"
              >
              </c-select-complete>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6">
              <c-texto
                  v-model="vacunadorD.identificacion"
                  label="Identificacion"
                  name="identificacion"
                  rules="required"
              >
              </c-texto>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn @click="dialog = false">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="save" class="white--text" :color="vacunador && vacunador.id ? 'warning' : 'indigo'">
          <v-icon left>fas fa-save</v-icon>
          <span>Guardar</span>
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "FormVacunador",
  props: {
    vacunador: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters(["tiposDocumentoIdentidad"]),
  },
  data: () => ({
    dialog: false,
    loading: false,
    vacunadorD: null,
    vacunadorM: {
      id: null,
      apellido1: null,
      apellido2: null,
      nombre1: null,
      nombre2: null,
      tipo_identificacion: null,
      identificacion: null
    }
  }),
  watch: {
    vacunador: {
      handler(val){
        val && this.assignData()
      },
      inmediate: true
    }
  },
  methods: {
    assignData(){
      if(this.vacunador){
        this.vacunadorD = {...this.vacunador}
      }else{
        this.vacunadorD = this.vacunadorM
      }
    },
    save(){
      this.$refs.formVacunador.validate().then(result => {
        if(result){
          this.loading = true
          let request = !this.vacunadorD.id
              ? this.axios.post('vacunadores', this.vacunadorD)
              : this.axios.put(`vacunadores/${this.vacunadorD.id}`, this.vacunadorD)
          request.then(response => {
            this.$store.commit('snackbar', {color: 'success', message: response.data.message})
            this.dialog = false
            this.loading = false
            this.$emit('reloadTable')
          }).catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: ` al ${this.vacunadorD.id ? 'actualizar' : 'crear'} laboratorio`,
              error: error
            })
          })
        }
      })
    }
  },
  created() {
    this.assignData()
  }
}
</script>

<style scoped>

</style>