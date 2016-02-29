module.exports = config:
	modules: wrapper: false
	minify: yes
	plugins: 
		babel: pattern: /\.(es6|jsx)$/
		uglify: ignored: /CorrelatorJs.js/
	paths: 
		public: 'dist'
		watched: [ 'src' ]
	files:
		javascripts: 
			joinTo: 
				'correlatorjs.js': /src\/correlator-js.jsx|src\/uuid-crypto.jsx/
				'correlatorjs.min.js': /src\/correlator-js.jsx|src\/uuid-crypto.jsx/
			order:
				before: [ 
					'src/uuid-crypto.jsx', 
					'src/correlator-js.jsx' 
				]
