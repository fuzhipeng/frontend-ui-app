const fs = require('fs');
const path = require('path');

console.log('开始进行Zeabur部署优化...');

// 主要优化函数
async function runOptimization() {
  try {
    // 获取正确的dist路径
    const distPath = path.resolve(__dirname, '../../dist');
    console.log('寻找构建文件目录:', distPath);

    // 检查dist目录是否存在
    if (!fs.existsSync(distPath)) {
      throw new Error(`构建目录不存在: ${distPath}`);
    }

    // 1. 确保index.html中的资源路径使用相对路径
    optimizeHtmlPaths(distPath);
    
    // 2. 添加polyfill支持，解决老旧浏览器兼容性问题
    addPolyfillSupport(distPath);
    
    // 3. 检查并修复CSS路径
    optimizeCssPaths(distPath);
    
    console.log('Zeabur部署优化完成!');
  } catch (error) {
    console.error('优化过程中发生错误:', error);
    process.exit(1);
  }
}

// 优化HTML中的资源路径
function optimizeHtmlPaths(distPath) {
  const htmlPath = path.join(distPath, 'index.html');
  
  try {
    console.log('正在处理HTML文件:', htmlPath);
    
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`HTML文件不存在: ${htmlPath}`);
    }
    
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // 确保所有资源使用相对路径
    htmlContent = htmlContent.replace(/href="\//g, 'href="./');
    htmlContent = htmlContent.replace(/src="\//g, 'src="./');
    
    // 添加额外的meta标签以提高兼容性
    htmlContent = htmlContent.replace(
      /<head>/,
      '<head>\n  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">'
    );
    
    // 添加错误捕获脚本
    htmlContent = htmlContent.replace(
      /<\/head>/,
      '  <script>\n' +
      '    window.onerror = function(message, source, lineno, colno, error) {\n' +
      '      console.error("Global error:", message, "at", source, ":", lineno, ":", colno);\n' +
      '      return false;\n' +
      '    };\n' +
      '  </script>\n' +
      '</head>'
    );
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('已优化HTML路径和兼容性');
  } catch (error) {
    console.error('无法优化HTML文件:', error);
    throw error;
  }
}

// 添加Polyfill支持
function addPolyfillSupport(distPath) {
  const htmlPath = path.join(distPath, 'index.html');
  
  try {
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`HTML文件不存在: ${htmlPath}`);
    }
    
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // 添加polyfill.io
    htmlContent = htmlContent.replace(
      /<head>/,
      '<head>\n  <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019"></script>'
    );
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('已添加Polyfill支持');
  } catch (error) {
    console.error('无法添加Polyfill支持:', error);
    throw error;
  }
}

// 优化CSS路径
function optimizeCssPaths(distPath) {
  const cssDir = path.join(distPath, 'assets');
  
  try {
    console.log('正在处理CSS文件目录:', cssDir);
    
    if (!fs.existsSync(cssDir)) {
      throw new Error(`CSS资源目录不存在: ${cssDir}`);
    }
    
    const findCssFiles = (dir) => {
      const results = [];
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          results.push(...findCssFiles(filePath));
        } else if (file.endsWith('.css')) {
          results.push(filePath);
        }
      }
      
      return results;
    };
    
    const cssFiles = findCssFiles(cssDir);
    console.log(`找到${cssFiles.length}个CSS文件`);
    
    for (const cssFile of cssFiles) {
      let cssContent = fs.readFileSync(cssFile, 'utf8');
      
      // 修复url()引用的资源路径
      cssContent = cssContent.replace(/url\(\s*\/assets\//g, 'url(../assets/');
      
      fs.writeFileSync(cssFile, cssContent);
    }
    
    console.log(`已优化${cssFiles.length}个CSS文件的资源路径`);
  } catch (error) {
    console.error('无法优化CSS路径:', error);
    throw error;
  }
}

// 运行优化
runOptimization(); 