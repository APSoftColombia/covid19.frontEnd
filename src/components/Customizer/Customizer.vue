<template>
	<div>
		<v-navigation-drawer
			fixed
			v-model="customizerIn"
			:width="300"
			:right="!rtlLayout"
			app
			temporary
			class="clearfix"
		>
			<v-toolbar color="primary" dark>
				<v-toolbar-title>{{$t('message.themeOptions')}}</v-toolbar-title>
			</v-toolbar>
			<v-tabs grow>
				<v-tab>{{$t('message.general')}}</v-tab>
				<v-tab>{{$t('message.advance')}}</v-tab>
				<v-tab-item>
					<vue-perfect-scrollbar class="customizer-scroll-area" :settings="settings">
						<div class="inner-toolbar">
							<theme-provider></theme-provider>
							<sidebar-filters-provider></sidebar-filters-provider>
							<header-filters-provider v-if="isHeaderFilterAvaiable()"></header-filters-provider>
							<div>
								<p>{{$t('message.routerAnimation')}}</p>
								<v-select
									outlined
									:items="routerAnimations"
									label="Select Animation"
									:value="selectedRouterAnimation"
									@change="changeRouterAnimation($event)"
								></v-select>
							</div>
						</div>
					</vue-perfect-scrollbar>
				</v-tab-item>
				<v-tab-item>
					<vue-perfect-scrollbar class="customizer-scroll-area" :settings="settings">
						<div class="inner-toolbar sidebar-overlay-color">
							<v-list class="mb-5 theme-layouts">
								<v-list-item >
									<v-list-item-content class="py-0">
										<v-checkbox
											:label="$t('message.darkMode')"
											color="primary"
											@change="emitDarkMode($event)"
										></v-checkbox>
									</v-list-item-content>
								</v-list-item>
								<v-list-item v-if="isSidebarAvailable()">
									<v-list-item-content class="py-0">
										<v-checkbox
											:label="$t('message.collapseSidebar')"
											color="primary"
											@change="emitCollapseSidebar"
											:input-value="collapseSidebar"
										></v-checkbox>
									</v-list-item-content>
								</v-list-item>
								<v-list-item>
									<v-list-item-content class="py-0">
										<v-checkbox
											:label="$t('message.rtlLayout')"
											color="primary"
											@change="emitRtlLayout($event)"
											:input-value="rtlLayout"
										></v-checkbox>
									</v-list-item-content>
								</v-list-item>
								<v-list-item v-if="isSidebarAvailable()">
									<v-list-item-content class="py-0">
										<v-checkbox
											:label="$t('message.backgroundImage')"
											color="primary"
											@change="emitEnableBackgroundImage"
											:input-value="backgroundImage"
										></v-checkbox>
									</v-list-item-content>
								</v-list-item>
							</v-list>
							<div class="sidebar-images" v-if="backgroundImage">
								<div class="d-inline-block mx-1 mb-2" v-for="backgroundImage in sidebarBackgroundImages" :key="backgroundImage.id">
									<a href="javascript:void(0)" class="img-holder" :class="{'active' : selectedSidebarBgImage.id === backgroundImage.id}">
										<img :src="backgroundImage.url" height="200" width="75" @click="changeBackgroundImage(backgroundImage)" alt="dynamic sidebar images" class="img-responsive">
									</a>
								</div>
							</div>
						</div>
					</vue-perfect-scrollbar>
				</v-tab-item>
			</v-tabs>
		</v-navigation-drawer>
		<div class="app-customizer">
			<a class="customizer-toggle primary v-step-4" href="javascript:;" @click="toggleCustomizer">
				<i class="zmdi zmdi-settings zmdi-hc-spin font-lg"></i>
			</a>
		</div>
	</div>
</template>

<script>
import ThemeProvider from './ThemeProvider'
import { mapGetters } from 'vuex'
import SidebarFiltersProvider from './SidebarFiltersProvider'
import HeaderFiltersProvider from './HeaderFiltersProvider'
import { getCurrentAppLayout } from 'Helpers/helpers'

export default {
  components: {
    ThemeProvider,
    SidebarFiltersProvider,
    HeaderFiltersProvider
  },
  data() {
    return {
      customizerIn: false,
      settings: {
        maxScrollbarLength: 160
      }
    }
  },
  methods: {
    // dark mode handlerleft='ifRtlLayout' :right='!ifRtlLayout'
    emitDarkMode(e) {
		this.$vuetify.theme.dark = e
    },
    // collapse sidebar handler
    emitCollapseSidebar() {
      this.$store.dispatch('collapseSidebar')
    },
    // enable background image handler
    emitEnableBackgroundImage() {
      this.$store.dispatch('backgroundImage')
    },
    // change BackgroundImage customizer
    changeBackgroundImage(sidebarImage) {
      this.$store.dispatch('changeBackgroundImage', sidebarImage)
    },
    // toggle customizer
    toggleCustomizer() {
      this.customizerIn = !this.customizerIn
    },
    // RTL handler
    emitRtlLayout(e) {
		this.$vuetify.rtl = e
      this.$store.dispatch('rtlLayout')
    },
    // router animation handler
    changeRouterAnimation(value) {
      this.$store.dispatch('changeRouterAnimation', value)
    },
    isHeaderFilterAvaiable() {
      let layout = getCurrentAppLayout(this.$router)
      if (layout === 'boxed' || layout === 'boxed-v2') {
        return false
      }
      return true
    },
    isSidebarAvailable() {
      let layout = getCurrentAppLayout(this.$router)
      if (layout === 'boxed' || layout === 'horizontal' || layout === 'boxed-v2') {
        return false
      }
      return true
    },
  },
  computed: {
    ...mapGetters([
      'collapseSidebar',
      'boxLayout',
      'rtlLayout',
      'backgroundImage',
      'sidebarBackgroundImages',
      'selectedSidebarBgImage',
      'sidebarFilters',
      'sidebarSelectedFilter',
      'routerAnimations',
      'selectedRouterAnimation'
    ])
  }
}
</script>

<style scoped>
.customizer-scroll-area {
  position: relative;
  height: 80vh;
}
</style>
