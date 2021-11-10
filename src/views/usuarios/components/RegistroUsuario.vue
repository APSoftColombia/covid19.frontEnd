<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <v-card>
      <ValidationObserver ref="formUsuario" v-slot="{ invalid, validated, passes, validate }" tag="form"
                          autocomplete="off" @submit.prevent="submitUsuario">
        <v-card-title class="headline">
          <v-avatar size="38" color="blue" class="mr-2">
            <v-icon class="white--text">mdi-account-plus</v-icon>
          </v-avatar>
          {{ usuario && usuario.id ? 'Edición de Usuario' : 'Nuevo Usuario' }}
          <v-spacer></v-spacer>
          <v-btn text icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class="ma-0 pa-0"></v-divider>
        <v-container fluid class="grid-list-md py-2">
          <v-row>
            <v-col class="pb-0" cols="12" sm="6">
              <ValidationProvider name="tipo identificación" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                    v-model="usuario.tipo_documento_identidad_id"
                    :label="(usuario.tipo_documento_identidad_id ? 'T' : 'Seleccionar t') + 'ipo identificación'"
                    :items="tiposDocumentoIdentidad"
                    item-value="id"
                    item-text="descripcion"
                    :error-messages="errors"
                    outlined
                    dense
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col class="pb-0" cols="12" sm="6">
              <ValidationProvider name="identificación" rules="required" v-slot="{ errors, valid }">
                <v-text-field
                    v-model="usuario.numero_documento_identidad"
                    label="Identificación"
                    :error-messages="errors"
                    outlined
                    dense
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col class="pb-0" cols="12">
              <ValidationProvider name="nombre completo" rules="required" v-slot="{ errors, valid }">
                <v-text-field
                    v-model="usuario.name"
                    label="Nombre completo"
                    :error-messages="errors"
                    outlined
                    dense
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12">
              <ValidationProvider name="correo electrónico" rules="required|email" v-slot="{ errors, valid }">
                <v-text-field
                    v-model="usuario.email"
                    label="Correo Electrónico"
                    :error-messages="errors"
                    outlined
                    dense
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <template>
              <v-col class="pb-0" cols="6">
                <ValidationProvider name="nombre de usuario" :rules="datosEmpresa && datosEmpresa.to_login === 'username' ? 'required' : ''" v-slot="{ errors, valid }">
                  <v-text-field
                      v-model="usuario.username"
                      label="Nombre de Usuario"
                      :error-messages="errors"
                      outlined
                      dense
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
            </template>
            <v-col class="pb-0" cols="6">
              <c-date
                  name="fecha vencimiento contrado"
                  v-model="usuario.expiry_date"
                  label="Fecha vencimiento contrato"
              ></c-date>
            </v-col>
            <template v-if="usuario.id === null">
              <v-col class="pb-0" cols="12" sm="6">
                <ValidationProvider name="Contraseña"
                                    :rules="{minlength:8, required: true, regex:usuario.password}"
                                    v-slot="{ errors, valid }">
                  <v-text-field
                      v-model="usuario.password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      dense
                      outlined
                      label="Contraseña"
                      :error-messages="errors"
                      :autocomplete="false"
                      @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
            </template>
            <v-col class="pb-0" cols="12" sm="6">
              <v-text-field
                  v-model="usuario.telefono"
                  label="Teléfono"
                  outlined
                  dense
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" sm="6">
              <v-text-field
                  v-model="usuario.direccion"
                  label="Dirección"
                  outlined
                  dense
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" :sm="usuario.id !== null ? 12 : 6">
              <c-date
                  v-model="usuario.fecha_nacimiento"
                  label="Fecha nacimiento"
                  :max="moment().format('YYYY-MM-DD')"
              >
              </c-date>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="autorizado">
              <c-select-complete
                v-model="usuario.tipo_cliente_id"
                label="Tipo de cliente"
                :items="tipo_clientes"
                item-text="nombre"
                item-value="id"
              >
              </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-combo
                  label="Cargo"
                  v-model="usuario.cargo"
                  :items="cargos"
                  name="cargo"
                  rules="required"
              />
            </v-col>
            <template v-if="usuario.cargo === 'MEDICO'">
              <v-col class="pb-0" cols="12">
                <ValidationProvider name="firma" rules="size:600" v-slot="{ errors, validate }">
                  <v-file-input
                      v-model="usuario.firmaFile"
                      :error-messages="errors"
                      :hint="usuario.firma && !usuario.firmaFile ? `Cargado actualmente: ${usuario.firma.split('/')[2]}` : ''"
                      label="Firma medico"
                      prepend-icon="mdi-file"
                      accept=".png,.jpeg"
                      outlined
                      dense
                      persistent-hint
                      show-size
                      :truncate-length="$vuetify.breakpoint.xsOnly ? 22 : 44"
                  />
                </ValidationProvider>
              </v-col>
              <v-col class="pb-0" cols="12">
                <v-text-field
                    v-model="usuario.registro_medico"
                    label="Registro Médico"
                    outlined
                    dense
                ></v-text-field>
              </v-col>
            </template>
            <v-col class="pb-0" cols="12">
              <v-autocomplete
                  label="EPS"
                  v-model="usuario.eps_id"
                  :items="epss"
                  outlined
                  dense
                  :filter="filterEpsTamizajes"
                  item-value="id"
                  persistent-hint
                  clearable
                  :hint="usuario.eps_id && epss && epss.length && epss.find(x => x.id === usuario.eps_id) ? `Código: ${epss.find(x => x.id === usuario.eps_id).codigo}` : '' "
              >
                <template v-slot:selection="{ item, index }">
                  <div class="pa-0 text-truncate" style="width: 100% !important;">
                    {{ item.nombre }}
                  </div>
                </template>
                <template v-slot:item="{ item, index }">
                  <template>
                    <v-list-item-content class="pa-0">
                      <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.codigo ? `Código: ${item.codigo}` : '' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col class="pb-0" cols="12">
              <buscador-ips
                  ref="buscadorips"
                  label="IPS"
                  v-model="usuario.cod_ips"
              />
            </v-col>
            <v-col class="pb-0" cols="12">
              <ValidationProvider name="roles" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                    v-model="usuario.roles"
                    :label="(usuario.roles && usuario.roles.length ? '' : 'Seleccionar ') + 'Roles'"
                    :items="rolesx"
                    item-value="id"
                    item-text="nombre"
                    :error-messages="errors"
                    return-object
                    multiple
                    outlined
                    dense
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-container>
        <v-divider class="ma-0 pa-0"></v-divider>
        <v-card-actions>
          <v-btn @click="cancel">
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary">
            <v-icon left>fas fa-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'RegistroUsuario',
  data: () => ({
    dialog: false,
    loading: false,
    usuario: null,
    makeUsuario: {
      id: null,
      numero_documento_identidad: null,
      tipo_documento_identidad_id: null,
      name: null,
      telefono: null,
      direccion: null,
      email: null,
      password: null,
      fecha_nacimiento: null,
      habilitado: 1,
      roles: [],
      eps_id: null,
      cod_ips: null,
      cargo: null,
      tipo_cliente_id: null,
      firma: null,
      firmaFile: null,
      registro_medico: null
    },
    showPassword: false,
    tiposDocumentoIdentidad: [],
    permisos: [],
    cargos: [],
    rolesx: [],
    tipo_clientes: [],
    filterEpsTamizajes(item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.codigo + ' ' + item.nombre)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    }
  }),
  computed: {
    ...mapGetters([
      'epss',
      'datosEmpresa',
      'getUser'
    ]),
    autorizado() {
      return this && this.getUser && !this.getUser.tipo_cliente_id
    }
  },
  watch: {
    dialog(val) {
      !val && this.$refs.formUsuario.reset()
    }
  },
  created() {
    this.getTiposClientes();
  },
  methods: {
    submitUsuario() {
      this.$refs.formUsuario.validate().then(async result => {
        if (result) {
          this.loading = true
          this.usuario.eps_id = this.usuario.eps_id ? this.usuario.eps_id : null
          let usuarioD = this.clone(this.usuario)
          if(this.usuario.firmaFile) {
            usuarioD.firmaFile = await new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.readAsDataURL(this.usuario.firmaFile)
              reader.onload = () => resolve(reader.result)
              reader.onerror = error => reject(error)
            })
          }
          let request = this.usuario.id ? this.axios.put(`user/${this.usuario.id}`, usuarioD) : this.axios.post(`user`, usuarioD)
          request
              .then(response => {
                this.$emit('save', response.data.usuario)
                this.$store.commit('snackbar', {color: 'success', message: `El usuario se ha guardado correctamente.`})
                this.cancel()
                this.loading = false
              })
              .catch(error => {
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al guardar los datos del usuario.`,
                  error: error
                })
                this.loading = false
              })
        }
      })
    },
    cancel() {
      this.dialog = false
      setTimeout(() => {
        this.resetUsuario()
      }, 400)
    },
    open(id = null) {
      this.resetUsuario()
      this.getUsuario(id)
      this.dialog = true
    },
    getTiposClientes() {
      this.axios.get('tipos-clientes')
          .then(response => {
            this.tipo_clientes = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al solicitar los complementos.`,
              error: error
            })
          })
    },
    getUsuario(id) {
      this.loading = true
      this.axios.get(id ? `user/${id}` : 'user/new')
          .then(response => {
            this.tiposDocumentoIdentidad = response.data.tipos_documento_identidad
            this.permisos = response.data.permisos
            this.rolesx = response.data.roles
            this.cargos = response.data.cargos.map(x => x.cargo)
            if (id) {
              // if (response.data.usuario.cod_ips) response.data.usuario.cod_ips = parseInt(response.data.usuario.cod_ips)
              this.usuario = response.data.usuario
              setTimeout(() => {
                if (this.$refs.buscadorips && this.usuario.ips) this.$refs.buscadorips.assign(this.usuario.ips)
              }, 500)
            }
            this.loading = false
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al solicitar los datos del usuario.`,
              error: error
            })
            this.dialog = false
            this.loading = false
          })
    },
    resetUsuario() {
      this.usuario = this.clone(this.makeUsuario)
    }
  }
}
</script>

<style scoped>

</style>
