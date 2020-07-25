"use strict";
const modes = {
    proxy: 'SOCKS5 localhost:1080',
    direct: 'DIRECT'
};
const domains = [
    'golang.org',
    'php.net',
    'readthedocs.org',
    'chromium.org',
    'readthedocs.io',
    't.co',
    'tiobe.com',
    'typography.com',
    'ryanstutorials.net',
    'pinterest.com',
    'ampproject.org',
    'onlinedoctranslator.com',
    'deepl.com',
    'dwnews.com',
    'starship.rs',
    'imgur.com',
    'alternativeto.net',
    'wenxuecity.com',
    'merry.com.tw',
    'carbonads.net',
    'generatedata.com',
    'stackpathcdn.com',
    'keycdn.com',
    'bootstrapcdn.com',
    'myfonts.net',
    'openuserjs.org',
    'torproject.org',
    'cloudflare.com',
    'tox.chat',
    'jetbrains.com',
    'windows.net',
    'fbcdn.net',
    't.me',
    'telesco.pe',
    'umass.edu',
    'codesandbox.io',
    'nodejs.org',
    'hp.net',
    'revealjs.com',
    'cat-v.org',
    'gravatar.com',
    'stackblitz.io',
    'medium.com',
    'diigo.com',
    'disqus.com',
    '500px.org',
    'fontawesome.com',
    'csacademy.com',
    'blogger.com'
];
const keywords = [
    'google',
    'gstatic',
    'gmail',
    'azure',
    'quora',
    'youtu',
    'wiki',
    'twitter',
    'telegram',
    'instagram',
    'mysql',
    'sqlite',
    'facebook',
    'amazon',
    'github',
    'gitbook',
    'gitlab',
    'webscraper',
    'microsoft',
    'steam',
    'linux',
    'redd',
    'bbc',
    'twimg',
    'ytimg',
    'ggpht',
    'doubleclick',
    'kde',
    'material',
    'msecnd',
    'v2ray'
];
let keywordsRegex = new RegExp(keywords.join('|'));
let domainsTree = list2tree();
function FindProxyForURL(_, host) {
    let chunks = host.split('.');
    let length = chunks.length;
    let domainTree = domainsTree;
    if (keywordsRegex.test(chunks[length - 2] + '-' + (chunks[length - 3] ?? ''))) {
        return modes.proxy;
    }
    for (let i = length - 1; i >= 0 && domainTree.hasOwnProperty(chunks[i]); i--) {
        domainTree = domainTree[chunks[i]];
        if (domainTree === null) {
            return modes.proxy;
        }
    }
    return modes.direct;
}
function list2tree() {
    let domainsTree = {};
    let i;
    domains.forEach(domain => {
        let chunks = domain.split('.');
        let domainTree = domainsTree;
        for (i = chunks.length - 1; i >= 0 && domainTree.hasOwnProperty(chunks[i]); i--) {
            domainTree = domainTree[chunks[i]];
        }
        for (; i >= 0; i--) {
            domainTree = domainTree[chunks[i]] = {};
        }
    });
    leaf2null(domainsTree, Object.keys(domainsTree));
    return domainsTree;
}
function leaf2null(domainTree, keys) {
    let subKeys;
    keys.forEach(key => {
        subKeys = Object.keys(domainTree[key]);
        if (subKeys.length === 0) {
            domainTree[key] = null;
        }
        else {
            leaf2null(domainTree[key], subKeys);
        }
    });
}
//# sourceMappingURL=pac.js.map