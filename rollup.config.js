// rollup.config.js
// rollup.config.js
import fs from 'fs';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
const production = process.env.NODE_ENV === 'production';
function getEntryPoints() {
  const entryPath = './packages';
  const entryFiles = fs.readdirSync(entryPath);
  const entryPoints = {};

  entryFiles.forEach((file) => {
    const filePath = path.join(entryPath, file, 'index.js');
    if (fs.existsSync(filePath)) {
      const componentName = file;
      entryPoints[componentName] = {
        input: filePath,
        output: {
          file: `dist/${production ? 'prop' : 'dev'}/${componentName}/index.js`,
          format: 'umd',
          sourcemap: production,
		  name: componentName,
		  globals: {
			componentName: componentName,
		  }
        },
      };
    }
  });

  return entryPoints;
}

const rollupConfig = Object.entries(getEntryPoints()).map(([componentName, config]) => ({
	input: config.input,
	output: config.output,
	plugins: [
    production && terser({
      compress: {
        ecma: 2015,
        pure_getters: true
      },
      safari10: true
    }),
	  postcss({
		extract: `index.css`, // 确保样式文件被独立打包成CSS
		extensions: ['.less'],
		minimize: true,
		use: {
		  less: { javascriptEnabled: true },
		},
	  }),
	],
  }));
  
  export default rollupConfig;