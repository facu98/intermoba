const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("transaction", {
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    cvu_sender: {
      type: DataTypes.STRING,
    },
    name_sender:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvu_receiver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("processing", "cancelled", "confirmed"),
      defaultValue:'processing'
  },
    message: {
      type: DataTypes.STRING
    }
  });
};
