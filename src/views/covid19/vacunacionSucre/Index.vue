<template>
  <v-container fluid>
    <page-title-bar title="Gestion de Vacunacion">
      <template slot="actions">
        <c-tooltip left tooltip="Crear Nueva Vacunacion" v-if="permisos.crearVacunacion">
          <v-btn
            color="primary"
            depressed
            :small="$vuetify.breakpoint.xsOnly"
            fab
            @click="crearItem"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </c-tooltip>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card tile flat>
          <data-tablex
            v-model="dataTable"
            items-loading
            @applyFilters="
              $refs && $refs.filtros && $refs.filtros.aplicaFiltros()
            "
          >
            <filtros
              slot="filters"
              ref="filtros"
              :ruta-base="rutaBase"
              @filtra="(val) => (dataTable.route = val)"
            />
            <template v-slot:tagsfilters="{ tags }">
              <tags-filters
                :tags="tags"
                @change="
                  $refs && $refs.filtros && $refs.filtros.aplicaFiltros()
                "
              />
            </template>
            <template v-slot:tabla="{ items, headers, loading }">
              <v-data-table
                :headers="headers"
                :items="items"
                :loading="loading"
                loading-text="Cargando... por favor espere"
                class="elevation-1 rounded-0 mb-12"
                hide-default-footer
                disable-pagination
              >
                <template v-slot:item.created_at="{ item }">
                  <div>{{ item.created_at ? moment(item.created_at).format('DD/MM/YYYY HH:mm') : '' }}</div>
                </template>
                <template v-slot:item.paciente="{ item }">
                  <persona-item
                    :sexo="item.sexo"
                    :nombre="`${item.nombre1} ${item.nombre2 ? item.nombre2 : ''} ${item.apellido1} ${item.apellido2 ? item.apellido2 : ''}`"
                    :tipo_identificacion="item.tipo_identificacion"
                    :numero_identificacion="item.identificacion"
                    :fecha_nacimiento="item.fecha_nacimiento"
                  />
                </template>
                <template v-slot:item.ubicacion="{ item }">
                  <ubicacion-component
                    :direccion="item.direccion"
                    :municipio_id="item.cod_mpio"
                  ></ubicacion-component>
                </template>
                <template v-slot:item.dosis="{ item }">
                  <v-list-item-content class="pa-0" v-if="item.acepta_vacuna">
                    <v-list-item-subtitle>
                      {{ item.tipo_dosis_persona ? item.tipo_dosis_persona.nombre : '' }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{ `Estrategia: ${item.estrategia_vacunacion}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content class="pa-0" v-else>
                    <v-list-item-subtitle>
                      No acepta Vacuna
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.biologico="{ item }">
                  <v-list-item-content class="pa-0" v-if="item.acepta_vacuna">
                    <v-list-item-subtitle>
                      {{ item.biologico_persona ? item.biologico_persona.nombre : '' }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{ `Lote: ${item.lote_biologico}` }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{ `Fecha aplicacion: ${item.fecha_aplicacion}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content class="pa-0" v-else>
                    <v-list-item-subtitle>
                      No acepta Vacuna
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.fecha_prog_2da_dosis="{ item }">
                  <v-list-item-content
                    v-if="item.fecha_prog_2da_dosis"
                    class="pa-0"
                  >
                    <v-list-item-subtitle>
                      {{ item.fecha_prog_2da_dosis }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{
                        `${moment(item.fecha_prog_2da_dosis, "YYYY-MM-DD").diff(
                          moment().format("YYYY-MM-DD"),
                          "days"
                        )} dias restantes`
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content
                    v-else
                    class="pa-0"
                  >
                    <v-list-item-subtitle>
                      No aplica
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.user="{ item }">
                  <v-list-item-content class="pa-0" v-if="item.user">
                    <v-list-item-title>
                      {{ item.user.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2">
                      {{ item.user.email }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.opciones="{ item }">
                  <div class="optionsButtons">
                    <v-toolbar>
                      <c-tooltip bottom tooltip="Editar" v-if="permisos.editarVacunacion && item.puede_editar">
                        <v-btn
                          class="ma-1"
                          color="blue"
                          depressed
                          fab
                          x-small
                          @click="editarItem(item)"
                        >
                          <v-icon color="white">mdi-pencil</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip bottom tooltip="Ver Detalle" v-if="permisos.verDetalleVacunacion">
                        <v-btn
                          class="ma-1"
                          color="success"
                          depressed
                          fab
                          x-small
                          @click="detalleItem(item)"
                        >
                          <v-icon>mdi-file-find</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip bottom tooltip="Eliminar registro" v-if="permisos.eliminarVacunacion">
                        <v-btn
                          class="ma-1"
                          color="error"
                          depressed
                          fab
                          x-small
                          @click="preEliminarItem(item)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </c-tooltip>
                    </v-toolbar>
                  </div>
                </template>
              </v-data-table>
            </template>
          </data-tablex>
        </v-card>
      </v-col>
    </v-row>
    <registro-vacunacion ref="registroItem" @guardado="itemGuardado" />
    <detalle-vacunacion ref="detalleItem" @guardado="itemGuardado" />
    <c-dialog ref="cdialog" @save="eliminarItem" />
  </v-container>
</template>

<script>
// TODO: Quitar del selector del tipo de salida, las opciones de Traslado y aplicacion - Detalle Bodegas
// TODO: Agregar selector de Tipo de Entrada, con la opcion de Ajuste y Normal - Detalle Bodegas

// TODO: PRIORIDAD

// *Pregunta lactancia despues de la EPS - Caracterizacion
// *Dejar todas las comorbilidades para cuando vaya a editar, por que no se estan mostrando - Caracterizacion
// *No permitir registrar con cedula que ya tenga un registro previo - Caracterizacion

// *cambiar el genero para radio buttons - Gestion Vacunacion
// *Cambiar label de Departamento, Municipio y barrio agregandole "... de residencia"
// ! TODO: Revisar el campo telefonos de ERP y dejarlo igual en Vacunacion - NOTA. El campo de telefono esta tal cual que en ERP
// TODO: Validar que si ya se aplico una dosis, en la siguiente solo pueda aplicarse el mismo biologico de la anteriors
// TODO: Mostrar un listado de las dosis anteriores cuando vaya a registrar una nueva aplicacion
// *Fecha aplicacion no inferior al 17/02/2021
// TODO: Bloquear fecha aplicacion min = de la ultima aplicacion
// *Cambiar el formulario de Editar para que solo me permita editar hasta el campo REGIMEN y Observaciones
// *Agregar parentesco para el acudiente
// *Generar alerta si usuario esta fallecido de acuerdo a info de afiliado y no permitir guardar (Buscar componente de InfoPersona Modal)
// TODO: Agregar columna de Fecha de creacion y actualizacion, visible = false. Despues de la columna ID en Index - Gestion Vacunacion
// *Quitar el campo de Condicion si el genero es Masculino
// TODO: En el Detalle agregar seccion de Registros fallidos/No desea vacuna con el numero de registros y que muestre una modal con los datos de esos registros. (Puede ser un badge en Vacunas tab)
// TODO: Hay que enviar todos los registros al detalle, sea que fuese efedctiva la vacuna o no
// *Campo de Eventos atribuidos requerido

const PersonaItem = () => import("./components/ItemListDataAfiliado");
const RegistroVacunacion = () => import("./components/RegistroVacunacion");
const Filtros = () => import("./components/FiltrosVacunacion");
const DetalleVacunacion = () => import("./components/DetalleVacunacion");
const UbicacionComponent = () => import("./components/UbicacionComponent");
import TagsFilters from "./components/TagsFilters";
export default {
  name: "GestionVacunacion",
  components: {
    TagsFilters,
    PersonaItem,
    DetalleVacunacion,
    RegistroVacunacion,
    UbicacionComponent,
    Filtros,
  },
  data: () => ({
    rutaBase: "dosis-aplicadas",
    dataTable: {
      advanceFilters: true,
      titleFilters: "Filtros Vacunacion",
      nameItemState: "tablaVacunacionSucre",
      route: "dosis-aplicadas",
      makeHeaders: [
        {
          text: "ID",
          sortable: false,
          value: "id",
        },
        {
          text: "Creacion",
          sortable: false,
          value: "created_at",
          visibleColumn: false,
        },
        {
          text: "Paciente",
          sortable: false,
          value: "paciente",
        },
        {
          text: "Ubicacion",
          sortable: false,
          value: "ubicacion",
        },
        {
          text: "Dosis",
          sortable: false,
          value: "dosis"
        },
        {
          text: "Biologico",
          sortable: false,
          value: "biologico"
        },
        {
          text: "Fecha 2da Dosis",
          sortable: false,
          value: "fecha_prog_2da_dosis",
        },
        {
          text: "Usuario",
          sortable: false,
          visibleColumn: false,
          value: "user",
        },
        {
          text: "",
          value: "opciones",
          align: "center",
          sortable: false,
        },
      ],
    },
    seleccionado: null,
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule("vacunacion");
    },
  },
  methods: {
    crearItem() {
      this.$refs.registroItem.open();
    },
    editarItem(item) {
      this.$refs.registroItem.open(item.id);
    },
    detalleItem(item) {
      this.$refs.detalleItem.open(item);
    },
    preEliminarItem(item) {
      this.seleccionado = item;
      this.$refs.cdialog.open(
        `¿Está seguro de eliminar el registro de la vacunacion ID: <strong>${this.seleccionado.id}</strong>?`
      );
    },
    eliminarItem() {
      this.axios
        .delete(`dosis-aplicadas/${this.seleccionado.id}`)
        .then(() => {
          this.$store.commit("snackbar", {
            color: "success",
            message: "Vacunacion eliminada correctamente.",
          });
          this.$refs.cdialog.close();
          this.itemGuardado();
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: " al eliminar el registro de la vacunacion.",
            error: error,
          });
          this.$refs.cdialog.loading = false;
        });
    },
    itemGuardado() {
      this.$store.commit("reloadTable", "tablaVacunacionSucre");
    },
  },
};
</script>
