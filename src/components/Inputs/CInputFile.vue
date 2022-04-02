<template>
  <v-list-item
      v-if="detail"
      @click="click = false"
  >
    <v-list-item-avatar
        v-if="showIcon"
        size="38"
    >
      <v-icon color="primary">{{icon}}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
      <v-list-item-title :class="(vmodel && vmodel.name) ? '' : 'orange--text'">{{ (vmodel && vmodel.name) || 'No se ha cargado un archivo.' }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action v-if="vmodel">
      <c-tooltip tooltip="Descargar Archivo" top>
        <v-btn
            fab
            small
            :color="vmodel ? 'primary' : ''"
            :href="vmodel.url"
            @click="downloadFile"
            :target="vmodel.mimetype === 'application/pdf' ? '_blank' : ''"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </c-tooltip>
    </v-list-item-action>
  </v-list-item>
  <ValidationProvider
      v-else
      :name="name"
      :vid="vid"
      :rules="rules"
      v-slot="{ errors }"
  >
    <v-file-input
        :value="model"
        :label="label"
        :name="name"
        :error-messages="errors"
        :clearable="true"
        :placeholder="placeholder"
        :outlined="outlined"
        :dense="dense"
        :disabled="disabled"
        :readonly="readonly"
        :accept="accept"
        :hint="hint"
        :persistent-hint="persistentHint"
        :prepend-inner-icon="icon"
        prepend-icon=""
        :loading="loading"
        @change="val => changeInput(val)"
        class="inputFile"
    >
      <template v-slot:selection>
        {{ vmodel && vmodel.name || '' }}
      </template>
      <template v-slot:append-outer>
        <v-btn
            v-if="vmodel"
            icon
            :color="vmodel ? 'primary' : ''"
            :href="vmodel.url"
            @click="downloadFile"
            :target="vmodel.mimetype === 'application/pdf' ? '_blank' : ''"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
    </v-file-input>
  </ValidationProvider>
</template>

<script>

export default {
  name: 'CInputFile',
  props: {
    value: {
      type: Object,
      default: null
    },
    detail: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    directory: {
      type: String,
      default: 'pruebas'
    },
    placeholder: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: null
    },
    vid: {
      type: String,
      default: null
    },
    rules: {
      type: String,
      default: null
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: 'seleccionar archivo'
    },
    accept: {
      type: String,
      default: '.pdf,image/*'
    },
    icon: {
      type: String,
      default: 'mdi-paperclip'
    }
  },
  data: () => ({
    vmodel: null,
    model: null,
    loading: false,
    click:false
  }),
  watch: {
    value: {
      handler(val) {
        this.assignValue(val)
      },
      immediate: true
    }
  },
  methods: {
    downloadFile() {
      if (this.vmodel) {
        this.axios.get(`upload-file/${this.vmodel.id}`)
            .catch(e => {
              this.loading = false
              this.$store.commit('snackbar', {
                color: 'error',
                message: `Error al descargar el archivo.`,
                error: e
              })
            })
      }
    },
    changeInput(val) {
      if (this.isFile(val)) this.saveFile(val)
      if (typeof val === 'undefined') this.model = {}
      if (val === null) this.$emit('input', null)
    },
    isFile(val) {
      return ('File' in window && val instanceof File)
    },
    assignValue(val) {
      this.vmodel = JSON.parse(JSON.stringify(val))
      if (this.vmodel === null) {
        this.model = null
        this.$emit('uuid', null)
      } else {
        if (this.model === null) this.model = {}
        this.vmodel.url = `${this.axios?.defaults?.baseURL}/upload-file/${this.vmodel.id}`
        this.$emit('uuid', this.vmodel.id)
      }
    },
    saveFile(val) {
      this.loading = true
      let data = new FormData()
      data.append('id', this.$uuid.v1())
      data.append('directory', this.directory)
      data.append('file', val)
      this.axios.post(`upload-file`, data)
          .then(response => {
            this.$emit('input', response.data)
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: `Error al cargar el archivo.`,
              error: e
            })
          })
    }
  }
}
</script>

<style>
.inputFile .v-input__append-outer {
  margin-top: 2px !important;
}
</style>