const esbuild = require('esbuild')
const nodeExternals = require('esbuild-node-externals')

esbuild.build({
    entryPoints: ['./server/server.js'],
    bundle: true,
    platform: 'node',
    target: ['node14'], // Adjust based on your target Node.js version
     // Add other external modules as needed
    outfile: 'server_bundled.js',
    plugins: [nodeExternals.nodeExternalsPlugin()], // Exclude node_modules from bundling
    define: {
        'process.env.NODE_ENV': '"production"' // Set Node environment
    }
}).catch(() => process.exit(1));
