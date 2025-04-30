
function formatToCustomScientificNotation(number) {
    // Manejar casos donde el número es 0 o no válido para logaritmo
    if (number === 0 || !isFinite(number) || isNaN(number) || number === null) {
      return "0.00 x 10^0"; // O alguna otra representación para cero/inválido
    }
    const exponent = Math.floor(Math.log10(Math.abs(number))); // Usar Math.abs para números negativos si aplica
    const coefficient = (number / Math.pow(10, exponent)).toFixed(2);
    return `${coefficient} x 10^${exponent}`;
  }
  
  // Exporta las funciones de utilidad para que puedan ser usadas en otros módulos
  module.exports = {
    formatToCustomScientificNotation,
  };