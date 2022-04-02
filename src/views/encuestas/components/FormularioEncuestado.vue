<template>
  <v-row v-if="encuestado">
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="tipo identificación"
          rules="required"
          v-slot="{ errors, valid }"
      >
        <v-autocomplete
            v-model="encuestado.tipo_documento_identidad_id"
            :label="(encuestado.tipo_documento_identidad_id ? 'T' : 'Seleccionar t') + 'ipo identificación'"
            :items="tiposDocumentoIdentidad"
            item-value="id"
            item-text="descripcion"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="identificación"
          rules="required"
          v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model="encuestado.numero_documento_identidad"
            label="Identificación"
            :error-messages="errors"
            outlined
            :loading="loadingidentidad"
        >
          <template
              v-slot:append-outer
              class="ma-0"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                    class="mb-4"
                    color="primary"
                    slot="activator"
                    icon
                    v-on="on"
                    @click="searchAfiliadoIdentidad"
                >
                  <v-icon small>fas fa-search</v-icon>
                </v-btn>
              </template>
              <span>Buscar afiliado</span>
            </v-tooltip>
          </template>
        </v-text-field>
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="primer nombre"
          rules="required"
          v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model="encuestado.nombre1"
            label="Primer Nombre"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <v-text-field
          v-model="encuestado.nombre2"
          label="Segundo Nombre"
          outlined
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="primer apellido"
          rules="required"
          v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model="encuestado.apellido1"
            label="Primer Apellido"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <v-text-field
          v-model="encuestado.apellido2"
          label="Segundo Apellido"
          outlined
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="tipo de sangre"
          rules="required"
          v-slot="{ errors, valid }"
      >
        <v-select
            label="Tipo de Sangre"
            v-model="encuestado.tipo_sangre"
            :items="tiposSangre"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="estado civil"
          rules="required"
          v-slot="{ errors, valid }"
      >
        <v-select
            label="Estado civil"
            v-model="encuestado.estados_civile_id"
            item-value="id"
            item-text="nombre"
            :items="estadosCiviles"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="correo electrónico"
          rules="email"
          v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model="encuestado.email"
            label="Correo Electrónico"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="número de celular"
          rules="required|numeric" v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model.number="encuestado.numero_celular"
            label="Número de Celular principal"
            type="number"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <ValidationProvider
          name="número de celular opcional"
          rules="numeric"
          v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model.number="encuestado.numero_celular2"
            label="Número de Celular opcional"
            type="number"
            :error-messages="errors"
            outlined
        />
      </ValidationProvider>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
      <v-switch
          class="mt-3"
          v-model="encuestado.es_cabeza"
          label="Cabeza de familia"
          color="green"
          :true-value="1"
          :false-value="0"
      />
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'FormularioEncuestado',
  props: {
    encuestado: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    loadingidentidad: false,
    filterCentrosPoblados(item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(`${item.nombre} ${item.municipio ? item.municipio.nombre : ''} ${item.municipio && item.municipio.departamento ? item.municipio.departamento.nombre : ''}`)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    },
  }),
  computed: {
    ...mapGetters([
      'identidadesSexuales',
      'sexos',
      'tiposSangre',
      'estadosCiviles',
      'tiposDocumentoIdentidad',
      'centrosPoblados'
    ])
  },
  methods: {
    searchAfiliadoIdentidad() {
      if (this.encuestado.numero_documento_identidad) {
        this.loadingidentidad = true
        this.$store.dispatch('searchAfiliadoIdentidad', this.encuestado.numero_documento_identidad)
            .then(response => {
              if (response) {
                this.encuestado.tipo_documento_identidad_id = response.tipo_documento_identidad_id
                this.encuestado.numero_documento_identidad = response.numero_documento_identidad
                this.encuestado.nombre1 = response.nombre1
                this.encuestado.nombre2 = response.nombre2
                this.encuestado.apellido1 = response.apellido1
                this.encuestado.apellido2 = response.apellido2
                // this.encuestado.fecha_nacimiento = response.fecha_nacimiento
                // this.encuestado.sexo = response.sexo
                this.encuestado.tipo_sangre = response.tipo_sangre
                this.encuestado.estados_civile_id = response.estados_civile_id
                this.encuestado.email = response.email
                this.encuestado.numero_celular = response.numero_celular
                // this.encuestado.direccion = response.direccion
                // this.encuestado.centro_poblado_id = response.centro_poblado_id
                // this.encuestado.identidad_sexual = response.identidad_sexual
              }
              this.loadingidentidad = false
            })
      }
    }
  }
}
</script>
