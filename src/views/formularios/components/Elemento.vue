<template>
    <div>
        <ValidationProvider :name="name" :rules="rules" v-slot="{ errors, valid }">
            <v-radio-group
                    v-if="tipo === 1"
                    v-model="model"
                    row
                    :error-messages="errors"
                    outlined
                    class="mt-0"
                    :dense="dense"
            >
                <label class="mb-2 v-messages__message" style="width: 100% !important;">
                    {{label}}
                    <v-tooltip top v-if="descripcion">
                        <template v-slot:activator="{ on }">
                            <v-icon small class="mr-2" color="info" dark v-on="on">mdi-help-circle</v-icon>
                        </template>
                        <span>{{descripcion}}</span>
                    </v-tooltip>
                </label>
                <template v-for="(item, indexItem) in items">
                    <v-radio class="ml-3" :key="'indexsino' + indexItem" :label="item.nombre" :value="item.uuid"></v-radio>
                </template>
            </v-radio-group>
            <template v-else-if="[2, 15, 3, 4, 11, 14].find(x => x === tipo)">
                <label class="pb-1 v-messages__message" style="width: 100% !important;">
                    {{label}}
                    <v-tooltip top v-if="descripcion">
                        <template v-slot:activator="{ on }">
                            <v-icon small class="mr-2" color="info" dark v-on="on">mdi-help-circle</v-icon>
                        </template>
                        <span>{{descripcion}}</span>
                    </v-tooltip>
                </label>
                <template v-if="tipo === 2">
                    <v-select
                            v-if="items && items.length <= 20"
                            v-model="model"
                            :placeholder="label"
                            :items="items"
                            item-text="nombre"
                            item-value="uuid"
                            prepend-inner-icon="mdi-format-list-bulleted"
                            outlined
                            :dense="dense"
                            :error-messages="errors"
                            clearable
                    ></v-select>
                    <v-autocomplete
                            v-else
                            v-model="model"
                            :placeholder="label"
                            :items="items"
                            item-text="nombre"
                            item-value="uuid"
                            prepend-inner-icon="mdi-format-list-bulleted"
                            outlined
                            :dense="dense"
                            :error-messages="errors"
                            clearable
                    ></v-autocomplete>
                </template>
                <template v-else-if="tipo === 15">
                    <v-select
                            v-if="items && items.length <= 10"
                            v-model="model"
                            :placeholder="label"
                            :items="items"
                            item-text="nombre"
                            item-value="uuid"
                            prepend-inner-icon="mdi-format-list-checkbox"
                            outlined
                            multiple
                            :dense="dense"
                            :error-messages="errors"
                            clearable
                    ></v-select>
                    <v-autocomplete
                            v-else
                            v-model="model"
                            :placeholder="label"
                            :items="items"
                            item-text="nombre"
                            item-value="uuid"
                            prepend-inner-icon="mdi-format-list-checkbox"
                            outlined
                            multiple
                            :dense="dense"
                            :error-messages="errors"
                            clearable
                    ></v-autocomplete>
                </template>
                <template v-else-if="tipo === 3">
                    <v-text-field
                            v-model="model"
                            :placeholder="label"
                            outlined
                            prepend-inner-icon="mdi-format-color-text"
                            :dense="dense"
                            :error-messages="errors"
                            clearable
                    ></v-text-field>
                </template>
                <v-text-field
                        v-else-if="tipo === 4"
                        v-model.number="model"
                        :placeholder="label"
                        type="number"
                        :min="min"
                        :max="max"
                        step="0.1"
                        prepend-inner-icon="mdi-sort-numeric"
                        outlined
                        :dense="dense"
                        :error-messages="errors"
                        clearable
                ></v-text-field>
                <v-textarea
                        v-else-if="tipo === 11"
                        v-model="model"
                        :placeholder="label"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-textarea"
                        outlined
                        clearable
                ></v-textarea>
                <v-text-field
                        v-else-if="tipo === 14"
                        v-model.number="model"
                        :placeholder="label"
                        type="number"
                        prepend-inner-icon="mdi-calendar-account"
                        outlined
                        :readonly="readonly"
                        :dense="dense"
                        :error-messages="errors"
                        clearable
                ></v-text-field>
            </template>
        </ValidationProvider>
        <template v-if="tipo === 5">
            <label class="pb-1 v-messages__message justify-start" style="width: 100% !important;">{{label}}</label>
            <v-menu
                    v-model="menuFecha"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <ValidationProvider :name="name" :rules="rules" v-slot="{ errors, valid }">
                        <v-text-field
                                v-model="model"
                                :placeholder="label"
                                prepend-inner-icon="mdi-calendar-month"
                                readonly
                                outlined
                                :dense="dense"
                                v-on="on"
                                :error-messages="errors"
                                clearable
                        ></v-text-field>
                    </ValidationProvider>
                </template>
                <v-date-picker
                        v-model="model"
                        @input="menuFecha = false"
                        :min="min"
                        :max="max"
                ></v-date-picker>
            </v-menu>
        </template>
        <template v-else-if="tipo === 6">
            <label class="pb-1 v-messages__message justify-start" style="width: 100% !important;">{{label}}</label>
            <v-menu
                    ref="menuTime"
                    v-model="menuTime"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="model"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <ValidationProvider :name="name" :rules="rules" v-slot="{ errors, valid }">
                        <v-text-field
                                v-model="model"
                                :placeholder="label"
                                prepend-inner-icon="mdi-clock-outline"
                                readonly
                                outlined
                                :dense="dense"
                                v-on="on"
                                :error-messages="errors"
                                clearable
                        ></v-text-field>
                    </ValidationProvider>
                </template>
                <v-time-picker
                        v-if="menuTime"
                        v-model="model"
                        format="24hr"
                        full-width
                        @click:minute="$refs.menuTime.save(model)"
                        :min="min"
                        :max="max"
                ></v-time-picker>
            </v-menu>
        </template>
        <v-divider v-else-if="tipo === 7"></v-divider>
        <div v-else-if="tipo === 8" class="title text-center">{{label}}</div>
        <div v-else-if="tipo === 10">
            <div class="caption ml-2" :class="errorMessages.length ? 'error--text' : ''">{{label}}</div>
            <v-card flat class="text-center">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn
                                absolute
                                dark
                                fab
                                bottom
                                right
                                color="indigo"
                                class="mb-8 ml-10"
                                @click.stop="limpiarFirma"
                                v-on="on"
                        >
                            <v-icon>fas fa-eraser</v-icon>
                        </v-btn>
                    </template>
                    <span>Borrar</span>
                </v-tooltip>
                <VueSignaturePad
                        id="signature"
                        width="100%"
                        height="300px"
                        ref="signaturePad"
                        :options="{ onBegin, onEnd }"
                />
                <div class="caption error--text" style="height: 16px !important;">{{errorMessages.length ? errorMessages[0] : ''}}</div>
            </v-card>
        </div>
        <div v-else-if="tipo === 12">
            <v-text-field
                    :label="label"
                    readonly
                    outlined
                    v-model="model"
                    :dense="dense"
                    prepend-inner-icon="mdi-map-marker-radius"
                    clearable
            >
                <template v-slot:append>
                    <v-fade-transition leave-absolute>
                        <v-progress-circular
                                v-if="loadingLocation"
                                size="24"
                                color="info"
                                indeterminate
                        ></v-progress-circular>
                        <v-icon v-else color="indigo" @click.stop="getLocation">mdi-map-marker-right</v-icon>
                    </v-fade-transition>
                </template>
            </v-text-field>
        </div>
        <div v-else-if="tipo === 13">
            <ValidationProvider :name="name" :rules="rules" v-slot="{ errors, valid }">
                <v-text-field
                        :label="label"
                        readonly
                        outlined
                        v-model="model"
                        :dense="dense"
                        clearable
                        prepend-inner-icon="fas fa-map-signs"
                        :error-messages="errors"
                        @click="construirDireccion"
                >
                </v-text-field>
            </ValidationProvider>
            <constructor-direccion
                    :es-urbana="esUrbana"
                    ref="constructorDireccion"
                    @save="direccion => guardaDireccion(direccion)"
            ></constructor-direccion>
        </div>
    </div>
</template>

<script>
    const ConstructorDireccion = () => import('Views/formularios/components/ConstructorDireccion')
    export default {
        name: 'Elemento',
        props: {
            tipo: {
                type: Number,
                default: null
            },
            esUrbana: {
                type: Number,
                default: 0
            },
            value: {
                type: [Number, String, Object, Array],
                default: null
            },
            dataExtra: {
                type: [Number, String, Object],
                default: null
            },
            label: {
                type: String,
                default: null
            },
            descripcion: {
                type: String,
                default: null
            },
            items: {
                type: Array,
                default: () => []
            },
            name: {
                type: String,
                default: null
            },
            rules: {
                type: String,
                default: null
            },
            errorMessages: {
                type: Array,
                default: () => []
            },
            min: {
                type: [Number, String],
                default: null
            },
            max: {
                type: [Number, String],
                default: null
            },
            dense: {
                type: Boolean,
                default: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        components: {
            ConstructorDireccion
        },
        data: () => ({
            model: null,
            menuFecha: false,
            menuTime: false,
            loadingLocation: false
        }),
        watch: {
            dataExtra: {
                handler (val) {
                    val && this.tipo === 14 && this.getAnios()
                },
                immediate: true
            },
            model: {
                handler (val) {
                    this.$emit('input', (typeof val !== 'undefined') ? val : null)
                },
                immediate: false
            },
            value: {
                handler (val) {
                    this.model = ((typeof val !== 'undefined') ? val : null)
                },
                immediate: true
            }
        },
        computed: {
            stringLocation () {
                if (this && this.tipo === 12) {
                    return (typeof this.value !== 'undefined') && (this.value !== null) ? [this.value.latitude, this.value.longitude, this.value.accuracy].join(', ') : null
                } else {
                    return null
                }
            }
        },
        // mounted() {
        //     setTimeout(() => {
        //         if (this.tipo === 10) {
        //             this.$refs.signaturePad.clearCacheImages()
        //             let img64 = this.$refs.signaturePad.fromDataURL({isEmpty: false, data: (this.value || null)})
        //             this.$emit('input', img64.data)
        //         }
        //     }, 1000)
        // },
        methods: {
            getAnios () {
                let hoy = new Date();
                let cumpleanos = new Date(this.dataExtra);
                let edad = hoy.getFullYear() - cumpleanos.getFullYear();
                let m = hoy.getMonth() - cumpleanos.getMonth();

                if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                    edad--
                }
                this.$emit('input', edad > 0 ? edad : 0)
            },
            onBegin () {
            },
            onEnd () {
                let img64 = this.$refs.signaturePad.saveSignature()
                this.$emit('input', img64.data)
            },
            limpiarFirma() {
                this.$refs.signaturePad.clearSignature()
                this.$emit('input', null)
            },
            getLocation () {
                if (navigator.geolocation)
                {
                    this.loadingLocation = true
                    navigator.geolocation.getCurrentPosition(objPosition =>
                    {
                        setTimeout(() => {
                            // this.$emit('input', {latitude: objPosition.coords.latitude, longitude: objPosition.coords.longitude, accuracy: objPosition.coords.accuracy})
                            this.$emit('input',(`${objPosition.coords.latitude}, ${objPosition.coords.longitude}`))
                            this.loadingLocation = false
                        }, 1000)
                    }, objPositionError =>
                    {
                        let message = ''
                        switch (objPositionError.code)
                        {
                            case objPositionError.PERMISSION_DENIED:
                                message = 'No se ha permitido el acceso a la posición del usuario.'
                                break;
                            case objPositionError.POSITION_UNAVAILABLE:
                                message = 'No se ha podido acceder a la información de su posición.'
                                break;
                            case objPositionError.TIMEOUT:
                                message = 'El servicio ha tardado demasiado tiempo en responder.'
                                break;
                            default:
                                message = 'Error desconocido.'
                        }
                        setTimeout(() => {
                            this.$store.commit('snackbar', {color: 'error', message: message})
                            this.loadingLocation = false
                        }, 1000)
                    }, {
                        maximumAge: 75000,
                        timeout: 15000
                    });
                }
                else
                {
                    this.$store.commit('snackbar', {color: 'warning', message: 'Su navegador no soporta la API de geolocalización.'})
                }
            },
            guardaDireccion (direccion) {
                this.$emit('input', direccion)
            },
            construirDireccion () {
                this.$refs.constructorDireccion.open()
            }
        }
    }
</script>

<style scoped>
    #signature {
        border: double 2px transparent;
        border-radius: 5px;
        background-image: linear-gradient(white, white),
        radial-gradient(circle at top left, #4bc5e8, #9f6274);
        background-origin: border-box;
        background-clip: content-box, border-box;
    }
</style>