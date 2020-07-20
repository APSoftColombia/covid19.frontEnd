<template>
	<v-container fluid class="grid-list-md" :class="anidado ? 'pa-0' : ''">
		<ValidationObserver ref="formEncuesta" v-slot="{ invalid, validated, passes, validate }" tag="form" autocomplete="off">
			<v-card v-if="encuesta">
				<page-title-bar v-if="encuesta.formulario" :title="`Encuesta: ${encuesta.formulario.nombre}`">
					<template slot="actions">
						<v-btn icon @click="anidado ? $emit('close') : closeEncuesta()">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</template>
				</page-title-bar>
				<div v-if="!anidado" :style="`right: ${$vuetify.breakpoint.xsOnly ? '84' : '104' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '94' : '104' }px !important; position: fixed !important; z-index: 2 !important;`">
					<v-chip
							color="primary"
							label
					>
						<v-icon left>mdi-timer</v-icon>
						{{time}}
					</v-chip>
				</div>
				<v-card-text v-if="encuesta.formulario">
					{{encuesta.formulario.descripcion}}
				</v-card-text>
				<v-card-text v-if="encuesta.formulario && encuesta.formulario.encuestado_activo">
					<ValidationObserver ref="formEncuestado" v-slot="{ invalid, validated, passes, validate }" tag="form" autocomplete="off">
						<v-card>
							<v-toolbar dense>
								<v-toolbar-title>
									<v-avatar color="primary" size="40">
										<v-icon class="white--text">mdi-account-details</v-icon>
									</v-avatar>
									Encuestado
								</v-toolbar-title>
							</v-toolbar>
							<v-container fluid class="grid-list-md">
								<formulario-encuestado :encuestado="encuesta.encuestado"></formulario-encuestado>
							</v-container>
						</v-card>
					</ValidationObserver>
				</v-card-text>
				<v-card-text v-if="encuesta.formulario && encuesta.formulario.ubicacion_activa">
					<ValidationObserver ref="formUbicacion" v-slot="{ invalid, validated, passes, validate }" tag="form" autocomplete="off">
						<v-card>
							<v-toolbar dense>
								<v-toolbar-title>
									<v-avatar color="primary" size="40">
										<v-icon class="white--text">mdi-map-search</v-icon>
									</v-avatar>
									Ubicación
								</v-toolbar-title>
							</v-toolbar>
							<v-container fluid class="grid-list-md">
								<formulario-ubicacion :ubicacion="encuesta.ubicacion"></formulario-ubicacion>
								<v-row align="center" justify="center">
									<v-chip
											class="mx-2"
											:class="encuesta.visita_fallida ? 'mb-7' : ''"
											:color="encuesta.visita_fallida ? 'error' : 'success'"
											text-color="white"
									>
										<v-switch
												v-model="encuesta.visita_fallida"
												color="white"
												:true-value="1"
												:false-value="0"
										></v-switch>
										{{encuesta.visita_fallida ? 'Visita Fallida' : 'Visita Efectiva'}}
									</v-chip>
									<template v-if="encuesta.visita_fallida">
										<ValidationProvider name="causal de visita fallida" rules="required" v-slot="{ errors, valid }">
											<v-select
													v-model="encuesta.causal_visita_fallida_id"
													label="Causal de visita fallida"
													:items="causalesVisitaFallida"
													item-text="causal"
													item-value="id"
													outlined
													:error-messages="errors"
											></v-select>
										</ValidationProvider>
									</template>
								</v-row>
							</v-container>
						</v-card>
					</ValidationObserver>
				</v-card-text>
				<template v-if="encuesta.seccionGuardada !== null">
					<v-expand-transition>
						<v-card-text v-if="encuesta.formulario && encuesta.formulario.ubicacion_activa && !encuesta.visita_fallida">
							<v-card>
								<v-toolbar dense>
									<v-toolbar-title>
										<v-avatar color="primary" size="40">
											<v-icon class="white--text">mdi-account-group</v-icon>
										</v-avatar>
										Miembros del núcleo
									</v-toolbar-title>
									<v-spacer></v-spacer>
									<v-tooltip left>
										<template v-slot:activator="{ on }">
											<v-btn icon color="primary" v-on="on" @click="agregarAnidado(encuesta.formulario.formulario_individual_uuid)">
												<v-icon>mdi-plus</v-icon>
											</v-btn>
										</template>
										<span>Agregar miembro</span>
									</v-tooltip>
								</v-toolbar>
								<v-list>
									<template v-for="(anidado, indexanidado) in encuesta.individuales">
										<v-list-item
												:key="`anidado${indexanidado}`"
												@click="agregarAnidado(encuesta.formulario.formulario_individual_uuid, anidado)"
										>
											<v-list-item-content v-if="anidado.encuestado">
												<v-list-item-title>{{[anidado.encuestado.nombre1, anidado.encuestado.nombre2, anidado.encuestado.apellido1, anidado.encuestado.apellido2].filter(x => x).join(' ')}} </v-list-item-title>
												<v-list-item-subtitle>{{tiposDocumentoIdentidad && tiposDocumentoIdentidad.find(x => x.id === anidado.encuestado.tipo_documento_identidad_id) && tiposDocumentoIdentidad.find(x => x.id === anidado.encuestado.tipo_documento_identidad_id).tipo}} {{anidado.encuestado.numero_documento_identidad}}</v-list-item-subtitle>
												<v-list-item-subtitle class="font-weight-bold">Código: {{moment(encuesta.created_at).format('YYYYMMDD')}}{{anidado.encuestado.numero_documento_identidad}}</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-action>
												<v-tooltip top>
													<template v-slot:activator="{ on }">
														<v-btn icon color="error" v-on="on" @click.stop="encuesta.individuales.splice(indexanidado, 1)">
															<v-icon>mdi-delete-forever</v-icon>
														</v-btn>
													</template>
													<span>Borrar miembro</span>
												</v-tooltip>
											</v-list-item-action>
										</v-list-item>
										<v-divider class="ma-0 pa-0" :key="`anidadoDivider${indexanidado}`"></v-divider>
									</template>
								</v-list>
							</v-card>
							<formulario-anidado ref="formularioAnidado" :encuesta-padre="{uuid: encuesta.uuid, ubicacion: encuesta.ubicacion}" @guardaranidado="val => guardarEncuestaAnido(val)"></formulario-anidado>
						</v-card-text>
					</v-expand-transition>
					<v-expand-transition>
						<v-card-text class="ma-0 pa-0 elevation-0" v-if="encuesta.formulario && !encuesta.visita_fallida">
							<filtrar-secciones
									:encuesta="encuesta"
									@input="val => listSecciones = val"
							></filtrar-secciones>
							<v-stepper v-model="step" vertical class="elevation-0 pb-0" v-if="listSecciones.length">
								<template
										v-for="(seccion, iseccion) in listSecciones"
								>
									<ValidationObserver v-slot="{ invalid, validated, passes, validate }" ref="formSeccion" :key="'seccion' + (iseccion + 1)">
										<v-stepper-step :editable="encuesta.seccionGuardada === (iseccion + 1)" :complete="step > (iseccion + 1) || encuesta.seccionGuardada === (iseccion + 1)" :step="(iseccion + 1)" :rules="[() => !(invalid || encuesta.seccionGuardada < (iseccion + 1))]">
											{{seccion.nombre}}
											<small class="pt-2 error--text" v-if="invalid">Preguntas por diligenciar</small>
										</v-stepper-step>
										<v-stepper-content
												:step="(iseccion + 1)"
												class="ml-0"
										>
											<template v-if="step === (iseccion + 1)">
												<v-row>
													<template v-for="(pregunta, ipregunta) in seccion.preguntas">
														<elemento-respuesta
																:referencias="referencias"
																:key="`elemntoRespuesta${ipregunta}`"
																:pregunta="pregunta"
																:secciones="encuesta.formulario.secciones"
																:encuesta="encuesta"
																:encuesta-padre="encuestaPadre"
																v-if="pregunta.referencia !== 'vinculacionFamiliar' || (pregunta.referencia === 'vinculacionFamiliar' && !cabeza)"
														></elemento-respuesta>
													</template>
												</v-row>
												<v-divider class="mt-0"></v-divider>
												<div class="mb-2">
													<v-btn @click="step--" v-if="step > 0 && !invalid" class="mr-2">
														<v-icon left>mdi-arrow-up-bold</v-icon>
														Anterior
													</v-btn>
													<v-btn color="primary" @click="guardarEncuesta" v-if="step < listSecciones.length">
														<v-icon left>fas fa-save</v-icon>
														Siguiente
														<v-icon right>mdi-arrow-down-bold</v-icon>
													</v-btn>
													<template v-else-if="step === listSecciones.length">
														<v-btn color="primary" @click="guardarEncuesta" class="mr-2">
															<v-icon left>fas fa-save</v-icon>
															Guardar
														</v-btn>
														<v-btn color="success" @click="confirmarEncuesta" v-if="!anidado">
															<v-icon left>fas fa-save</v-icon>
															Guardar y Finalizar
														</v-btn>
													</template>
												</div>
											</template>
										</v-stepper-content>
									</ValidationObserver>
								</template>
							</v-stepper>
						</v-card-text>
					</v-expand-transition>
				</template>
				<v-card-text>
					<v-textarea
							v-model="encuesta.observaciones"
							label="Observaciones"
							rows="3"
							outlined
					></v-textarea>
					<template>
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<v-btn
										v-on="on"
										fab
										fixed
										bottom
										left
										@click="closeEncuesta()"
								>
									<v-icon>mdi-close</v-icon>
								</v-btn>
							</template>
							<span>Cerrar</span>
						</v-tooltip>
						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-btn
										@click="guardarEncuesta"
										v-on="on"
										color="primary"
										fab
										fixed
										bottom
										right
								>
									<v-icon>fas fa-save</v-icon>
								</v-btn>
							</template>
							<span>Guardar</span>
						</v-tooltip>
					</template>
				</v-card-text>
				<app-section-loader :status="loading"></app-section-loader>
			</v-card>
		</ValidationObserver>
		<confirmation-dialog
				ref="confirmation"
				:heading="dialog.heading"
				:message="dialog.message"
				:loading="dialog.loading"
				:color-confirm="''"
				color-cancel="error"
				@confirm="confirmCerrar"
		></confirmation-dialog>
		<confirmation-dialog
				ref="confirmationsave"
				:heading="dialogSave.heading"
				:message="dialogSave.message"
				:loading="dialogSave.loading"
				:color-confirm="dialogSave.btnColor"
				@confirm="confirmSave"
		></confirmation-dialog>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>
	import {mapGetters} from 'vuex'
	const ElementoRespuesta = () => import('Views/encuestas/components/ElementoRespuesta')
	const FiltrarSecciones = () => import('Views/encuestas/components/FiltrarSecciones')
	const FormularioEncuestado = () => import('Views/encuestas/components/FormularioEncuestado')
	const FormularioUbicacion = () => import('Views/encuestas/components/FormularioUbicacion')
	const FormularioAnidado = () => import('Views/encuestas/components/FormularioAnidado')
	export default {
		name: 'DiligenciaEncuesta',
		props: {
			encuestaPadre: {
				type: Object,
				default: null
			},
			formulariouuid: {
				type: [String, Number],
				default: null
			},
			uuid: {
				type: [String, Number],
				default: null
			},
			formularioAnidadoAnexo: {
				type: Object,
				default: null
			},
			encuestaEditar: {
				type: Object,
				default: null
			},
			anidado: {
				type: Boolean,
				default: false
			}
		},
		components: {
			FiltrarSecciones,
			ElementoRespuesta,
			FormularioEncuestado,
			FormularioUbicacion,
			FormularioAnidado
		},
		data () {
			return {
				listSecciones: [],
				dialog: {
					heading: '',
					message: '',
					loading: false,
					registro: null,
					btnColor: 'warning'
				},
				dialogSave: {
					heading: '',
					message: '',
					loading: false,
					registro: null,
					btnColor: 'success'
				},
				loading: true,
				encuesta: null,
				makeEncuesta: {
					id: null,
					uuid: null,
					duracion: 0,
					finalizada: 0,
					formulario: null,
					encuestado: null,
					ubicacion: null,
					encuesta_padre_id: null,
					encuesta_padre_uuid: null,
					individuales: [],
					observaciones: null,
					visita_fallida: 0,
					causal_visita_fallida_id: null,
					fecha_sincronizado: null,
					seccionGuardada: null
				},
				makeEncuestado: {
					id: null,
					uuid: null,
					tipo_documento_identidad_id: null,
					numero_documento_identidad: null,
					nombre1: null,
					nombre2: null,
					apellido1: null,
					apellido2: null,
					tipo_sangre: null,
					estados_civile_id: null,
					email: null,
					numero_celular: null,
					numero_celular2: null,
					es_cabeza: 0
				},
				makeUbicacion: {
					id: null,
					uuid: null,
					municipio_id: null,
					barrios_vereda_id: null,
					urbano: 1,
					direccion: null,
					geolocalizacion: null
				},
				step: 1
			}
		},
		computed: {
			cabeza () {
				return this && this.encuesta && this.encuesta.encuestado && this.encuesta.encuestado.es_cabeza
			},
			...mapGetters([
				'tiposDocumentoIdentidad',
				'causalesVisitaFallida',
				'encuestaEnCurso'
			]),
			referencias () {
				let preguntasList = []
				if (this && this.encuesta && this.encuesta.formulario && this.encuesta.formulario.secciones && this.encuesta.formulario.secciones.length) {
					this.encuesta.formulario.secciones.map(x => x.preguntas).forEach(z => preguntasList = preguntasList.concat(z.filter(j => j.referencia)))
				}
				return preguntasList
			},
			time () {
				let h = 0
				let m = 0
				let s = 0
				if (this && this.encuesta) {
					let initime = this.clone(this.encuesta.duracion)
					h = Math.trunc(initime / 3600)
					initime = initime - (h * 3600)
					m = Math.trunc(initime / 60)
					initime = initime - (m * 60)
					s = initime
				}
				return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
			}
		},
		watch: {
			'encuesta.visita_fallida' (val) {
				!val && (this.encuesta.causal_visita_fallida_id = null)
			},
			formulariouuid: {
				handler(val) {
					val && this.assignFormulario(val)
				},
				immediate: true
			},
			uuid: {
				handler(val) {
					val && this.obtenerEncuesta(val)
				},
				immediate: true
			},
			'listSecciones.length': {
				handler(val) {
					if (val) this.step = this.encuesta && this.encuesta.seccionGuardada ? this.encuesta.seccionGuardada: 1
				},
				immediate: false
			}
		},
		destroyed() {
			clearInterval()
		},
		methods: {
			closeEncuesta () {
				if (this.encuestaEnCurso) {
					if (this.anidado) {
						this.dialog.heading = 'Cerrar formulario'
						this.dialog.message = `El formulario se cerrará y los datos no guardados se perderan.`
					} else {
						this.dialog.heading = 'Cerrar encuesta en curso'
						this.dialog.message = `La encuesta se cerrará y los datos no guardados se perderan.`
					}
					this.$refs.confirmation.open()
				} else {
					this.confirmCerrar()
				}
			},
			confirmCerrar () {
				if (this.anidado) {
					this.$emit('close')
				} else {
					this.$router.push({name: 'Encuestas'})
					this.$store.commit('assignEncuestaEnCurso', false)
				}
			},
			guardarEncuestaAnido (anidado) {
				let index = this.encuesta.individuales.findIndex(x => x.uuid === anidado.uuid)
				this.encuesta.individuales.splice(index > -1 ? index : 0, index > -1 ? 1 : 0, anidado)
				setTimeout(() => {
					this.guardarEncuesta(false)
				}, 1000)
			},
			async guardarEncuesta (steppear = true) {
				// let validadoUbicacion = this.encuesta.ubicacion ? await this.$refs.formUbicacion.validate() : true
				// let validadoEncuestado = this.encuesta.encuestado ? await this.$refs.formEncuestado.validate() : true
				if (steppear) {
					if (await this.$refs.formEncuesta.validate()) {
						this.encuesta.finalizada = 0
						if (this.encuesta.seccionGuardada === null) {
							this.encuesta.seccionGuardada = 1
						} else if (this.encuesta.seccionGuardada <= this.step) {
							this.encuesta.seccionGuardada = this.step
						}
						this.step++
						console.log('des´´ues de anidado', this.step)
						this.enviar(false)
					} else {
						this.$store.commit('snackbar', {
							color: 'warning',
							message: `Hay preguntas por diligenciar.`
						})
					}
				} else {
					this.enviar(false)
				}
			},
			confirmarEncuesta () {
				this.dialogSave.heading = 'Confirmar finalización de la encuesta'
				this.dialogSave.message = `La encuesta se guardará y no podrá ser modificada.`
				this.$refs.confirmationsave.open()

			},
			async confirmSave () {
				let validado = await this.$refs.formEncuesta.validate()
				if (validado) {
					this.encuesta.finalizada = 1
					this.enviar(true)
				} else {
					this.$store.commit('snackbar', {
						color: 'warning',
						message: `Hay preguntas por diligenciar.`
					})
					this.encuesta.finalizada = 0
				}
				this.$refs.confirmationsave.close()
			},
			enviar (force) {
				this.loading = true
				console.log('this.anidado', this.anidado)
				if (this.anidado) {
					console.log('entra a guardar el anidado', this.encuesta)
					setTimeout(() => {
						this.$emit('guardar', this.encuesta)
						this.$store.commit('snackbar', {
							color: 'success',
							message: `El formulario se ha guardado correctamente`
						})
						this.loading = false
					}, 1000)
				} else {
					console.log('entra a guardar la enciesta', this.encuesta)
					this.$store.dispatch('guardarEncuesta', this.encuesta).then(response => {
						if (response) {
							this.$store.commit('snackbar', {
								color: 'success',
								message: `La encuesta se ha guardado correctamente`
							})
							if (force) this.$router.push({name: 'Resultados', params: {uuid: this.encuesta.uuid, encuesta: this.encuesta}})
						}
						this.loading = false
					})
				}
			},
			agregarAnidado (formulariouuid, formularioAnidado = null) {
				this.$refs.formularioAnidado.assign(formulariouuid, formularioAnidado)
			},
			async obtenerEncuesta (uuid) {
				this.loading = true
				let response = await this.$store.dispatch('obtenerEncuesta', uuid)
				if (response) {
					this.$store.commit('assignEncuestaEnCurso')
					this.encuesta = response
					this.$emit('cargado')
					setInterval(() => {
						this.encuesta.duracion ++
					}, 1000)
				} else {
					this.$store.commit('snackbar', {color: 'warning', message: `No se encuentra la encuesta.`})
					this.$router.go(-1)
				}
				this.loading = false
			},
			// async obtenerEncuesta (uuid) {
			// 	this.loading = true
			// 	await this.$store.dispatch('obtenerEncuesta', uuid)
			// 	if (this.$store.getters.encuestaByUUID(uuid)) {
			// 		this.encuesta = this.$store.getters.encuestaByUUID(uuid)
			// 		this.$emit('cargado')
			// 		setInterval(() => {
			// 			this.encuesta.duracion ++
			// 		}, 1000)
			// 	} else {
			// 		this.$store.commit('snackbar', {color: 'warning', message: `No se encuentra la encuesta.`})
			// 		this.$router.go(-1)
			// 	}
			// 	this.loading = false
			// },
			async assignFormulario(formulariouuid) {
				if (this.formularioAnidadoAnexo) {
					this.encuesta = this.formularioAnidadoAnexo
					this.$emit('cargado')
					this.loading = false
				} else {
					this.loading = true
					await this.$store.dispatch('newEncuesta', formulariouuid)
					if (this.$store.getters.formularioByUUID(formulariouuid)) {
						let theFormulario = this.clone(this.$store.getters.formularioByUUID(formulariouuid))
						theFormulario && theFormulario.secciones&& theFormulario.secciones.length && theFormulario.secciones.forEach(x => x.preguntas.map(z => {
							z.respuesta = {
								posibles_respuesta_uuid: null,
								respuesta_abierta: null
							}
						}))
						this.encuesta = this.clone(this.makeEncuesta)
						this.encuesta.uuid = this.$uuid.v1()
						if (theFormulario.encuestado_activo) {
							this.encuesta.encuestado = this.clone(this.makeEncuestado)
							this.encuesta.encuestado.uuid = this.$uuid.v1()
						}
						if (theFormulario.ubicacion_activa) {
							this.encuesta.ubicacion = this.clone(this.makeUbicacion)
							this.encuesta.ubicacion.uuid = this.$uuid.v1()
						}
						if (this.encuestaPadre) {
							this.encuesta.encuesta_padre_uuid = this.encuestaPadre.uuid
						}
						this.encuesta.formulario_uuid = formulariouuid
						this.encuesta.formulario = theFormulario
						this.$emit('cargado')
					} else {
						this.$store.commit('snackbar', {color: 'warning', message: `No se encuentra el formulario para trabajar.`})
						this.$router.go(-1)
					}
					this.loading = false
					if (!this.anidado) {
						setInterval(() => {
							this.encuesta.duracion ++
						}, 1000)
					}
				}
			}
		}
	}
</script>

<style scoped>
	.v-stepper__step {
		background-color: lightblue !important;
	}
</style>