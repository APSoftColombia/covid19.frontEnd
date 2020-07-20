import Vue from 'vue'
import Router from 'vue-router'

//routes
import defaultRoutes from './default'

// session components
const SignUpOne = () => import('Views/session/SignUpOne')
const LoginOne = () => import('Views/session/LoginOne')
const LockScreen = () => import('Views/session/LockScreen')
const ForgotPassword = () => import('Views/session/ForgotPassword')
const ResetPassword = () => import('Views/session/ResetPassword')

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		defaultRoutes,
		{
			path: '/session/sign-up',
			component: SignUpOne,
			name: 'SignUp',
			meta: {
				title: 'message.signUp',
				breadcrumb: null
			}
		},
		{
			path: '/session/login',
			component: LoginOne,
			name: 'Login',
			meta: {
				title: 'message.login',
				breadcrumb: null
			}
		},
		{
			path: '/session/lock-screen',
			component: LockScreen,
			name: 'LockScreen',
			meta: {
				title: 'Lock Screen',
				breadcrumb: null
			}
		},
		{
			path: '/session/forgot-password',
			component: ForgotPassword,
			name: 'ForgotPassword',
			meta: {
				title: 'message.forgotPassword',
				breadcrumb: null
			}
		},
		{
			path: '/session/reset-password',
			component: ResetPassword,
			name: 'ResetPassword',
			meta: {
				title: 'message.resetPassword',
				breadcrumb: null
			}
		}
	]
})
