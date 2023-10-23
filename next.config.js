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
    }  
}

module.exports = nextConfig
