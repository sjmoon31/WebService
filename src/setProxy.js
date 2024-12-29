const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
    // Proxy for /member
    app.use(
        '/member',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );

    // Proxy for /product
    app.use(
        '/product',
        createProxyMiddleware({
            target: 'http://localhost:8080', // Update the target if it's different for /product
            changeOrigin: true,
        })
    );
};