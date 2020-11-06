const modes = {
    proxy: 'SOCKS5 localhost:1080',
    direct: 'DIRECT'
}

const domains = [
    'edu',
    'gov',
    'org',
    'alternativeto.net',
    'appspot.com',
    'blogger.com',
    'bootstrapcdn.com',
    'carbonads.net',
    'castle.io',
    'cloudflare.com',
    'codesandbox.io',
    'composingprograms.com',
    'csacademy.com',
    'deepl.com',
    'diigo.com',
    'disqus.com',
    'doubleclick.net',
    'dwnews.com',
    'fastly.net',
    'fbcdn.net',
    'fontawesome.com',
    'gcorelabs.com',
    'generatedata.com',
    'ggpht.com',
    'gitea.io',
    'git-scm.com',
    'gravatar.com',
    'gstatic.com',
    'hcaptcha.com',
    'hp.net',
    'imgur.com',
    'intercom.io',
    'javascript.info',
    'jetbrains.com',
    'jquery.com',
    'keycdn.com',
    'kubernetes.io',
    'medium.com',
    'msecnd.net',
    'myfonts.net',
    'onlinedoctranslator.com',
    'pearson.com',
    'php.net',
    'pinterest.com',
    'plantuml.com',
    'prismic.io',
    'readthedocs.io',
    'revealjs.com',
    'ruvds.com',
    'ryanstutorials.net',
    'sstatic.net',
    'stackblitz.io',
    'stackpathcdn.com',
    'starship.rs',
    't.co',
    'telesco.pe',
    'tiobe.com',
    't.me',
    'tox.chat',
    'twimg.com',
    'typekit.net',
    'typography.com',
    'uml.ac.at',
    'visualstudio.com',
    'vsassets.io',
    'webscraper.io',
    'wenxuecity.com',
    'windows.net',
    'wordpress.com',
    'ytimg.com'
]

const keywords = [
    'amazon',
    'aws',
    'azure',
    'digitalocean',
    'facebook',
    'firebase',
    'gitbook',
    'github',
    'gitlab',
    'gmail',
    'google',
    'instagram',
    'microsoft',
    'mysql',
    'quora',
    'redd',
    'sqlite',
    'steam',
    'telegram',
    'twitter',
    'v2ray',
    'wiki',
    'youtu'
]

let keywordsRegex = new RegExp(keywords.join('|'))
let domainsTree: { [key: string]: any } = list2tree()

function FindProxyForURL(_: string, host: string) {
    let chunks = host.split('.')
    let length = chunks.length
    let domainTree = domainsTree

    //localhost和cn走直连
    if (['localhost', 'cn'].includes(chunks[length - 1])) {
        return modes.direct
    }

    //关键词匹配二级或三级域名
    if (keywordsRegex.test(chunks[length - 2] + '-' + (chunks[length - 3] ?? ''))) {
        return modes.proxy
    }

    //域名列表匹配整个域名
    for (let i = length - 1; i >= 0 && domainTree.hasOwnProperty(chunks[i]); i--) {
        domainTree = domainTree[chunks[i]]
        if (domainTree === null) {
            return modes.proxy
        }
    }

    //匹配失败，进行直连
    return modes.direct
}

function list2tree() {
    let domainsTree: { [key: string]: any } = {}
    let i: number

    domains.forEach(domain => {
        let chunks = domain.split('.')
        let domainTree = domainsTree

        for (i = chunks.length - 1; i >= 0 && domainTree.hasOwnProperty(chunks[i]); i--) {
            domainTree = domainTree[chunks[i]]
        }

        for (; i >= 0; i--) {
            domainTree = domainTree[chunks[i]] = {}
        }

    })

    leaf2null(domainsTree, Object.keys(domainsTree))

    return domainsTree
}

function leaf2null(domainTree: any, keys: string[]) {
    let subKeys: string[]
    keys.forEach(key => {
        subKeys = Object.keys(domainTree[key])
        if (subKeys.length === 0) {
            domainTree[key] = null
        } else {
            leaf2null(domainTree[key], subKeys)
        }
    })
}
