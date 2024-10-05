const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details by inventory ID
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    const vehicleData = await invModel.getVehicleById(inv_id);
    const vehicleHTML = await utilities.buildVehicleDetail(vehicleData);
    let nav = await utilities.getNav();

    res.render("./inventory/vehicleDetail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    next(error); // Pass error to error handling middleware
  }
};

module.exports = invCont