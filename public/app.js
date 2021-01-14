let dict = {};



let btnVlidate = document.getElementById('btnValidete').addEventListener('click',(event)=>{
  event.preventDefault();

  let _a;
  let inputValue = (_a = document.getElementById("inputNumber")).value;

console.log("randm",randomNumber)
console.log("value",inputValue)

  dict["picas"] = 0;
  dict["fijas"] = 0;
  validateResult(inputValue, randomNumber.toString());
})


function rangeNumber(option) {
  let numberGenerate;
  switch (option) {
    case "1":
      numberGenerate = generateNumber(0, 10);
      break;
    case "2":
      numberGenerate = generateNumber(10, 99);
      break;

    case "3":
      numberGenerate = generateNumber(99, 999);
      break;

    case "3":
      numberGenerate = generateNumber(999, 9999);
      break;
  }
  return numberGenerate;
}

function generateNumber(rangeMax, rangeMin) {
  return Math.floor(Math.random() * (rangeMax - rangeMin + 1) + rangeMin);
}

function validateResult(inputValue, randomValue) {
  console.log("valuenumber",randomValue)
  for (let letter of inputValue) {
    if (
      randomValue.includes(letter) &&
      inputValue.indexOf(letter) !== randomValue.indexOf(letter)
    ) {
      ++dict["picas"];
    } else if (
      randomValue.includes(letter) &&
      inputValue.indexOf(letter) == randomValue.indexOf(letter)
    ) {
      ++dict["fijas"];
    }else if(Object.keys(dict['fijas']).length===randomNumber.toString().length)
    console.log("ganastee")
    
  }

  sendRecord(dict);
}
