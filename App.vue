<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			// 全局路由守卫
			uni.addInterceptor('navigateTo', {
				invoke: (args) => {
					return this.checkLogin(args.url)
				}
			})
			
			uni.addInterceptor('redirectTo', {
				invoke: (args) => {
					return this.checkLogin(args.url)
				}
			})
			
			uni.addInterceptor('switchTab', {
				invoke: (args) => {
					return this.checkLogin(args.url)
				}
			})
			
			uni.addInterceptor('reLaunch', {
				invoke: (args) => {
					return this.checkLogin(args.url)
				}
			})
			
			uni.addInterceptor('navigateBack', {
				invoke: (args) => {
					// 获取当前页面栈
					const pages = getCurrentPages()
					if (pages.length > 0) {
						const currentPage = pages[pages.length - 1]
						return this.checkLogin(currentPage.route)
					}
					return true
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 检查登录状态
			checkLogin(url) {
				console.log('checkLogin', url)
				// 登录页面不需要检查
				if (url.includes('/pages/login/login')) {
					return true
				}
				
				// 检查是否已登录
				const isLoggedIn = this.$store.getters.isLoggedIn
				console.log('isLoggedIn', isLoggedIn)
				if (!isLoggedIn) {
					uni.redirectTo({
						url: '/pages/login/login'
					})
					uni.showToast({
						title: '请先登录',
						icon: 'none',
						duration: 2000
					})
					return false
				}
				
				// 检查登录是否过期
				const loginTime = this.$store.getters.getLoginTime
				if (loginTime) {
					const now = Date.now()
					const elapsed = now - loginTime
					if (elapsed > 120000) {
						// 登录已过期，清除用户信息
						this.$store.commit('clearUserInfo')
						uni.redirectTo({
							url: '/pages/login/login'
						})
						uni.showToast({
							title: '登录已过期，请重新登录',
							icon: 'none',
							duration: 2000
						})
						return false
					}
				}
				
				return true
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
