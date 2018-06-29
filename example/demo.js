import path from 'path';

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Static from 'koa-static';

const WEB_RES_PATH = path.resolve(__dirname, './public');

const webApp = new Koa();

const WEB_PAGE_DEFAULT_CONTENT = `
<div style="background-color:#90CAF9;position:absolute;top:0;right:0;bottom:0;left:0;">
  <div style="position:relative;font-size:32px;">Server Side Render</div>
</div>
`;

class Demo {
  static get webApp() {
    return webApp;
  }

  static render(srciptPath = '', state = {}, title = '', content = WEB_PAGE_DEFAULT_CONTENT) {
    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <title>${title}</title>
        </head>
        <body>
          <!--[if IE]><div>Unfortunately, you are using Internet Explorer, which is obsolete...</div><![endif]-->
          <!--[if !IE]-->
            <div id="app">${content}</div>
            <script>
              window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
            </script>
            ${(srciptPath !== '') ? `<script src="${srciptPath}"></script>` : ''}
          <!--[endif]-->
        </body>
      </html>
    `;
  }

  static async initialize(opts = {}) {
    const router = new Router();
    router.get('/', async (ctx = {}) => {
      ctx.type = 'text/html';
      ctx.body = Demo.render(opts.renderRoot, {}, 'Demo');
    });

    Demo.webApp.use(Static(WEB_RES_PATH));
    Demo.webApp.use(bodyParser());
    Demo.webApp.use(router.routes());

    const port = opts.port || 3000;
    Demo.webApp.listen(port, (err) => {
      if (err) {
        console.log(`Web Service Error${err}`);
      } else {
        console.log(`Web Service listening on port(${port})`);
      }
    });
  }
}

export default Demo;
