"use strict";
const modes = {
    proxy: 'SOCKS5 localhost:1080',
    direct: 'DIRECT'
};
const domains = [
    '500px.org',
    'alternativeto.net',
    'ampproject.org',
    'appspot.com',
    'blogger.com',
    'bootstrapcdn.com',
    'carbonads.net',
    'cat-v.org',
    'chromium.org',
    'cloudflare.com',
    'codesandbox.io',
    'csacademy.com',
    'deepl.com',
    'diigo.com',
    'disqus.com',
    'doubleclick.net',
    'dwnews.com',
    'fbcdn.net',
    'fontawesome.com',
    'generatedata.com',
    'golang.org',
    'gravatar.com',
    'hp.net',
    'imgur.com',
    'javascript.info',
    'jetbrains.com',
    'kde.org',
    'keycdn.com',
    'kubernetes.io',
    'linuxcommand.org',
    'medium.com',
    'msecnd.net',
    'myfonts.net',
    'nodejs.org',
    'onlinedoctranslator.com',
    'openuserjs.org',
    'php.net',
    'pinterest.com',
    'princeton.edu',
    'prismic.io',
    'readthedocs.io',
    'readthedocs.org',
    'revealjs.com',
    'ryanstutorials.net',
    'sstatic.net',
    'stackblitz.io',
    'stackpathcdn.com',
    'starship.rs',
    't.co',
    'telesco.pe',
    'tiobe.com',
    't.me',
    'torproject.org',
    'tox.chat',
    'typography.com',
    'umass.edu',
    'visualstudio.com',
    'wenxuecity.com',
    'windows.net'
];
const keywords = [
    'amazon',
    'aws',
    'azure',
    'digitalocean',
    'facebook',
    'firebase',
    'ggpht',
    'gitbook',
    'github',
    'gitlab',
    'gmail',
    'google',
    'gstatic',
    'instagram',
    'microsoft',
    'mysql',
    'quora',
    'redd',
    'sqlite',
    'steam',
    'telegram',
    'twimg',
    'twitter',
    'v2ray',
    'vsassets',
    'webscraper',
    'wiki',
    'youtu',
    'ytimg'
];
let keywordsRegex = new RegExp(keywords.join('|'));
let domainsTree = list2tree();
function FindProxyForURL(_, host) {
    let chunks = host.split('.');
    let length = chunks.length;
    let domainTree = domainsTree;
    if (['localhost', 'cn'].includes(chunks[length - 1])) {
        return modes.direct;
    }
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