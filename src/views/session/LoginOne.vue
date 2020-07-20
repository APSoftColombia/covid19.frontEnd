<template>
	<v-container fluid style="height: 100% !important; background-color: white !important;">
		<v-row style="height: 100% !important;" justify="center" align="center">
			<v-col cols="12" sm="6" v-if="$vuetify.breakpoint.smAndUp">
<!--				<v-expand-transition>-->
<!--					<v-img-->
<!--							v-if="imagenName"-->
<!--							:src="`/static/logos/${imagenName}`"-->
<!--							width="100%"-->
<!--					>-->
<!--					</v-img>-->
<!--				</v-expand-transition>-->
				<v-row style="height: 100% !important;" justify="center" align="center">
					<v-card flat class="transparent" v-if="imagenName">
						<v-responsive :aspect-ratio="3/4">
							<v-img
									:src="`/static/logos/aspect3-4/${imagenName}`"
							>
							</v-img>
						</v-responsive>
						<app-section-loader style="z-index: 10 !important;" :status="loading"></app-section-loader>
					</v-card>
				</v-row>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="session-table-cell text-center">
					<div class="session-content">
						<img
								:src="`/static/logos/logoLogin.png`"
								class="img-responsive mb-4 rounded"
						/>
<!--						<img-->
<!--								:src="appLogo"-->
<!--								class="img-responsive mb-4"-->
<!--						/>-->
						<h2 class="mb-4">Inicio de sesión</h2>
						<p class="fs-14">Ingrese nombre de usuario y contraseña para acceder.</p>
						<ValidationObserver class="mb-5" ref="observer" v-slot="{ invalid, validated, passes, validate }" tag="form" autocomplete="off" @submit.prevent="signIn">
							<ValidationProvider name="nombre de usuario" rules="required" v-slot="{ errors, valid }">
								<v-text-field
										label="Nombre de Usuario"
										outlined
										v-model="email"
										:success="valid"
										:error-messages="errors"
								></v-text-field>
							</ValidationProvider>
							<ValidationProvider name="contraseña" rules="required" v-slot="{ errors, valid }">
								<v-text-field
										label="Contraseña"
										outlined
										v-model="password"
										:success="valid"
										:error-messages="errors"
										:type="showPassword ? 'text' : 'password'"
										:append-icon="showPassword ? 'visibility' : 'visibility_off'"
										@click:append="showPassword = !showPassword"
								></v-text-field>
							</ValidationProvider>
							<v-checkbox
									color="primary"
									label="Recordarme"
									v-model="checkbox"
							></v-checkbox>
							<router-link class="mb-2" to="/session/forgot-password">¿Se te olvidó tu contraseña?</router-link>
							<div>
								<v-btn :loading="loading" large class="mb-2" type="submit" block color="primary">Iniciar sesión</v-btn>
							</div>
						</ValidationObserver>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import AppConfig from 'Constants/AppConfig'
	import Vue from "vue";
	export default {
		data:() => ({
			loading: false,
			showPassword: false,
			checkbox: false,
			email: null,
			password: null,
			imagenName: null,
			appLogo: AppConfig.appLogo2,
			brand: AppConfig.brand
		}),
		created () {
			this.getDatosEmpresa()
		},
		methods: {
			getDatosEmpresa () {
				this.loading = true
				Vue.axios.get(`api/configuraciones`)
						.then(response => {
							this.imagenName = response.data.imagen_inicio
							this.loading = false
						})
						.catch(error => {
							this.loading = false
							this.$store.commit('snackbar', {color: 'error', message: 'al recuperar los datos de empresa.', error: error})
						})
			},
			signIn () {
				this.$refs.observer.validate().then(result => {
					if (result) {
						this.loading = true
						this.$store.dispatch('signIn', { username: this.email, password: this.password })
								.then(() =>{
									this.loading = false
								})
					}
				})
			}
		}
	}
</script>
