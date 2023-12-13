export default {
  scan: {
    dirs: ['src'],
    exclude: [
      'node_modules',
      '.git',
      'public/**/*',
      '*.template.html',
      'index.html',
    ],
    include: [],
  },
  shortcuts:{
    'flex-center': 'flex items-center justify-center',
    'flex-end': 'flex items-center justify-end',
  },
  transformCSS: 'pre',
}
