
// const useUnitPriceCalculator = (unitPrice, unitValue, formData, setFormData) => {
    
//   const calculateUnitPrice = (index) => {
//     let getUnitValue = 0;
//     const price = unitPrice[0] ? unitPrice[0].toString() : '';
//     const value = unitValue[0] ? unitValue[0].toString() : '';

//     const numbersOnly = value.match(/\d+(\.\d+)?/g);
//     if(numbersOnly) {
//       const result = numbersOnly.map(Number);
//       getUnitValue =  parseFloat(result[0]) * parseFloat(result[1]);
//     }

//     const basePrice = parseFloat(price) * getUnitValue;
//     const totalUnitPrice = basePrice * (formData[index]?.quantity || 0) * (formData[index]?.width || 0) * (formData[index]?.height || 0);
//     console.log('totalUnitPrice', totalUnitPrice, basePrice, getUnitValue, formData[index]?.quantity, formData[index]?.width, formData[index]?.height);
    

//     setFormData((prevFormData) => {
//       const updatedFormData = [...prevFormData];
//       if (!updatedFormData[index]) {
//         updatedFormData[index] = {}; // Initialize object at index if undefined
//       }
//       updatedFormData[index].unitPrice = totalUnitPrice;
//       return updatedFormData;
//     });

//     return totalUnitPrice;
//   };

//   return calculateUnitPrice;
// };

// export default useUnitPriceCalculator;