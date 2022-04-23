<template>
  <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="1020px"
  >
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar
              color="green"
          >
            <v-icon class="white--text">mdi-file-excel</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
                class="title"
            >
              Errores de Archivo
            </v-list-item-title>
            <p
                class="ma-0 subtitle-2"
            >
            </p>
          </v-list-item-content>
          <v-list-item-action style="flex-direction: row">
            <v-btn
                icon
                large
                @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-text style="height: 100%;">
        <v-container fluid class="pb-0">
          <v-row dense>
            <v-col cols="12" v-if="errors.length">
              <v-subheader class="title error--text">El archivo cargado presenta {{ errors.length }}
                error{{ errors.length === 1 ? '' : 'es' }}
              </v-subheader>
              <v-simple-table id="tableID">
                <template v-slot:default>
                  <tbody>
                  <tr
                      v-for="(error, errorIndex) in errors"
                      :key="errorIndex"
                  >
                    <td
                        class="text-center"
                        style="height: 24px !important;"
                    >
                      {{ errorIndex + 1 }}
                    </td>
                    <td
                        style="height: 24px !important; white-space:normal !important;"
                    >
                      {{ error }}
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <errors-download
          :id="id"
      />
    </v-card>
  </v-dialog>
</template>

<script>

import ErrorsDownload from './ErrorsDownload'
export default {
  name: 'LoadErrors',
  components: {ErrorsDownload},
  props: {
    id: {
      type: Number,
      default: null
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dialog: false
  }),
  watch: {
    dialog: {
      handler(val) {
        if (val) this.open()
      },
      immediate: false
    }
  },
  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false
    }
  }
}
</script>