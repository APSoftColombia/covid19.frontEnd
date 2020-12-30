<template>
  <v-card v-if="stateCrearCargador">
    <v-toolbar dark color="pink">
      <v-icon left>mdi-file-table</v-icon>
      <v-toolbar-title>{{
        cargador && cargador.id
          ? `Cargador No. ${cargador.id}`
          : `Nuevo Cargador`
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <ValidationObserver
        ref="formCargador"
        v-slot="{ invalid, validated, passes, validate }"
        autocomplete="off"
      >
        <v-row>
          <v-col class="pb-0" cols="5">
            <c-texto
              v-model="cargador.nombre_cargador"
              label="Nombre del cargador"
              name="nombre cargador"
              upper-case
              rules="required"
            >
            </c-texto>
          </v-col>
          <v-col class="pb-0" cols="4">
            <c-texto
              v-model="cargador.nombre_table_temp"
              label="Tabla temporal"
              name="nombre tabla temporal"
              upper-case
              rules="required"
            >
            </c-texto>
          </v-col>
          <v-col class="pb-0" cols="3">
            <c-select-complete
              v-model="cargador.separator"
              placeholder="Separador"
              name="separador"
              :items="tipoSeparador ? tipoSeparador : []"
              item-text="text"
              item-value="id"
              rules="required"
            >
            </c-select-complete>
          </v-col>
          <v-col class="pb-0" cols="12">
            <v-toolbar flat>
              <v-toolbar-title>Cabeceras</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    dark
                    class="mb-2"
                    @click="crearNuevaCabecera"
                  >
                    <v-icon dark> mdi-plus </v-icon>
                  </v-btn>
                </template>
                <span>Agregar cabecera</span>
              </v-tooltip>
            </v-toolbar>
            <v-simple-table
              v-if="cargador.cabeceras && cargador.cabeceras.length"
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th
                      class="text-left"
                      v-for="item in headers"
                      :key="item.value"
                    >
                      {{ item.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cargador.cabeceras" :key="index">
                    <td>{{ item.header }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.length }}</td>
                    <td>{{ item.required ? "TRUE" : "FALSE" }}</td>
                    <td>
                      <v-icon small class="mr-2" @click="editCabecera(item)">
                        mdi-pencil
                      </v-icon>
                      <v-icon small @click="deleteCabecera(item)">
                        mdi-delete
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else class="title grey--text text-center pa-4">
              Sin cabeceras
            </div>
          </v-col>
          <v-col class="pb-0" cols="12">
            <v-toolbar flat>
              <v-toolbar-title>Querys</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    dark
                    class="mb-2"
                    @click="addQuery"
                  >
                    <v-icon dark> mdi-plus </v-icon>
                  </v-btn>
                </template>
                <span>Agregar query</span>
              </v-tooltip>
            </v-toolbar>
            <v-expansion-panels>
               <v-expansion-panel v-for="(item, i) in cargador.querys" :key="i">
                <v-expansion-panel-header v-slot="{ open }">
                  Query {{ i }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-spacer></v-spacer>
                    <v-col cols="12">
                      <ValidationProvider
                        name="query"
                        rules="required|integridadSQL"
                        v-slot="{ errors, valid }"
                      >
                        <span
                          :class="
                            focusCOdemirror
                              ? errors[0]
                                ? 'error--text'
                                : 'primary--text'
                              : errors[0]
                              ? 'error--text'
                              : ''
                          "
                          class="caption v-label v-label--active theme--light"
                          >Sentencia SQL</span
                        >
                        <codemirror
                          :key="i"
                          v-model="item.query"
                          :options="cmOptions"
                          @focus="focusCOdemirror = true"
                          @blur="focusCOdemirror = false"
                        ></codemirror>
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="error"
                      @click.stop="deleteQuery(item)"
                    >
                      <v-icon dark> mdi-delete </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </ValidationObserver>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn large @click.stop="close">
          <v-icon>mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          large
          color="pink"
          class="white--text"
          @click.stop="cargador && cargador.id ? editarCargador() : guardarNuevoCargador()"
          :disabled="cargador.cabeceras.length ? false : true"
        >
          <v-icon left>fas fa-save</v-icon>
          {{cargador && cargador.id ? 'Editar' : 'Guardar'}}
        </v-btn>
      </v-card-actions>
    </v-container>

    <!-- Dialog new Header -->
    <v-dialog v-model="dialogNewCabecera" max-width="800px" persistent>
        <v-card>
            <v-card-title class="headline">{{ isEdit ? 'Editar cabecera' : 'Nueva cabecera' }}</v-card-title>
            <v-card-text>
                <ValidationObserver
                    ref="formNewHeader"
                    v-slot="{ invalid, validated, passes, validate }"
                    autocomplete="off"
                >
                    <v-row>
                        <v-col class="pb-0" cols="3">
                            <c-texto
                            v-model="cabecera.header"
                            label="Nombre"
                            name="nombre"
                            upper-case
                            rules="required"
                            >
                            </c-texto>
                        </v-col>
                        <v-col class="pb-0" cols="3">
                            <c-select-complete
                            v-model="cabecera.type"
                            placeholder="Tipo"
                            name="tipo"
                            :items="tipoDatos ? tipoDatos : []"
                            item-text="nombre"
                            item-value="id"
                            rules="required"
                            >
                            </c-select-complete>
                        </v-col>
                        <v-col class="pb-0" cols="3">
                            <v-checkbox
                            style="mt-1"
                            v-model="cabecera.required"
                            label="Requerido"
                            ></v-checkbox>
                        </v-col>
                        <v-col class="mt-3" cols="3" v-if="cabecera.type && cabecera.type != 'INT'">
                            <c-texto
                            v-model="cabecera.length"
                            label="Longitud"
                            name="Longitud"
                            upper-case
                            rules="required"
                            >
                            </c-texto>
                        </v-col>
                    </v-row>
                </ValidationObserver>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialogNewHeader">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="isEdit ? updateHeader() : addHeader()">{{ isEdit ? 'Editar' : 'Guardar' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/sql/sql.js";
import "codemirror/theme/solarized.css";
export default {
  name: "CrearCargador",
  components: {
    codemirror,
  },
  props: {
    cargador: {
      type: Object,
      required: true,
    },
    stateCrearCargador: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    focusCOdemirror: false,
    patron: /:(\w+)(?!\w)/g,
    cmOptions: {
      tabSize: 4,
      lineWrapping: false,
      styleActiveLine: true,
      lineNumbers: true,
      line: true,
      mode: "text/x-mysql",
      theme: "solarized light",
    },
    tipoDatos: [
      { id: "INT", nombre: "INT" },
      { id: "VARCHAR", nombre: "VARCHAR" },
    ],
    tipoSeparador: [
      { id: "|", text: "|" },
      { id: ";", text: ";" },
      { id: ",", text: "," },
    ],
    item: null,
    closeCrearCargador: false,
    headers: [
      { text: "Nombre", value: "header" },
      { text: "Tipo", value: "type" },
      { text: "Longitud", value: "length" },
      { text: "Requerido", value: "required" },
    ],
    dialogNewCabecera: false,
    cabecera: null,
    cabeceraModel: {
        header: null,
        type: null,
        required: false,
        length: 0,
    },
    isEdit: false
  }),
  watch: {
      'cabecera.type': {
          handler(value) {
            if(value == 'INT'){
                this.cabecera.length = 0
            }
          }
      }
  },
  methods: {
    close() {
      this.$refs.formCargador.reset();
      this.$emit("closeCrearCargador", false);
    },
    addQuery() {
      let query = {
        query: '# Here write your query'
      }
      this.$emit('addQuery', query)
    },
    deleteQuery(item) {
      let deletedIndex = this.cargador.querys.indexOf(item)
      this.$emit('deleteQuery', deletedIndex)
    },
    editarCargador() {
        this.$refs.formCargador.validate().then(result => {
            if (result) {
                this.$emit('editCargador')
            }
        })
    },
    guardarNuevoCargador() {
        this.$refs.formCargador.validate().then(result => {
            if (result) {
                this.$emit('saveNewCargador')
            }
        })
    },
    crearNuevaCabecera() {
        this.isEdit = false
        this.cabecera = this.clone(this.cabeceraModel)
        this.dialogNewCabecera = true
    },
    editCabecera(item) {
        this.isEdit = true
        this.dialogNewCabecera = true
        let editedIndex = this.cargador.cabeceras.indexOf(item)
        item.index = editedIndex
        this.cabecera = this.clone(item)
    },
    closeDialogNewHeader() {
        this.cabecera = this.clone(this.cabeceraModel)
        this.$refs.formNewHeader.reset()
        this.dialogNewCabecera = false
    },
    addHeader() {
        this.$refs.formNewHeader.validate().then(result => {
            if (result) {
                this.$emit("addHeader", {idCargador: this.cargador.id, header: this.cabecera})
                this.closeDialogNewHeader()
            }
        })
    },
    updateHeader() {
        this.$refs.formNewHeader.validate().then(result => {
            if (result) {
                this.$emit("updateHeader", this.cabecera)
                this.closeDialogNewHeader()
            }
        })
    },
    deleteCabecera(item) {
        let editedIndex = this.cargador.cabeceras.indexOf(item)
        this.$emit("deleteHeader", editedIndex)
    },
  },
};
</script>

<style>
</style>