const masterList = {};

const _whiteLists = {};

export default class WhiteLister {
  constructor(features) {
    features.default = true;

    this._featureKeys = Object.keys(features).filter(f => features[f]);
    this._key = this._featureKeys.join(':');
    this._features = features;
  }

  getWhiteList() {
    if (!_whiteLists[this._key]) {
      const tagList = {};
      let attrList = {};

      this._featureKeys.forEach(f => {
        const info = masterList[f];
        if (info && info.tags) {
          Object.keys(info.tags).forEach(t => tagList[t] = []);
          attrList = _.merge(attrList, info.tags);
        }
      });

      _whiteLists[this._key] = { tagList, attrList };
    }
    return _whiteLists[this._key];
  }
}

// Builds our object that represents whether something is sanitized for a particular
// feature.
export function whiteListFeature(feature, info) {
  const featureInfo = {
    tags: {}
  };

  (info.tags || []).forEach(tag => {

    const classes = tag.split('.');
    const tagName = classes.shift();
    const m = /\[([^\]]+)]/.exec(tagName);
    if (m) {
      const [full, inside] = m;
      console.log(full, inside);
      const stripped = tagName.replace(full, '');
      const vals = inside.split('=');

      featureInfo.tags[stripped] = featureInfo.tags[stripped] || {};
      if (vals.length === 2) {
        const [name, value] = vals;
        featureInfo.tags[stripped][name] = value;
      } else {
        featureInfo.tags[stripped][inside] = '*';
      }
    }

    featureInfo.tags[tagName] = featureInfo.tags[tagName] || {};
    if (classes.length) {
      featureInfo.tags[tagName]['class'] = (featureInfo.tags[tagName]['class'] || []).concat(classes);
    }
  });

  masterList[feature] = featureInfo;
}

// Only add to `default` when you always want your whitelist to occur. In other words,
// don't change this for a plugin or a feature that can be disabled
whiteListFeature('default', {
  tags: ['br',
         'p',
         'strong',
         'em',
         'blockquote',
         'div',
         'div.title',
         'div.quote-controls',
         'i',
         'b',
         'ul',
         'ol',
         'li',
         'small',
         'code',
         'span.bbcode-b',
         'span.bbcode-i',
         'span.bbcode-u',
         'span.bbcode-s',
         'span.mention',
         'span.hashtag',
         'span.excerpt',
         'aside.quote',
         'a[target=_blank]',
         'a[rel=nofollow]',
         'a.attachment',
         'a.onebox',
         'a.mention',
         'a.mention-group',
         'a.hashtag',
         'a[name]',
         'a[data-bbcode]',
         'img[alt]',
         'pre',
         'h1',
         'h2',
         'h3',
         'h4',
         'h5',
         'h6']
});
