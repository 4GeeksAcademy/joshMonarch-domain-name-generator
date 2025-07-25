import "bootstrap";
import "./style.css";
import tdls from "./static/TLDs.json";

const randNum = (max, min) => Math.floor(Math.random() * (max - min)) + min;
const randSelection = (arr) => arr[randNum(arr.length, 0)];
const areInputsFilled = (inputs) => inputs.every(input => input.value.trim() !== "");
const getTdlType = (inputs) => inputs.filter(input => input.checked)[0].id;

const generateRandomDomain = (pronouns, adjectives, nouns, tdls) => {
  let {gTDL, sTDL, ccTDL} = tdls;
  let ccTDLKeys = Object.keys(ccTDL);
  let allTDLs = [...gTDL, ...sTDL, ...ccTDLKeys];
  return randSelection(pronouns)
    .concat(randSelection(adjectives))
    .concat(randSelection(nouns))
    .concat(".")
    .concat(randSelection(allTDLs));
}

function getTdlsIncluded(tdlType, text){
  if(tdlType === "ccTDL"){
    return Object.entries(tdls[tdlType]).filter(([_, value]) => value.includes(text)
      ).map(([key, _]) => key);
  } else {
    return tdls[tdlType].filter(tdl => tdl.includes(text));
  }
}

function updateDropdown(text, dropdown, tdlType) {
  if(dropdown.hasChildNodes) dropdown.innerHTML = '';

  const tdlsIncluded = getTdlsIncluded(tdlType, text);
  
  (text.trim() !== "" && tdlsIncluded.length != 0) ? 
  dropdown.classList.remove("d-none") : 
  dropdown.classList.add("d-none");

  for(let i = 0; i < tdlsIncluded.length; i++){
    const li = document.createElement("li");
    li.classList.add("dropdown-item");
    li.innerHTML = tdlsIncluded[i];
    dropdown.appendChild(li);
  }
}

window.onload = function() {
  const pronouns   = ['the', 'our', 'my', 'your', 'their'];
  const adjectives = ['great', 'big', 'small', 'amazing', 'unknown'];
  const nouns      = ['jogger', 'racoon', 'storage', 'sea', 'mind', 'room', 'house'];

  const btnRandom    = document.querySelector(".btn-secondary");
  const btnForm      = document.querySelector(".btn-primary");
  const ps           = document.querySelectorAll("p");
  const nameSearch   = document.querySelector("#nameSearch");
  const tdlSearch    = document.querySelector("#tdlSearch");
  const tdlDropdown  = document.querySelector("#tdlDropdown");
  const radios       = [...document.querySelectorAll("input[type=radio]")];
  const movingDiv    = document.querySelector(".moving");

  movingDiv.addEventListener("mouseover", (e) => {
    const div = e.target;
    if (div.classList.contains("start")) {
      div.classList.remove("start");
      div.classList.add("end");
    } else {
      div.classList.remove("end");
      div.classList.add("start");
    }
  })

  nameSearch.addEventListener("input", () => 
    areInputsFilled([nameSearch, tdlSearch]) ? 
    btnForm.classList.remove("disabled") : 
    btnForm.classList.add("disabled"));

  tdlSearch.addEventListener("input", (e) => updateDropdown(e.target.value, tdlDropdown, getTdlType(radios)));
  
  tdlDropdown.addEventListener("click", (e) => {
    tdlSearch.value = e.target.textContent;
    areInputsFilled([nameSearch, tdlSearch]) ? 
    btnForm.classList.remove("disabled") : 
    btnForm.classList.add("disabled");
  });

  btnRandom.addEventListener("click", () => ps[0].innerHTML = generateRandomDomain(pronouns, adjectives, nouns, tdls));
  btnForm.addEventListener("click", (e) => {
    e.preventDefault();
    ps[1].innerHTML = nameSearch.value + "." + tdlSearch.value;
    btnForm.classList.add("disabled");
  })
};
