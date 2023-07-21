// rollup.config.js
// rollup.config.js
import fs from 'fs';
import path from 'path';
import postcss from 'rollup-plugin-postcss';

function getEntryPoints() {
  const entryPath = 'src/package';
  const entryFiles = fs.readdirSync(entryPath);
  const entryPoints = {};

  entryFiles.forEach((file) => {
    const filePath = path.join(entryPath, file, 'index.js');
    if (fs.existsSync(filePath)) {
      const componentName = file;
      entryPoints[componentName] = {
        input: filePath,
        output: {
          file: `dist/${componentName}/index.js`,
          format: 'umd',
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