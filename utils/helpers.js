module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  format_currency: (value) => {
    // format value as CA dollars
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
  },
  stringfy: (data) => {
    return JSON.stringify(data);
  },
};
