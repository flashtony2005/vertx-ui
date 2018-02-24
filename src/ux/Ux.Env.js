import { createAction } from 'redux-act';
import { Taper, zero } from "environment";
import { DataLabor } from "entity";
// 环境变量初始化
const rxDebug = (ux = {}) => {
    console.info(ux);
    console.groupCollapsed("[Ux] Assist report as following:");
    const numCond = 0;
    const strCond = "";
    console.info("[If] if(0) = ", (numCond)?"Yes":"No");
    console.info("[If] if(\"\") = ", (strCond)?"Yes":"No");
    console.groupEnd();
};
export default {
    LANG : process.env.$LANG,
    ENDPOINT : process.env.$ENDPOINT,
    APP : process.env.$APP,
    EVENT : process.env.$K_EVENT,
    KEY_USER : `${process.env.$K_SESSION}SESSION/USER`,
    KEY_APP : `${process.env.$K_SESSION}SESSION/APP/${process.env.$APP.toUpperCase()}`,
    ENTRY_LOGIN : `/${process.env.$PATH}${process.env.$LOGIN}`,
    ENTRY_ADMIN : `/${process.env.$PATH}${process.env.$MAIN}`,
    MAP_KEY : process.env.$MAP_KEY,
    DEBUG : Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG),
    dataOut : (data) => Taper.fnFlush(DataLabor.createIn(data)),
    dataIn : (state) => DataLabor.createOut(state),
    monitor : (data) => {
        console.info(data);
        return data;
    },
    rxDebug,
    createAction : (path) => createAction(`${process.env.$K_EVENT}${path}`),
    zero,
    HTTP_METHOD : {
        GET : "get",
        POST : "post",
        PUT : "put",
        DELETE : "delete"
    },
    MIMES : {
        JSON : "application/json"
    },
    HTTP11 : {
        "ACCEPT" : "Accept",
        "ACCEPT_CHARSET" : "Accept-Charset",
        "ACCEPT_ENCODING" : "Accept-Encoding",
        "ACCEPT_LANGUAGE" : "Accept-Language",
        "ACCEPT_RANGES" : "Accept-Ranges",
        "AGE" : "Age",
        "ALLOW" : "Allow",
        "AUTHORIZATION" : "Authorization",
        "CACHE_CONTROL" : "Cache-Control",
        "CONNECTION" : "Connection",
        "CONTENT_BASE" : "Content-Base",
        "CONTENT_ENCODING" : "Content-Encoding",
        "CONTENT_LENGTH" : "Content-Length",
        "CONTENT_LOCATION" : "Content-Location",
        "CONTENT_MD5" : "Content-MD5",
        "CONTENT_RANGE" : "Content-Range",
        "CONTENT_TYPE" : "Content-Type",
        "DATE" : "Date",
        "ETAG" : "ETag",
        "EXPIRES" : "Expires",
        "FORM" : "Form",
        "HOST" : "Host",
        "IF_MODIFIED_SINCE" : "If-Modified-Since",
        "IF_MATCH" : "If-Match",
        "IF_NONE_MATCH" : "If-None-Match",
        "IF_RANGE" : "If-Range",
        "IF_UNMODIFIED_SINCE" : "If-Unmodified-Since",
        "LAST_MODIFIED" : "Last-Modified",
        "LOCATION" : "Location",
        "MAX_FORWARDS" : "Max-Forwards",
        "PRAGMA" : "Pragma",
        "PROXY_AUTHENTICATE" : "Proxy-Authenticate",
        "PROXY_AUTHORIZATION" : "Proxy-Authorization",
        "PUBLIC" : "Public",
        "RANGE" : "Range",
        "REFENER" : "Refener",
        "RETRY_AFTER" : "Retry-After",
        "SERVER" : "Server",
        "TRANSFER_ENCODING" : "Transfer-Encoding",
        "UPGRADE" : "Upgrade",
        "USER_AGENT" : "User-Agent",
        "VARY" : "Vary",
        "WARNING" : "Warning",
        "WWW_AUTHENTICATE" : "WWW-Authenticate"
    }
}