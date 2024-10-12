const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get a specific vehicle's details by ID
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; // Single vehicle
  } catch (error) {
    console.error("getVehicleById error " + error);
    throw error;
  }
}

async function addInventory(data) {
  const sql = "INSERT INTO inventory (classification_id, inv_make) VALUES ($1, $2) RETURNING *";
  return await pool.query(sql, [data.classification_id, data.inv_make]);
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId, // Add this export
  getVehicleById
}