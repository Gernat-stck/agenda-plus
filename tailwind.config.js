module.exports = {
  theme: {
    extend: {
      colors: {
        'pale-gray': '#d3d3d3',
        'light-gray': '#a9a9a9',
        'dark-gray': '#696969',
        'primary': '#873bf7',
      },
      spacing: {
        '235px': '235px',
        '100vh': '100vh',
      },
      transitionProperty: {
        'left': 'left',
        'visibility': 'visibility',
      },
      scale: {
        '110': '1.1',
      },
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
      scale: ['group-hover'],
    },
  },
  plugins: [],
}