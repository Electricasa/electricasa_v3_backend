// current fields necessary for an address entry to be considered complete 
// utility is optional
const addressFields = ["attic", "house", "roof", "spHeater", "waHeater"]

// checks if address document has necessary fields entered to be "complete"
function checkComplete(addressDoc){
  for (let idx in addressFields){
    
    // console.log(idx, "idx from checkComplete");
    // console.log(addressDoc[addressFields[idx]], "m--------W Keys of addressDoc")
    if(!addressDoc[addressFields[idx]]){
      return false;
    }
    console.log(addressDoc, "addressDoc from checkComplete");
  }
  return true;
}

module.exports = {
    checkComplete
}