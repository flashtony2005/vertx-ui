const fs = require("fs");
const path = require("path");
const paths = require("./paths");

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve("./paths")];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
    throw new Error(
        "The NODE_ENV environment variable is required but was not specified."
    );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
var dotenvFiles = [
    `${paths.dotenv}.${NODE_ENV}.local`,
    `${paths.dotenv}.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== "test" && `${paths.dotenv}.local`,
    paths.dotenv
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
        require("dotenv").config({
            path : dotenvFile
        });
    }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || "")
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(appDirectory, folder))
    .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
    const raw = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key];
                return env;
            },
            {
                // Useful for determining whether we’re running in production mode.
                // Most importantly, it switches React into the correct mode.
                NODE_ENV : process.env.NODE_ENV || "development",
                BABEL_ENV : process.env.NODE_ENV || "development",
                // Useful for resolving the correct path to static assets in `public`.
                // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
                // This should only be used as an escape hatch. Normally you would put
                // images into the `src` and `import` them in code to get their paths.
                PUBLIC_URL : publicUrl,
                // VIE UI 使用的环境变量
                $LANG : process.env.UI_LANGUAGE, // VIE - 系统使用的语言
                $ENDPOINT : process.env.UI_ENDPOINT, // VIE - 远程地址Api
                $APP : process.env.UI_APP, // 应用程序名称
                $LOGIN : process.env.URI_LOGIN, // 系统入口（一般是登陆）
                $MAIN : process.env.URI_MAIN, // 系统主界面地址,
                $PATH : process.env.URI_CTX, // Context根路径：重要参数
                $K_SESSION : process.env.KEY_SESSION, // 存储专用Key前缀
                $K_EVENT : process.env.KEY_EVENT, // Redux专用Key前缀
                $DEBUG : process.env.DEV_DEBUG, // 是否DEBUG模式
                $MAP_KEY : process.env.MAP_KEY
            }
        );
    // Stringify all values so we can feed into Webpack DefinePlugin
    const stringified = {
        "process.env" : Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {})
    };

    return {raw, stringified};
}

module.exports = getClientEnvironment;