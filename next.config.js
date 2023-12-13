/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
      },
      //数据代理
    async rewrites(){
      return [{
        source: '/api/:path*',
        destination: 'https://mock.apifox.cn/m1/2398938-0-default/api/:path*'
        // destination: 'https://loclhost:3000/api/:path*'
      }]
    } ,
    exportPathMap: function () {
      return {
        '/': { page: '/login' }, // 设置默认打开的页面为 '/home'
        // 添加其他页面的映射
      };
    }, 
}

module.exports = nextConfig
