module.exports = function hello({ name }) {
  return {
    content: [{ text: `Hello ${name}`, style: 'header' }, { text: `This is a pdf file` }],
    styles: {
      header: {
        bold: true,
        fontSize: 15,
      },
    },
    defaultStyle: {
      fontSize: 12,
    },
  };
};
