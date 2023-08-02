const username = document.querySelector("#name");
const email = document.querySelector("#email");
const birthday = document.querySelector("#birthday");
const level0 = document.querySelector("#level0");
const level1 = document.querySelector("#level1");
const content = document.querySelector("#level-content");
const userForm = document.querySelector("#user-form");
const regExpDate = /^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/g;
const regExpEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

let level = "",
  levelData = {},
  submitBoolean = false;

const error = [], allLevel = ["BTS", "Licence", "Master"];

username.addEventListener("change", () => inputChange(username));
email.addEventListener("change", () => inputChange(email));
birthday.addEventListener("change", () => inputChange(birthday));

userForm.addEventListener("submit", async(e) => {
  e.preventDefault();
  document.querySelector(`#choice-error`).textContent = "";
  if (!submitBoolean) submitBoolean = true;
  if (level === "secondaire") {
    levelData.name = level;
    levelData.class = document.querySelector("#class").value;
  }

  if (level === "university") {
    levelData.name = level;
    levelData.class = document.querySelector("#class").value;
    levelData.option = document.querySelector("#option").value;
  }
  error.splice(0, error.length);
  const userInfo = checkAllData();
  if(error.length === 0) {
    userForm.setAttribute("disable", true);
    userInfo.username = userInfo.name;
    delete userInfo.name;
    const datas = await getData("cs");
    const piscine = await getData("piscine");
    const checkEmail = piscine.filter(data => data.Email === userInfo.email);
    const filter = datas.filter(data => data.email === userInfo.email);
    if(checkEmail.length === 1) {
      if(filter.length === 0) {
        console.log(checkEmail);
        //await saveData("cs", userInfo);
        alert("Données enregistrées avec success");
        location.reload();
        return;
      }
      alert("L'email exite, vous êtes déjà fait enregistré");
      location.reload();
      return;
    }
    email.value = "";
    alert("L'email fourni n'existe pas dans notre base de donées");
  }
});

level0.addEventListener("change", (e) => {
  content.textContent = "";
  document.querySelector(`#choice-error`).textContent = "";
  if (e.target.checked) {
    addField("class", "Class Level");
    level = "secondaire";
    const elem = document.querySelector("#class");
    elem.addEventListener("change", () => inputChange(elem));
  }
});

level1.addEventListener("change", (e) => {
  content.textContent = "";
  if (e.target.checked) {
    addField("class", "Level");
    addField("option", "Option");
    level = "university";
    const elem = document.querySelector("#class");
    elem.setAttribute("list", "list");
    elem.addEventListener("change", () => inputChange(elem));
    const dataList = document.createElement("datalist");
    dataList.setAttribute("id", "list");

    allLevel.map(niveau => {
      const option = document.createElement("option");
      option.setAttribute("value", niveau);
      dataList.append(option);
    })
    elem.appendChild(dataList)
    const elem1 = document.querySelector("#option");
    elem1.addEventListener("change", () => inputChange(elem1));
  }
});

const addField = (id, text) => {
  const label = document.createElement("label");
  label.setAttribute("for", id);
  const textLabel = document.createTextNode(text);
  label.append(textLabel);
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", id);
  input.setAttribute("class", "form-control");
  const span = document.createElement("span");
  span.setAttribute("id", `${id}-error`);
  span.classList.add("error");
  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");
  formGroup.append(label);
  formGroup.append(input);
  formGroup.append(span);
  content.append(formGroup);
};

const checkAllData = () => {
  const obj = {
    name: username.value,
    email: email.value,
    birthday: birthday.value,
    level: levelData,
  };

  for (const key in obj) {
    checkNameEmailBirthday(key, obj);
    checkLevelOfStudy(key, obj);
  }

  document.querySelector(`#choice-error`).textContent = "";
  if(level === "") {
    document.querySelector(`#choice-error`).textContent = "Vous devez choisir le level";
    error.push("choice")
  }
  return obj;
};

const checkNameEmailBirthday = (key, obj) => {
  let message = "";
  if (
    (key !== "email" && key !== "level" && obj[key] === "") ||
    (!regExpEmail.test(obj.email) && key === "email")
  ) {
    message = messageReturn(key);
  }
  if(message !== "") error.push(key);
  if (key !== "level") errorMessage(key, message);
};

const checkLevelOfStudy = (key, obj) => {
  if (key === "level") {
    for (const cle in obj.level) {
      let message = "";
      if (obj.level[cle] === "" && cle !== "name") {
        message = "Ce champs est obligatoire";
      }
  
      if (cle === "class" && level === "university" && !allLevel.includes(obj[key][cle])) {
        message = `Votre devez choisir dans la liste deroulante`
      }

      if(cle !== "name") errorMessage(cle, message);

      if(message !== "") error.push(cle);
    }
  }
};

const errorMessage = (id, msg) => {
  if (msg !== "") document.querySelector(`#${id}`).value = ""; 
  document.querySelector(`#${id}-error`).textContent = msg; 
};

const inputChange = (id) => {
  let msg = "";
  const nameId = id.getAttribute("id");
  if (
    submitBoolean &&
    (
      (nameId === "email" && !regExpEmail.test(id.value))) ||
      (nameId !== "email" && id.value === "")
  ) {
    msg = messageReturn(nameId);
  }
  if(submitBoolean && nameId === "class" && level === "university" && !allLevel.includes(id.value)) {
    msg = `Votre devez choisir dans la liste deroulante`;
  }

  errorMessage(id.getAttribute("id"), msg);
};

const messageReturn = (key) => {
  return key === "birthday"
    ? "Vous devez saisir une date"
    : key === "email"
    ? "Vous devez saisir une adresse email"
    : "Ce champs est obligatoire";
}
