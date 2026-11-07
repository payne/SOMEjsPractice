// Small stand-ins for browser and Node.js features that a sandboxed, offline
// page can't use for real. Each function returns JavaScript source text, used
// both inside the sandbox and as files in a downloaded question zip.

/** document.cookie for pages that have no real cookies (sandbox, file://). */
export const cookieShim = () => `// Stand-in for document.cookie (sandboxed pages and file:// pages have no cookies).
(function () {
  const jar = {};
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get() {
      return Object.keys(jar).map(name => name + "=" + jar[name]).join("; ");
    },
    set(text) {
      const [pair, ...attributes] = String(text).split(";");
      const i = pair.indexOf("=");
      const name = pair.slice(0, i).trim();
      const value = pair.slice(i + 1).trim();
      let expired = false;
      for (const attribute of attributes) {
        const [key, val = ""] = attribute.split("=");
        const k = key.trim().toLowerCase();
        if (k === "expires" && new Date(val.trim()) < new Date()) expired = true;
        if (k === "max-age" && Number(val) <= 0) expired = true;
      }
      if (!name) return;
      if (expired) delete jar[name];
      else jar[name] = value;
    },
  });
})();
`;

/** Fake fetch() and XMLHttpRequest that answer from a table of sample responses. */
export const networkShim = (routes) => `// Practice exams run without internet, so fetch() and XMLHttpRequest answer
// from this table of sample responses. Any other URL gets a 404 response.
// Every request is recorded in window.__requests.
(function () {
  const sampleResponses = ${JSON.stringify(routes, null, 2)};
  const lookup = (method, url) => {
    for (const key of [method.toUpperCase() + " " + url, url]) {
      if (Object.prototype.hasOwnProperty.call(sampleResponses, key)) return { found: true, data: sampleResponses[key] };
    }
    return { found: false, data: {} };
  };

  const requests = (window.__requests = []);
  window.fetch = (input, init = {}) => {
    const url = String(input && input.url ? input.url : input);
    requests.push({ method: (init.method || "GET").toUpperCase(), url, body: init.body ?? null, headers: init.headers || {} });
    const { found, data } = lookup(init.method || "GET", url);
    return new Promise(resolve => setTimeout(() => resolve(new Response(JSON.stringify(data), {
      status: found ? 200 : 404,
      headers: { "Content-Type": "application/json" },
    })), 50));
  };

  class SampleXMLHttpRequest {
    constructor() {
      this.readyState = 0; this.status = 0; this.statusText = "";
      this.responseText = ""; this.response = ""; this.responseType = "";
      this.listeners = {};
    }
    open(method, url) { this.method = method; this.url = String(url); this.readyState = 1; }
    setRequestHeader() {}
    addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
    fire(type) {
      const event = { type, target: this, currentTarget: this };
      if (typeof this["on" + type] === "function") this["on" + type](event);
      (this.listeners[type] || []).forEach(fn => fn.call(this, event));
    }
    send(body = null) {
      requests.push({ method: (this.method || "GET").toUpperCase(), url: this.url, body });
      setTimeout(() => {
        const { found, data } = lookup(this.method || "GET", this.url);
        this.status = found ? 200 : 404;
        this.statusText = found ? "OK" : "Not Found";
        this.responseText = JSON.stringify(data);
        this.response = this.responseType === "json" ? data : this.responseText;
        this.readyState = 4;
        this.fire("readystatechange");
        this.fire("load");
        this.fire("loadend");
      }, 50);
    }
  }
  SampleXMLHttpRequest.UNSENT = 0; SampleXMLHttpRequest.OPENED = 1; SampleXMLHttpRequest.DONE = 4;
  window.XMLHttpRequest = SampleXMLHttpRequest;
})();
`;

/**
 * A tiny Node.js stand-in so Node questions can be checked in the browser:
 * require("fs"), require("fs/promises"), require("path"), local modules,
 * module.exports, process.argv, __dirname. Files live in memory (window.__files).
 */
export const nodeShim = (config = {}) => `(function () {
  const config = ${JSON.stringify(config)};
  const dir = "/home/student/project";
  const files = Object.assign({}, config.files || {});
  const norm = p => {
    p = String(p).replace(/\\\\/g, "/");
    if (p.startsWith(dir + "/")) p = p.slice(dir.length + 1);
    return p.replace(/^\\.\\//, "");
  };
  const noFile = p => Object.assign(new Error("ENOENT: no such file or directory, open '" + p + "'"), { code: "ENOENT" });
  const later = fn => setTimeout(fn, 5);
  const fs = {
    readFileSync(p) { const k = norm(p); if (!(k in files)) throw noFile(p); return files[k]; },
    writeFileSync(p, data) { files[norm(p)] = String(data); },
    appendFileSync(p, data) { const k = norm(p); files[k] = (files[k] || "") + String(data); },
    existsSync(p) { return norm(p) in files; },
    unlinkSync(p) { const k = norm(p); if (!(k in files)) throw noFile(p); delete files[k]; },
    readdirSync() { return Object.keys(files).filter(f => !f.includes("/")).sort(); },
    readFile(p, enc, cb) { if (typeof enc === "function") cb = enc; later(() => { try { cb(null, fs.readFileSync(p)); } catch (e) { cb(e); } }); },
    writeFile(p, data, enc, cb) { if (typeof enc === "function") cb = enc; later(() => { fs.writeFileSync(p, data); if (cb) cb(null); }); },
    appendFile(p, data, enc, cb) { if (typeof enc === "function") cb = enc; later(() => { fs.appendFileSync(p, data); if (cb) cb(null); }); },
  };
  const wrap = name => (...args) => new Promise((resolve, reject) => {
    try { resolve(fs[name + "Sync"](...args)); } catch (e) { reject(e); }
  });
  fs.promises = { readFile: wrap("readFile"), writeFile: wrap("writeFile"), appendFile: wrap("appendFile"), unlink: wrap("unlink") };
  const path = {
    sep: "/",
    join: (...parts) => parts.join("/").replace(/\\/+/g, "/"),
    basename: (p, ext) => { let b = String(p).split("/").pop(); if (ext && b.endsWith(ext)) b = b.slice(0, -ext.length); return b; },
    extname: p => { const b = String(p).split("/").pop(); const i = b.lastIndexOf("."); return i > 0 ? b.slice(i) : ""; },
    dirname: p => String(p).split("/").slice(0, -1).join("/") || ".",
  };
  const builtins = { fs, path, "fs/promises": fs.promises, "node:fs": fs, "node:path": path, "node:fs/promises": fs.promises };
  const cache = {};
  const load = name => {
    if (builtins[name]) return builtins[name];
    const key = norm(name).replace(/(\\.js)?$/, ".js");
    if (cache[key]) return cache[key].exports;
    const source = (config.modules || {})[key];
    if (source == null) throw Object.assign(new Error("Cannot find module '" + name + "'"), { code: "MODULE_NOT_FOUND" });
    const mod = { exports: {} };
    cache[key] = mod;
    new Function("module", "exports", "require", "__dirname", "__filename", source)(mod, mod.exports, load, dir, dir + "/" + key);
    return mod.exports;
  };
  window.require = load;
  window.module = { exports: {} };
  window.exports = window.module.exports;
  window.__dirname = dir;
  window.__filename = dir + "/main.js";
  window.process = {
    argv: ["node", dir + "/main.js"].concat(config.argv || []),
    env: {}, platform: "linux", version: "v20.0.0",
    exit(code) { console.log("[process.exit(" + (code || 0) + ")]"); },
  };
  window.__files = files;
})();
`;
