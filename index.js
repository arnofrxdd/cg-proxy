const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://api.cyberghostvpn.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: { '^/': '/' }
}));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`🚀 Proxy is running on port ${port}`);
});
