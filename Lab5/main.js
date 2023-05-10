import 'regenerator-runtime/runtime';''
import { randomUserMock } from './Lab5Mock.js'
import { favoriteTeachers } from './Lab5Mock.js';
import axios from 'axios';

let randomUserIndex = 0;
let currentMoreTeacherElement = null;
let currentMoreTeacherElementID = "";
let statisticsCurrentElementID = undefined;
let currentFavoritesFirstElement = 1;
let currentFavoritesLastElement = 6;
let currentStatisticsPage = 1;
let totalCount = 0;
let finalStatisticsArray = [];
let finalSearchArray = [];
let finalFilterArray = [];
let randomUserApiMock = [];
let statisticsFinalArrayToSort = [];
let sortName = false;
let sortSpecialty = false;
let sortAge = false;
let sortGender = false;
let sortNationality = false;
let isSearching = false;
let isFiltering = false;
window.onload = setGridStatisticsItems();
let currentDisplayedTeachersIndex = 0;

export function openForm(elemID) {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("darken").style.display = "block";
  document.getElementById("add-teacher-form").reset();
}

export function closeForm(elemID) {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("darken").style.display = "none";
}

export function openMoreForm(elemID) {
  //Find element in array
  let element = document.getElementById(elemID);
  currentMoreTeacherElement = document.getElementById(elemID);
  currentMoreTeacherElementID = elemID;
  for(let i = 0; i < randomUserApiMock.length; i++){
    if(element.id == randomUserApiMock[i].id){
      let nameElement = document.getElementById("more-name");
      nameElement.innerHTML = randomUserApiMock[i].full_name;
      let imgElement = document.getElementById("more-img");
      imgElement.src = randomUserApiMock[i].picture_large;
      let courseElement = document.getElementById("more-course");
      courseElement.innerHTML = randomUserApiMock[i].course;
      let cityCountryElement= document.getElementById("more-city-country");
      cityCountryElement.innerHTML = randomUserApiMock[i].city + ", " + randomUserApiMock[i].country;
      let ageSexElement= document.getElementById("more-age-sex");
      ageSexElement.innerHTML = randomUserApiMock[i].age + ", " + randomUserApiMock[i].gender;
      let emailElement= document.getElementById("more-email");
      emailElement.innerHTML = randomUserApiMock[i].email;
      let phoneElement= document.getElementById("more-phone");
      phoneElement.innerHTML = randomUserApiMock[i].phone;
      let starImg= document.getElementById("img-more-star");
      for(let g = 0; g < favoriteTeachers.length; g++){
        if(favoriteTeachers[g].id == randomUserApiMock[i].id){
          starImg.src = "star.png";
          break;
        }
        else
        starImg.src = "emptystar.png";
      }
    }
  }
  document.getElementById("more").style.display = "block";
  document.getElementById("darken").style.display = "block";
}

export function closeMoreForm(elemID) {
  document.getElementById("more").style.display = "none";
  document.getElementById("darken").style.display = "none";
}

function returnrandomUserApiMock(){
  return randomUserApiMock;
}

function filterObject(country, age, gender, favorite){
  let newMock = [];
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      let CanPush = true;
      if(randomUserApiMock[i].country != country)
      CanPush = false;
      if(randomUserApiMock[i].age != age)
      CanPush = false;
      if(randomUserApiMock[i].gender != gender)
      CanPush = false;
      if(randomUserApiMock[i].favorite != favorite)
      CanPush = false;
      if(CanPush)
      newMock.push(randomUserApiMock[i]);
    }
    return newMock;
  }
}

function old_sortByCountry(country, type){
  let MockCountry = [];
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      let CanPush = false;
      if(randomUserApiMock[i].country === country){
        CanPush = true;
        break;
      }
      if(CanPush)
      MockCountry.push(randomUserApiMock[i].country);
      if(type === 'descending'){
        MockCountry.sort();
        MockCountry.reverse();
      }
      else if(type === 'ascending')
      MockCountry.sort();
      let finalArray = [];
      for (let j = 0; i < MockCountry.length; i++) {
        const object = {country: MockCountry[j].country, age: randomUserApiMock[i].age, gender: randomUserApiMock[i].gender, favorite: randomUserApiMock[i].favorite};
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}

function old_sortByAge(age, type){
  let MockAge = [];
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      let CanPush = false;
      if(randomUserApiMock[i].age === age){
        CanPush = true;
        break;
      }
      if(CanPush)
      MockAge.push(randomUserApiMock[i].age);
      if(type === 'descending')
      MockAge.sort(function(a, b){return b - a});
      else if(type === 'ascending')
      MockAge.sort(function(a, b){return a - b});
      let finalArray = [];
      for (let j = 0; i < MockAge.length; i++) {
        const object = {country: randomUserApiMock[i].country, age: MockAge.age, gender: randomUserApiMock[i].gender, favorite: randomUserApiMock[i].favorite};
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}

function old_sortByGender(gender, type){
  let MockGender = [];
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      let CanPush = false;
      if(randomUserApiMock[i].gender === gender){
        CanPush = true;
        break;
      }
      if(CanPush)
      MockGender.push(randomUserApiMock[i].gender);
      if(type === 'descending'){
        MockGender.sort();
        MockGender.reverse();
      }
      else if(type === 'ascending')
      MockGender.sort();
      let finalArray = [];
      for (let j = 0; i < MockGender.length; i++) {
        const object = {country: randomUserApiMock[i].country, age: randomUserApiMock[i].age, gender: MockGender.gender, favorite: randomUserApiMock[i].favorite};
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}

function old_sortByFavorite(favorite, type){
  let MockFavorite = [];
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      let CanPush = false;
      if(randomUserApiMock[i].favorite === favorite){
        CanPush = true;
        break;
      }
      if(CanPush)
      MockFavorite.push(randomUserApiMock[i].favorite);
      if(type === 'descending'){
        MockFavorite.sort();
        MockFavorite.reverse();
      }
      else if(type === 'ascending')
      MockFavorite.sort();
      let finalArray = [];
      for (let j = 0; i < MockFavorite.length; i++) {
        const object = {country: randomUserApiMock[i].country, age: randomUserApiMock[i].age, gender: randomUserApiMock[i].gender, favorite: MockFavorite.favorite};
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}

function findObjectName(name){
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      if(randomUserApiMock[i].name === name)
      return randomUserApiMock[i];
    }
  }
}

function findObjectNote(note){
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      if(randomUserApiMock[i].note === note)
      return randomUserApiMock[i];
    }
  }
}

function findObjectAge(age){
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      if(randomUserApiMock[i].age === age)
      return randomUserApiMock[i];
    }
  }
}

function findObjectNamePercentage(name){
  let numberOfObjects = 0;
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      if(randomUserApiMock[i].name === name)
      numberOfObjects++;
    }
    return numberOfObjects/randomUserApiMock.length;
  }
}

function findObjectNotePercentage(note){
  let numberOfObjects = 0;
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      if(randomUserApiMock[i].note === note)
      numberOfObjects++;
    }
    return numberOfObjects/randomUserApiMock.length;
  }
}

function findObjectAgePercentage(age){
  let numberOfObjects = 0;
  if(validateObjects()){
    for (let i = 0; i < randomUserApiMock.length; i++) {
      if(randomUserApiMock[i].age === age)
      numberOfObjects++;
    }
    return numberOfObjects/randomUserApiMock.length;
  }
}

async function setGridStatisticsItems(){
  window.openForm = openForm;
  window.openMoreForm = openMoreForm;
  window.closeForm = closeForm;
  window.closeMoreForm = closeMoreForm;
  window.addToFavorites = addToFavorites;
  window.onFilterChange =onFilterChange;
  window.sortByName = sortByName;
  window.sortBySpecialty = sortBySpecialty;
  window.sortByAge = sortByAge;
  window.sortByGender = sortByGender;
  window.sortByNationality = sortByNationality;
  window.nextFavorites = nextFavorites;
  window.previousFavorites = previousFavorites;
  window.statisticsButton = statisticsButton;
  window.searchOnChange = searchOnChange;
  window.addNewTeacher = addNewTeacher;
  window.nextTeachers = nextTeachers;
  randomUserApiMock = await getUsers();
  let currentIndex = randomUserIndex;
  let arrayimg = Array.from(document.getElementsByClassName('img-teachers-orange'));
  arrayimg.forEach(el => {
    el.src = randomUserApiMock[currentIndex].picture_large;
    currentIndex++;
    if(currentIndex >= randomUserApiMock.length)
    currentIndex = 0;
  });
  currentIndex = randomUserIndex;
  let arrayh1= Array.from(document.getElementsByClassName('teachers-h1'));
  arrayh1.forEach(el => {
    let firstName = "";
    let lastName = "";
    let i = 0;
    for(; i < randomUserApiMock[currentIndex].full_name.length; i++){
      if(randomUserApiMock[currentIndex].full_name[i] == " "){
        i++
        break;
      }
      firstName += randomUserApiMock[currentIndex].full_name[i];
    }
    for(; i < randomUserApiMock[currentIndex].full_name.length; i++){
      lastName += randomUserApiMock[currentIndex].full_name[i];
    }
    el.innerHTML = firstName + "<br>" + lastName;
    currentIndex++;
    if(currentIndex >= randomUserApiMock.length)
    currentIndex = 0;
  });
  currentIndex = randomUserIndex;
  let arraydiv= Array.from(document.getElementsByClassName('teachers-grid-item'));
  arraydiv.forEach(el => {
    el.id = randomUserApiMock[currentIndex].id;
    currentIndex++;
    if(currentIndex >= randomUserApiMock.length)
    currentIndex = 0;
  });
  currentIndex = randomUserIndex;
  let arraypfirst= Array.from(document.getElementsByClassName('teachers-p-first'));
  arraypfirst.forEach(el => {
    el.innerHTML = randomUserApiMock[currentIndex].course;
    currentIndex++;
    if(currentIndex >= randomUserApiMock.length)
    currentIndex = 0;
  });
  currentIndex = randomUserIndex;
  let arraypsecond= Array.from(document.getElementsByClassName('teachers-p-second'));
  arraypsecond.forEach(el => {
    el.innerHTML = randomUserApiMock[currentIndex].country;
    currentIndex++;
    if(currentIndex >= randomUserApiMock.length)
    currentIndex = 0;
  });
  randomUserIndex = currentIndex;
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  for(let i = 0; i < randomUserApiMock.length; i++){
  finalStatisticsArray.push({"name": randomUserApiMock[i].full_name, "specialty": randomUserApiMock[i].course, "age" : randomUserApiMock[i].age,
  "gender" : randomUserApiMock[i].gender, "nationality": randomUserApiMock[i].country});
  statisticsFinalArrayToSort.push({"name": randomUserMock[i].full_name, "specialty": randomUserMock[i].course, "age" : randomUserMock[i].age,
  "gender" : randomUserMock[i].gender, "nationality": randomUserMock[i].country});
  }
  for(let i = 0; i < randomUserApiMock.length; i++)
  finalSearchArray.push(randomUserApiMock[i]);
  for(let i = 0; i < 10; i++){
    arrayName[i].innerHTML = finalStatisticsArray[i].name;
    arraySpecialty[i].innerHTML = finalStatisticsArray[i].specialty;
    arrayAge[i].innerHTML = finalStatisticsArray[i].age;
    arrayGender[i].innerHTML = finalStatisticsArray[i].gender;
    arrayNationality[i].innerHTML = finalStatisticsArray[i].nationality;
  }
  totalCount = Math.ceil(randomUserApiMock.length/10);

  finalFilterArray = randomUserApiMock;
}

async function setNextTeachers(arrayWithData){
  if(currentDisplayedTeachersIndex * 10 >= arrayWithData.length)
  currentDisplayedTeachersIndex = 0;
  let currentIndex = currentDisplayedTeachersIndex * 10;
  let arrayimg = Array.from(document.getElementsByClassName('img-teachers-orange'));
  let arrayh1= Array.from(document.getElementsByClassName('teachers-h1'));
  let arraydiv= Array.from(document.getElementsByClassName('teachers-grid-item'));
  let arraypfirst= Array.from(document.getElementsByClassName('teachers-p-first'));
  let arraypsecond= Array.from(document.getElementsByClassName('teachers-p-second'));
  let arrayStar = Array.from(document.getElementsByClassName('teachers-div-relative'));
  let lastIndex = 0;
  for(let i = 0; i < 10 && currentIndex < arrayWithData.length; i++, currentIndex++){
    arrayimg[i].src = arrayWithData[currentIndex].picture_large;
    let firstName = "";
    let lastName = "";
    let c = 0;
    for(; c < arrayWithData[currentIndex].full_name.length; c++){
      if(arrayWithData[currentIndex].full_name[c] == " "){
        c++;
        break;
      }
      firstName += arrayWithData[currentIndex].full_name[c];
    }
    for(; c < arrayWithData[currentIndex].full_name.length; c++)
    lastName += arrayWithData[currentIndex].full_name[c];
    arrayh1[i].innerHTML = firstName + "<br>" + lastName;
    arraydiv[i].id = arrayWithData[currentIndex].id;
    arraydiv[i].style.visibility = "visible";
    arraypfirst[i].innerHTML = arrayWithData[currentIndex].course;
    arraypsecond[i].innerHTML = arrayWithData[currentIndex].country;
  
    let isFavorite = false;
    for(let g = 0; g < favoriteTeachers.length; g++)
    if(arrayWithData[currentIndex].id == favoriteTeachers[g].id){
      arrayStar[i].style.visibility = "visible";
      isFavorite = true;
      break;
    }
    if(!isFavorite)
    arrayStar[i].style.visibility = "hidden";
    lastIndex = i;
  }
  lastIndex++;
  for(; lastIndex < 10; lastIndex++){
    arraydiv[lastIndex].id = "";
    arraydiv[lastIndex].style.visibility = "hidden";
    arrayStar[lastIndex].style.visibility = "hidden";
  }
}

export function nextTeachers(){
  currentDisplayedTeachersIndex++;
  if(isFiltering && isSearching){
    let finalArray = [];
    for(let i = 0; i < finalFilterArray.length; i++)
      for(let c = 0; c < finalSearchArray.length; c++)
        if(finalFilterArray[i].id == finalSearchArray[c].id){
          finalArray.push(finalFilterArray[i]);
          break;
        }
    setNextTeachers(finalArray);
  }
  else if(isFiltering){
    setNextTeachers(finalFilterArray);
  }
  else if(isSearching){
    setNextTeachers(finalSearchArray);
  }
  else{
    setNextTeachers(randomUserApiMock);
  }
}

export function addToFavorites(){
  for(let i = 0; i < randomUserApiMock.length; i++){
    if(currentMoreTeacherElement.id == randomUserApiMock[i].id)
    {
      let isFavorite = false;
      let b = 0;
      for(; b < favoriteTeachers.length; b++)
      if(favoriteTeachers[b].id == randomUserApiMock[i].id){
        isFavorite = true;
        break;
      }
      if(!isFavorite)
      {
        let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
        let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
        let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
        let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
        let arraydiv= Array.from(document.getElementsByName('favorites-div'));
        for(let c = 0; c < arraydiv.length; c++)
        if(arraydiv[c].id == ""){
          arrayimg[c].src = randomUserApiMock[i].picture_large;
          let firstName = "";
          let lastName = "";
          let g = 0;
          for(; g < randomUserApiMock[i].full_name.length; g++){
            if(randomUserApiMock[i].full_name[g] == " "){
              g++
              break;
            }
            firstName += randomUserApiMock[i].full_name[g];
          }
          for(; g < randomUserApiMock[i].full_name.length; g++){
            lastName += randomUserApiMock[i].full_name[g];
          }
          arrayh1[c].innerHTML = firstName + "<br>" + lastName;
          arraypfirst[c].innerHTML = randomUserApiMock[i].course;
          arraypsecond[c].innerHTML = randomUserApiMock[i].country;
          arraydiv[c].style.visibility = "visible";
          arraydiv[c].id = randomUserApiMock[i].id;
          break;
        }
        favoriteTeachers.push({"picture_large": randomUserApiMock[i].picture_large, "id" : randomUserApiMock[i].id , "name": randomUserApiMock[i].full_name});
        let starImg= document.getElementById("img-more-star");
        let indexForTeachers = 0;
        let arrayRelativeStars= Array.from(document.getElementsByClassName('teachers-div-relative'));
        let arrayTeachers = Array.from(document.getElementsByClassName('teachers-grid-item'));
        for(let c = 0; c < arrayTeachers.length; c++ )
        if(arrayTeachers[c].id == currentMoreTeacherElement.id)
        indexForTeachers = c;
        if(starImg.src === "file:///D:/Unik/Web/Lab5/emptystar.png")
        {
          starImg.src = "star.png";
          arrayRelativeStars[indexForTeachers].style.visibility = "visible";
        }
        else{
          starImg.src = "emptystar.png";
          arrayRelativeStars[indexForTeachers].style.visibility = "hidden";
        }
      }
      else if(isFavorite){
        let starImg= document.getElementById("img-more-star");
        let indexForTeachers = 0;
        let arrayRelativeStars= Array.from(document.getElementsByClassName('teachers-div-relative'));
        let arrayTeachers = Array.from(document.getElementsByClassName('teachers-grid-item'));
        let arrayFavorites= Array.from(document.getElementsByName('favorites-div'));
        for(let c = 0; c < arrayTeachers.length; c++ )
        if(arrayTeachers[c].id == currentMoreTeacherElement.id)
        indexForTeachers = c;
        starImg.src = "emptystar.png";
        arrayRelativeStars[indexForTeachers].style.visibility = "hidden";
        let indexForFavorites = 0;
        let indexForFavoriteTeachers = 0;
        for(let c = 0; c < arrayFavorites.length; c++ )
        if(arrayFavorites[c].id == currentMoreTeacherElement.id)
        indexForFavorites = c;
        for(let c = currentFavoritesFirstElement; c < favoriteTeachers.length; c++ )
        if(favoriteTeachers[c].id == currentMoreTeacherElement.id){
          if(c + 1 < favoriteTeachers.length)
          indexForFavoriteTeachers = c + 1;
          else
          indexForFavoriteTeachers = c
          break;
        }
        let indexForRandomMock = 0;
        for(let b = indexForFavorites; b < 5 ; b++){
          for(let c = 0; c < randomUserApiMock.length; c++ )
          if(randomUserApiMock[c].id == favoriteTeachers[indexForFavoriteTeachers].id){
            indexForRandomMock = c;
            break;
          }
          
          let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
          arrayimg[b].src = randomUserApiMock[indexForRandomMock].picture_large;
          let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
          let firstName = "";
          let lastName = "";
          let g = 0;
          for(; g < randomUserApiMock[indexForRandomMock].full_name.length; g++){
            if(randomUserApiMock[indexForRandomMock].full_name[g] == " "){
              g++
              break;
            }
            firstName += randomUserApiMock[indexForRandomMock].full_name[g];
          }
          for(; g < randomUserApiMock[indexForRandomMock].full_name.length; g++){
            lastName += randomUserApiMock[indexForRandomMock].full_name[g];
          }
          arrayh1[b].innerHTML = firstName + "<br>" + lastName;
          let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
          arraypfirst[b].innerHTML = randomUserApiMock[indexForRandomMock].course;
          let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
          arraypsecond[b].innerHTML = randomUserApiMock[indexForRandomMock].country;
          let arraydiv= Array.from(document.getElementsByName('favorites-div'));
          arraydiv[b].id = randomUserApiMock[indexForRandomMock].id;
          if(indexForFavoriteTeachers + 1 < favoriteTeachers.length)
          indexForFavoriteTeachers = indexForFavoriteTeachers + 1;
        }
        //Clear favorites cells
        for(let c = 0; c < favoriteTeachers.length; c++ )
        if(favoriteTeachers[c].id == currentMoreTeacherElementID){
          favoriteTeachers.splice(c,1);
          break;
        }
        let arraydiv= Array.from(document.getElementsByName('favorites-div'));
        for(let g = currentFavoritesLastElement - 1; g >= currentFavoritesFirstElement - 1 ; g--)
        if(g > favoriteTeachers.length - 1){
          let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
          arrayimg[g - currentFavoritesFirstElement].src = "A.png";
          let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
          arrayh1[g - currentFavoritesFirstElement].innerHTML = "";
          let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
          arraypfirst[g - currentFavoritesFirstElement].innerHTML = "";
          let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
          arraypsecond[g - currentFavoritesFirstElement].innerHTML = "";
          arraydiv[g - currentFavoritesFirstElement].id = "";
          arrayFavorites[g - currentFavoritesFirstElement].style.visibility = "hidden";
        }
      }
      break;
    }
  }
  let favoritesValue = document.getElementById("only-favorites").checked;
  if(favoritesValue){
    let favoritesCheckBox = document.getElementById("only-favorites");
    favoritesCheckBox.checked = true;
    onFilterChange();
  }
}

export function previousFavorites(){
  if(currentFavoritesFirstElement >= 6){
    let arraydiv= Array.from(document.getElementsByName('favorites-div'));
    currentFavoritesFirstElement -= 5;
    currentFavoritesLastElement -= 5;
    let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
    let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
    let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
    let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
    for(let c = 0; c < arraydiv.length; c++){
      let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
      arrayimg[c].src = "A.png";
      let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
      arrayh1[c].innerHTML = "";
      let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
      arraypfirst[c].innerHTML = "";
      let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
      arraypsecond[c].innerHTML = "";
      let arraydiv= Array.from(document.getElementsByName('favorites-div'));
      arraydiv[c].id = "";
      arraydiv[c].style.visibility = "hidden";
    }
    let g = currentFavoritesFirstElement;
    for(; g < favoriteTeachers.length; g++)
    for(let i = 0; i < randomUserApiMock.length; i++)
    if(randomUserApiMock[i].id == favoriteTeachers[g].id)
    {
      for(let c = 0; c < arraydiv.length; c++)
      if(arraydiv[c].id == ""){
        let firstName = "";
        let lastName = "";
        let g = 0;
        for(; g < randomUserApiMock[i].full_name.length; g++){
          if(randomUserApiMock[i].full_name[g] == " "){
            g++
            break;
          }
          firstName += randomUserApiMock[i].full_name[g];
        }
        for(; g < randomUserApiMock[i].full_name.length; g++){
          lastName += randomUserApiMock[i].full_name[g];
        }
        arrayh1[c].innerHTML = firstName + "<br>" + lastName;
        arraypfirst[c].innerHTML = randomUserApiMock[i].course;
        arraypsecond[c].innerHTML = randomUserApiMock[i].country;
        arrayimg[c].src = randomUserApiMock[i].picture_large;
        arraydiv[c].style.visibility = "visible";
        arraydiv[c].id = randomUserApiMock[i].id;
        break;
      }
    }
    for(; g < currentFavoritesLastElement; g++){
      let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
      arrayimg[g - currentFavoritesFirstElement].src = "A.png";
      let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
      arrayh1[g - currentFavoritesFirstElement].innerHTML = "";
      let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
      arraypfirst[g - currentFavoritesFirstElement].innerHTML = "";
      let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
      arraypsecond[g - currentFavoritesFirstElement].innerHTML = "";
      let arraydiv= Array.from(document.getElementsByName('favorites-div'));
      arraydiv[g - currentFavoritesFirstElement].id = "";
      arraydiv[g - currentFavoritesFirstElement].style.visibility = "hidden";
    }
  }
}

export function nextFavorites(){
  if(favoriteTeachers.length > 6){
    let arraydiv= Array.from(document.getElementsByName('favorites-div'));
    currentFavoritesFirstElement += 5;
    currentFavoritesLastElement += 5;
    let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
    let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
    let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
    let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
    for(let c = 0; c < arraydiv.length; c++){
      let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
      arrayimg[c].src = "A.png";
      let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
      arrayh1[c].innerHTML = "";
      let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
      arraypfirst[c].innerHTML = "";
      let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
      arraypsecond[c].innerHTML = "";
      let arraydiv= Array.from(document.getElementsByName('favorites-div'));
      arraydiv[c].id = "";
      arraydiv[c].style.visibility = "hidden";
    }
    let g = currentFavoritesFirstElement;
    for(; g < favoriteTeachers.length; g++)
    for(let i = 0; i < randomUserApiMock.length; i++)
    if(randomUserApiMock[i].id == favoriteTeachers[g].id)
    {
      for(let c = 0; c < arraydiv.length; c++)
      if(arraydiv[c].id == ""){
        let firstName = "";
        let lastName = "";
        let g = 0;
        for(; g < randomUserApiMock[i].full_name.length; g++){
          if(randomUserApiMock[i].full_name[g] == " "){
            g++
            break;
          }
          firstName += randomUserApiMock[i].full_name[g];
        }
        for(; g < randomUserApiMock[i].full_name.length; g++){
          lastName += randomUserApiMock[i].full_name[g];
        }
        arrayh1[c].innerHTML = firstName + "<br>" + lastName;
        arraypfirst[c].innerHTML = randomUserApiMock[i].course;
        arraypsecond[c].innerHTML = randomUserApiMock[i].country;
        arrayimg[c].src = randomUserApiMock[i].picture_large;
        arraydiv[c].style.visibility = "visible";
        arraydiv[c].id = randomUserApiMock[i].id;
        break;
      }
    }
    for(; g < currentFavoritesLastElement; g++){
      let arrayimg= Array.from(document.getElementsByClassName('img-favorites-orange'));
      arrayimg[g - currentFavoritesFirstElement].src = "A.png";
      let arrayh1= Array.from(document.getElementsByClassName('favorites-h1'));
      arrayh1[g - currentFavoritesFirstElement].innerHTML = "";
      let arraypfirst= Array.from(document.getElementsByClassName('favorites-p-first'));
      arraypfirst[g - currentFavoritesFirstElement].innerHTML = "";
      let arraypsecond= Array.from(document.getElementsByClassName('favorites-p-second'));
      arraypsecond[g - currentFavoritesFirstElement].innerHTML = "";
      let arraydiv= Array.from(document.getElementsByName('favorites-div'));
      arraydiv[g - currentFavoritesFirstElement].id = "";
      arraydiv[g - currentFavoritesFirstElement].style.visibility = "hidden";
    }
  }
}

export function onFilterChange(){
  let ageValue = document.getElementById("age-select").value;
  let regionValue = document.getElementById("region-select").value;
  let sexValue = document.getElementById("sex-select").value;
  let favoritesValue = document.getElementById("only-favorites").checked;
  let correctArray = [];
  let currentIndex = 0;
  let ageUpperLimit = 0;
  let ageLowerLimit = 0;
  let regionForIf = "";
  let sexForIf = "";
  let withFavorites = false;
  if(ageValue == "1831"){
    ageUpperLimit = 31;
    ageLowerLimit = 18;
  }
  else if (ageValue == "3299"){
    ageUpperLimit = 99;
    ageLowerLimit = 32;
  }
  else if (ageValue == "all"){
    ageUpperLimit = 200;
    ageLowerLimit = 0;
  }
  if(sexValue == "All")
  sexForIf = "";
  else if (sexValue == "Male")
  sexForIf = "male";
  else if (sexValue == "Female")
  sexForIf = "female";
  else if (sexValue == "Other")
  sexForIf = "other";
  if(regionValue == "All")
  regionForIf = "";
  else if (regionValue == "Germany")
  regionForIf = "Germany";
  else if (regionValue == "United States")
  regionForIf = "United States";
  if(favoritesValue)
  withFavorites = true;
  else
  withFavorites = false;
  for(let i = 0; i < finalSearchArray.length; i++){
    if(finalSearchArray[i].age >= ageLowerLimit && finalSearchArray[i].age <= ageUpperLimit || finalSearchArray[i].age == undefined)
    if(finalSearchArray[i].country.includes(regionForIf) || finalSearchArray[i].country == undefined)
    if(finalSearchArray[i].gender.includes(sexForIf) || finalSearchArray[i].gender == undefined)
    correctArray.push(finalSearchArray[i]);
  }
  
  if(ageLowerLimit != 0 || ageUpperLimit !=200 || regionForIf != "" || sexForIf != "" || withFavorites)
  isFiltering = true;
  else
  isFiltering = false;

  let finalArray = [];
  
  if(withFavorites){
    for(let i = 0; i < correctArray.length; i++)
    for(let u = 0; u < favoriteTeachers.length; u++)
    if(correctArray[i].id == favoriteTeachers[u].id){
      finalArray.push(correctArray[i]);
      break;
    }
  }
  else
  finalArray = correctArray;
  
  finalFilterArray = finalArray;

  let arrayStar = Array.from(document.getElementsByClassName('teachers-div-relative'));
  
  for(let i = 0; i < arrayStar.length; i++)
  arrayStar[i].style.visibility = "hidden";

  for(let i = 0; i < finalFilterArray.length && i < 10; i++, currentIndex++){
    let arrayimg = Array.from(document.getElementsByClassName('img-teachers-orange'));
    let arrayh1= Array.from(document.getElementsByClassName('teachers-h1'));
    let arraydiv= Array.from(document.getElementsByClassName('teachers-grid-item'));
    let arraypfirst= Array.from(document.getElementsByClassName('teachers-p-first'));
    let arraypsecond= Array.from(document.getElementsByClassName('teachers-p-second'));
    arrayimg[i].src = finalFilterArray[i].picture_large;
    let firstName = "";
    let lastName = "";
    let c = 0;
    for(; c < finalFilterArray[i].full_name.length; c++){
      if(finalFilterArray[i].full_name[c] == " "){
        c++;
        break;
      }
      firstName += finalFilterArray[i].full_name[c];
    }
    for(; c < finalFilterArray[i].full_name.length; c++)
    lastName += finalFilterArray[i].full_name[c];
    arrayh1[i].innerHTML = firstName + "<br>" + lastName;
    arraydiv[i].id = finalFilterArray[i].id;
    arraydiv[i].style.visibility = "visible";
    arraypfirst[i].innerHTML = finalFilterArray[i].course;
    arraypsecond[i].innerHTML = finalFilterArray[i].country;
    
    if(withFavorites)
    arrayStar[i].style.visibility = "visible";
    
    
    
    if(!withFavorites)
    for(let g = 0; g < favoriteTeachers.length; g++)
    if(finalFilterArray[i].id == favoriteTeachers[g].id){
      arrayStar[i].style.visibility = "visible";
      break;
    }
  }
  for(; currentIndex < 10; currentIndex++){
    let arraydiv= Array.from(document.getElementsByClassName('teachers-grid-item'));
    arraydiv[currentIndex].id = "";
    arraydiv[currentIndex].style.visibility = "hidden";
  }

  finalStatisticsArray = [];
  statisticsFinalArrayToSort = [];
  finalFilterArray.forEach(el => {
    finalStatisticsArray.push({"name": el.full_name, "specialty": el.course, "age" : el.age,
    "gender" : el.gender, "nationality": el.country});
    statisticsFinalArrayToSort.push({"name": el.full_name, "specialty": el.course, "age" : el.age,
    "gender" : el.gender, "nationality": el.country});
  });

  if(finalStatisticsArray.length != 0) {
    totalCount = Math.ceil(finalStatisticsArray.length/10);
    while(currentStatisticsPage > totalCount)
    currentStatisticsPage--;
  }
  else{
  currentStatisticsPage = 1;
  totalCount = 1;
  }
  if(sortName)
  sortByName(true);
  if(sortSpecialty)
  sortBySpecialty(true);
  if(sortAge)
  sortByAge(true);
  if(sortGender)
  sortByGender(true);
  if(sortNationality)
  sortByNationality(true);
  setStatisticsData();
  currentDisplayedTeachersIndex = 0;
}

export function sortByName(addObject){
  sortSpecialty = false;
  sortAge = false;
  sortGender = false;
  sortNationality = false;
  let thFirst = document.getElementById("th-first");
  if(statisticsCurrentElementID != undefined && statisticsCurrentElementID != thFirst.id){
    let currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    let images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for(let i = 0; i < finalStatisticsArray.length; i++)
  statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thFirst.id;
  thFirst.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  let arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if(arrayimg[0].style.visibility == "visible"){
    if(arrayimg[0].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png")
    {
      if(!addObject){
      arrayimg[0].src = "arrowup.png";
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.name != undefined && b.name!= undefined){
        let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.name != undefined && b.name!= undefined){
        let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();
        
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }});
    }
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortName = true;
        }
      }
    }
    else{
      if(!addObject){
      arrayimg[0].style.visibility = "hidden";
      thFirst.style = "border-bottom: solid 0px  #000; background-color: white;";
      arrayimg[0].src = "arrowdown.png";
      for(let i = 0; i < 10; i++){
        if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
        sortName = false;
        }
      }
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.name != undefined && b.name!= undefined){
        let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortName = true;
        }
      }
    }
  }
  }
  else{
    if(!addObject){
    statisticsFinalArrayToSort.sort((a, b) => {
        arrayimg[0].style.visibility = "visible";
      if(a.name != undefined && b.name!= undefined){
      let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();
      
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    }});
    for(let i = 0; i < 10; i++){
      if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortName = true;
        }
    }
  }
  else{
    for(let i = 0; i < 10; i++){
      if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
      arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
      arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
      arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
      arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
      arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
      sortName = false;
      }
    }
  }
  }
}

export function sortBySpecialty(addObject){
  sortName = false;
  sortAge = false;
  sortGender = false;
  sortNationality = false;
  let thSecond = document.getElementById("th-second");
  if(statisticsCurrentElementID != undefined && statisticsCurrentElementID != thSecond.id){
    let currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    let images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for(let i = 0; i < finalStatisticsArray.length; i++)
  statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thSecond.id;
  thSecond.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  let arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if(arrayimg[1].style.visibility == "visible"){
    if(arrayimg[1].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png")
    {
      if(!addObject){
      arrayimg[1].src = "arrowup.png";
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.specialty != undefined && b.specialty != undefined){
        let fa = a.specialty.toLowerCase(),
        fb = b.specialty.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.specialty != undefined && b.specialty != undefined){
        let fa = a.specialty.toLowerCase(),
        fb = b.specialty.toLowerCase();
        
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }});
    }
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortSpecialty = true;
          }
      }
    }
    else{
      if(!addObject){
      arrayimg[1].style.visibility = "hidden";
      thSecond.style = "border-bottom: solid 0px  #000; background-color: white;";
      arrayimg[1].src = "arrowdown.png";
      for(let i = 0; i < 10; i++){
        if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
          sortSpecialty = false;
          }
      }
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.specialty != undefined && b.specialty != undefined){
        let fa = a.specialty.toLowerCase();
        fb = b.specialty.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});

      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortSpecialty = true;
          }
      }
    }
    }
  }
  else{
    if(!addObject){
      arrayimg[1].style.visibility = "visible";
    statisticsFinalArrayToSort.sort((a, b) => {
      if(a.specialty != undefined && b.specialty != undefined){
      let fa = a.specialty.toLowerCase(),
      fb = b.specialty.toLowerCase();
      
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
  }});
    for(let i = 0; i < 10; i++){
      if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortSpecialty = true;
        }
    }
  }
  else{
    for(let i = 0; i < 10; i++){
      if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
        sortSpecialty = false;
        }
    }
  }
  }
}

export function sortByAge(addObject){
  sortSpecialty = false;
  sortName = false;
  sortGender = false;
  sortNationality = false;
  let thThird = document.getElementById("th-third");
  if(statisticsCurrentElementID != undefined && statisticsCurrentElementID != thThird.id){
    let currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    let images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for(let i = 0; i < finalStatisticsArray.length; i++)
  statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thThird.id;
  thThird.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  let arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if(arrayimg[2].style.visibility == "visible"){
    if(arrayimg[2].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png")
    {
      if(!addObject){
      arrayimg[2].src = "arrowup.png";
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.age != undefined && b.age != undefined)
        return b.age - a.age;
      });
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.age != undefined && b.age != undefined)
        return a.age - b.age;
      });
    }
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortAge = true;
          }
      }
    }
    else{
      if(!addObject){
      arrayimg[2].style.visibility = "hidden";
      thThird.style = "border-bottom: solid 0px  #000; background-color: white;";
      arrayimg[2].src = "arrowdown.png";
      for(let i = 0; i < 10; i++){
        if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
          sortAge = false;
          }
        }
      }
      else{
        statisticsFinalArrayToSort.sort((a, b) => {
          if(a.age != undefined && b.age != undefined)
          return b.age - a.age;
        });
        for(let i = 0; i < 10; i++){
          if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
            arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
            arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
            sortAge = true;
            }
        }
      }
    }
  }
  else{
    if(!addObject){
    statisticsFinalArrayToSort.sort((a, b) => {
      if(a.age != undefined && b.age != undefined)
      return a.age - b.age;
    });
    for(let i = 0; i < 10; i++){
      if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortAge = true;
        }
    }
    arrayimg[2].style.visibility = "visible";
  }
  else{
    for(let i = 0; i < 10; i++){
      if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
        sortAge = false;
        }
      }
  }
  }
}

export function sortByGender(addObject){
  sortSpecialty = false;
  sortAge = false;
  sortName= false;
  sortNationality = false;
  let thFourth = document.getElementById("th-fourth");
  if(statisticsCurrentElementID != undefined && statisticsCurrentElementID != thFourth.id){
    let currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    let images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for(let i = 0; i < finalStatisticsArray.length; i++)
  statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thFourth.id;
  thFourth.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  let arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if(arrayimg[3].style.visibility == "visible"){
    if(arrayimg[3].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png")
    {
      if(!addObject){
      arrayimg[3].src = "arrowup.png";
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.gender != undefined && b.gender != undefined){
        let fa = a.gender.toLowerCase(),
        fb = b.gender.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.gender != undefined && b.gender != undefined){
        let fa = a.gender.toLowerCase(),
        fb = b.gender.toLowerCase();
        
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }});
    }
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
          }
      }
    }
    else{
      if(!addObject){
      arrayimg[3].style.visibility = "hidden";
      thFourth.style = "border-bottom: solid 0px  #000; background-color: white;";
      arrayimg[3].src = "arrowdown.png";
      for(let i = 0; i < 10; i++){
        if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = false;
          }
      }
    }
    else{
            statisticsFinalArrayToSort.sort((a, b) => {
        if(a.gender != undefined && b.gender != undefined){
        let fa = a.gender.toLowerCase(),
        fb = b.gender.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
          }
      }
    }
    }
  }
  else{
    if(!addObject){
    statisticsFinalArrayToSort.sort((a, b) => {
      if(a.gender != undefined && b.gender != undefined){
      let fa = a.gender.toLowerCase(),
      fb = b.gender.toLowerCase();
      
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    }});
    for(let i = 0; i < 10; i++){
      if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortGender = true;
        }
    }
    arrayimg[3].style.visibility = "visible";
  }
  else{
    for(let i = 0; i < 10; i++){
      if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
        sortGender = false;
        }
    }
  }
  }
}

export function sortByNationality(addObject){
  sortSpecialty = false;
  sortAge = false;
  sortGender = false;
  sortName = false;
  let thFifth = document.getElementById("th-fifth");
  if(statisticsCurrentElementID != undefined && statisticsCurrentElementID != thFifth.id){
    let currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    let images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for(let i = 0; i < finalStatisticsArray.length; i++)
  statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thFifth.id;
  thFifth.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  let arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if(arrayimg[4].style.visibility == "visible"){
    if(arrayimg[4].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png")
    {
      if(!addObject){
      arrayimg[4].src = "arrowup.png";
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.nationality != undefined && b.nationality != undefined){
        let fa = a.nationality.toLowerCase(),
        fb = b.nationality.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.nationality != undefined && b.nationality != undefined){
        let fa = a.nationality.toLowerCase(),
        fb = b.nationality.toLowerCase();
        
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }});
    }
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
          }
      }
    }
    else{
      if(!addObject){
      arrayimg[4].style.visibility = "hidden";
      thFifth.style = "border-bottom: solid 0px  #000; background-color: white;";
      arrayimg[4].src = "arrowdown.png";
      for(let i = 0; i < 10; i++){
        if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = false;
          }
      }
    }
    else{
      statisticsFinalArrayToSort.sort((a, b) => {
        if(a.nationality != undefined && b.nationality != undefined){
        let fa = a.nationality.toLowerCase(),
        fb = b.nationality.toLowerCase();
        
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      }});
      for(let i = 0; i < 10; i++){
        if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
          arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
          arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
          }
      }
    }
    }
  }
  else{
    if(!addObject){
    statisticsFinalArrayToSort.sort((a, b) => {
      if( a.nationality != undefined && b.nationality != undefined){
      let fa = a.nationality.toLowerCase(),
      fb = b.nationality.toLowerCase();
      
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    }});
    for(let i = 0; i < 10; i++){
      if(statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = statisticsFinalArrayToSort[i + (currentStatisticsPage - 1) * 10].nationality;
        sortGender = true;
        }
    }
    arrayimg[4].style.visibility = "visible";
  }
  else{
    for(let i = 0; i < 10; i++){
      if(finalStatisticsArray[i + (currentStatisticsPage - 1) * 10]!=undefined){
        arrayName[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].name;
        arraySpecialty[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].specialty;
        arrayAge[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].age;
        arrayGender[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].gender;
        arrayNationality[i].innerHTML = finalStatisticsArray[i + (currentStatisticsPage - 1) * 10].nationality;
        sortGender = false;
        }
    }
  }
  }
}

export function statisticsButton(elemID){
  let firstButton = document.getElementById("statistics-first-button");
  let secondButton = document.getElementById("statistics-second-button");
  let thirdButton = document.getElementById("statistics-third-button");
  let fourthButton = document.getElementById("statistics-fourth-button");
  let lastButton = document.getElementById("statistics-last-button");
  let pointsButton = document.getElementById("statistics-points");
  if(elemID == "statistics-first-button"){
    currentStatisticsPage = 1;
    secondButton.innerHTML = (currentStatisticsPage + 1).toString();
    thirdButton.innerHTML = (currentStatisticsPage + 2).toString();
    fourthButton.innerHTML = (currentStatisticsPage + 3).toString();
    lastButton.innerHTML = "Last";
    pointsButton.innerHTML = "...";
    pointsButton.style = "  color: black; background-color: white;";
    setStatisticsData();
  }
  else if(elemID == "statistics-second-button"){
    currentStatisticsPage = parseFloat(secondButton.innerHTML);
    if(currentStatisticsPage != 2 && currentStatisticsPage != 3)
    secondButton.innerHTML = (currentStatisticsPage + -1).toString();
    else
    secondButton.innerHTML = (2).toString();
    if(currentStatisticsPage != 2 && currentStatisticsPage != 3)
    thirdButton.innerHTML = (currentStatisticsPage).toString();
    else
    thirdButton.innerHTML = (3).toString();
    if(currentStatisticsPage != 2 && currentStatisticsPage != 3)
    fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
    else
    fourthButton.innerHTML = (4).toString();
    lastButton.innerHTML = "Last";
    pointsButton.innerHTML = "...";
    pointsButton.style = "  color: black; background-color: white;";
    setStatisticsData();
  }
  else if(elemID == "statistics-third-button"){
    currentStatisticsPage = parseFloat(thirdButton.innerHTML);
    if(currentStatisticsPage != 2 && currentStatisticsPage != 3)
    secondButton.innerHTML = (currentStatisticsPage + -1).toString();
    else
    secondButton.innerHTML = (2).toString();
    if(currentStatisticsPage != 2 && currentStatisticsPage != 3)
    thirdButton.innerHTML = (currentStatisticsPage).toString();
    else
    thirdButton.innerHTML = (3).toString();
    if(currentStatisticsPage != 2 && currentStatisticsPage != 3)
    fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
    setStatisticsData();
  }
  else if(elemID == "statistics-fourth-button"){
    currentStatisticsPage = parseFloat(fourthButton.innerHTML);
    if(totalCount > 5){
    if(currentStatisticsPage <= totalCount - 2){
      if(currentStatisticsPage != 2 && currentStatisticsPage != 3){
      secondButton.innerHTML = (currentStatisticsPage - 1).toString();
      thirdButton.innerHTML = (currentStatisticsPage).toString();
      fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
      }
      else
      secondButton.innerHTML = (2).toString();
      if(currentStatisticsPage >= totalCount - 2) {
        pointsButton.innerHTML = totalCount.toString();
        lastButton.innerHTML = "";
        pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
      }
      setStatisticsData();
    }
    else if (currentStatisticsPage < totalCount - 1){
      secondButton.innerHTML = (currentStatisticsPage - 1).toString();
      thirdButton.innerHTML = (currentStatisticsPage).toString();
      fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
      pointsButton.innerHTML = totalCount.toString();
      lastButton.innerHTML = "";
      pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
      setStatisticsData();
    }
  }
  else{
    secondButton.innerHTML = (currentStatisticsPage - 2).toString();
    thirdButton.innerHTML = (currentStatisticsPage - 1).toString();
    fourthButton.innerHTML = (currentStatisticsPage).toString();
    pointsButton.innerHTML = (currentStatisticsPage + 1).toString();
    lastButton.innerHTML = "";
    pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
    setStatisticsData();
  }
  }
  else if(elemID == "statistics-last-button" || elemID == "statistics-points"){
    currentStatisticsPage = totalCount;
    pointsButton.innerHTML = totalCount.toString();
    fourthButton.innerHTML = (totalCount-1).toString();
    thirdButton.innerHTML = (totalCount-2).toString();
    secondButton.innerHTML = (totalCount-3).toString();
    lastButton.innerHTML = "";
    pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
    setStatisticsData();
  }
}

function checkStatisticsButton(){
  let firstButton = document.getElementById("statistics-first-button");
  let secondButton = document.getElementById("statistics-second-button");
  let thirdButton = document.getElementById("statistics-third-button");
  let fourthButton = document.getElementById("statistics-fourth-button");
  let lastButton = document.getElementById("statistics-last-button");
  let pointsButton = document.getElementById("statistics-points");
  if(totalCount == 1){
    secondButton.innerHTML = "";
    thirdButton.innerHTML = "";
    fourthButton.innerHTML = "";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  }
  else if(totalCount == 2){
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "";
    fourthButton.innerHTML = "";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  }
  else if(totalCount == 3){
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "3";
    fourthButton.innerHTML = "";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  }
  else if(totalCount == 4){
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "3";
    fourthButton.innerHTML = "4";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  }
  else if(totalCount == 5){
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "3";
    fourthButton.innerHTML = "4";
    pointsButton.innerHTML = "5";
    lastButton.innerHTML = "";
    pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
  }
  else if(totalCount > 5 && currentStatisticsPage == totalCount - 1){
    secondButton.innerHTML = (totalCount - 3).toString();
    thirdButton.innerHTML = (totalCount - 2).toString();
    fourthButton.innerHTML = (totalCount - 1).toString();
    pointsButton.innerHTML =  (totalCount).toString();
    lastButton.innerHTML = "";
  }
}

function setStatisticsData(){
  let lastIndex = -1;
  let arrayName = Array.from(document.getElementsByName('td-name'));
  let arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  let arrayAge = Array.from(document.getElementsByName('td-age'));
  let arrayGender = Array.from(document.getElementsByName('td-gender'));
  let arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if(statisticsFinalArrayToSort.length == 0)
    lastIndex = 0;  
  for(let i = (currentStatisticsPage - 1) * 10; i < statisticsFinalArrayToSort.length && i < currentStatisticsPage * 10; i++){
    if( i == statisticsFinalArrayToSort.length - 1)
      lastIndex = i - (currentStatisticsPage - 1) * 10 + 1;
    arrayName[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].name;
    arraySpecialty[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].specialty;
    arrayAge[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].age;
    arrayGender[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].gender;
    arrayNationality[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].nationality;
  }
  if(lastIndex!=-1){
    for(let i = lastIndex; i < arrayName.length; i++){
      arrayName[i].innerHTML = "";
      arraySpecialty[i].innerHTML = "";
      arrayAge[i].innerHTML = "";
      arrayGender[i].innerHTML = "";
      arrayNationality[i].innerHTML = "";
    }
  }
  checkStatisticsButton();
}

export function searchOnChange(){
  finalSearchArray = [];
  let teacherSearch = document.getElementById("teacher-search");
  if(teacherSearch.value){
  isSearching = true;
  let i = 0;
  let firstWord = "";
  let secondWord = "";
  let thirdWord = "";
  for(; i < teacherSearch.value.length; i++){
    if(teacherSearch.value[i] != ',' && teacherSearch.value[i] != '.' && teacherSearch.value[i] != ' ')
      firstWord+=teacherSearch.value[i];
    else{
      i++
      while(teacherSearch.value[i] == ',' || teacherSearch.value[i] == '.' || teacherSearch.value[i] == ' ')
      i++
      break;
    }
  }
  for(; i < teacherSearch.value.length; i++){
    if(teacherSearch.value[i] != ',' && teacherSearch.value[i] != '.' && teacherSearch.value[i] != ' ')
      secondWord+=teacherSearch.value[i];
      else{
        i++
        while(teacherSearch.value[i] == ',' || teacherSearch.value[i] == '.' || teacherSearch.value[i] == ' ')
        i++
        break;
      }
  }
  for(; i < teacherSearch.value.length; i++){
    if(teacherSearch.value[i] != ',' && teacherSearch.value[i] != '.' && teacherSearch.value[i] != ' ')
      thirdWord+=teacherSearch.value[i];
      else{
        i++
        while(teacherSearch.value[i] == ',' || teacherSearch.value[i] == '.' || teacherSearch.value[i] == ' ')
        i++
        break;
      }
  }
    let ageValue = 0;
    if(isNumeric(firstWord)){
    ageValue = parseInt(firstWord);
    searchOnChangeFilterWithAge(ageValue, secondWord, thirdWord);
    }
    else if(isNumeric(secondWord)){
    ageValue = parseInt(secondWord);
    searchOnChangeFilterWithAge(ageValue, firstWord, thirdWord);
    }
    else if(isNumeric(thirdWord)){
    ageValue = parseInt(thirdWord);
    searchOnChangeFilterWithAge(ageValue, firstWord, secondWord);
    }
    else{
      for(let i = 0; i < randomUserApiMock.length; i++){
        if(randomUserApiMock[i].full_name!=undefined && randomUserApiMock[i].note != undefined){
          let firstWordIsOk = false;
          let secondWordIsOk = false;
          let thirdWordIsOk = false;
        if(firstWord != "")
          if(randomUserApiMock[i].full_name.toLowerCase().includes(firstWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(firstWord.toLowerCase()) || randomUserApiMock[i].full_name.includes(firstWord) || randomUserApiMock[i].note.includes(firstWord))
            firstWordIsOk = true;
          if(secondWord != "")
            if(randomUserApiMock[i].full_name.toLowerCase().includes(secondWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(secondWord.toLowerCase()) || randomUserApiMock[i].full_name.includes(secondWord) || randomUserApiMock[i].note.includes(secondWord))
              secondWordIsOk = true;
          if(thirdWord != "")
            if(randomUserApiMock[i].full_name.toLowerCase().includes(thirdWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(thirdWord.toLowerCase()) || randomUserApiMock[i].full_name.includes(thirdWord) || randomUserApiMock[i].note.includes(thirdWord))
              thirdWordIsOk = true;
        if(firstWordIsOk || secondWordIsOk || thirdWordIsOk)
          finalSearchArray.push(randomUserApiMock[i]);
        }
        for(let i = 0; i < finalSearchArray.length; i++)
          if(finalSearchArray[i].full_name == undefined)
            finalSearchArray.splice(i, 1);
      }
    }
  }
  else{
  isSearching = false;
  for(let c = 0; c < randomUserApiMock.length; c++)
  finalSearchArray.push(randomUserApiMock[c]);
  onFilterChange();
  } 
  finalStatisticsArray = [];
  statisticsFinalArrayToSort = [];
  finalSearchArray.forEach(el => {
    finalStatisticsArray.push({"name": el.full_name, "specialty": el.course, "age" : el.age,
    "gender" : el.gender, "nationality": el.country});
    statisticsFinalArrayToSort.push({"name": el.full_name, "specialty": el.course, "age" : el.age,
    "gender" : el.gender, "nationality": el.country});
  });
  if(finalStatisticsArray.length != 0) {
    totalCount = Math.ceil(finalStatisticsArray.length/10);
    while(currentStatisticsPage > totalCount)
    currentStatisticsPage--;
  }
  else{
  currentStatisticsPage = 1;
  totalCount = 1;
  }
  if(sortName)
  sortByName(true);
  if(sortSpecialty)
  sortBySpecialty(true);
  if(sortAge)
  sortByAge(true);
  if(sortGender)
  sortByGender(true);
  if(sortNationality)
  sortByNationality(true);
  setStatisticsData();
  onFilterChange();
}
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function searchOnChangeFilterWithAge(ageWord, firstWord, secondWord){
  for(let i = 0; i < randomUserApiMock.length; i++){
    let firstWordIsOk = false;
    let secondWordIsOk = false;
    if(randomUserApiMock[i].age == ageWord){
  if(firstWord != "")
    if(randomUserApiMock[i].full_name.toLowerCase().includes(firstWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(firstWord) || randomUserApiMock[i].full_name.includes(firstWord) || randomUserApiMock[i].note.includes(firstWord))
      firstWordIsOk = true;
    if(secondWord != "")
      if(randomUserApiMock[i].full_name.toLowerCase().includes(secondWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(secondWord) || randomUserApiMock[i].full_name.includes(secondWord) || randomUserApiMock[i].note.includes(secondWord))
        secondWordIsOk = true;
  if(firstWordIsOk || secondWordIsOk || randomUserApiMock[i].age == ageWord)
    finalSearchArray.push(randomUserApiMock[i]);
    }
  }
  for(let i = 0; i < finalSearchArray.length; i++)
    if(finalSearchArray[i].full_name == undefined)
      finalSearchArray.splice(i, 1);
  onFilterChange();
}

export function addNewTeacher(){
  let addTeacherName = document.getElementById("add-teacher-name");
  let addTeacherSpecialty = document.getElementById("add-teacher-specialty");
  let addTeacherCountry = document.getElementById("add-teacher-country");
  let addTeacherCity = document.getElementById("add-teacher-city");
  let addTeacherEmail = document.getElementById("add-teacher-email");
  let addTeacherPhone = document.getElementById("add-teacher-phone");
  let addTeacherDate = document.getElementById("add-teacher-birthday");
  let addTeacherSex = Array.from(document.getElementsByName("add-teacher-sex"));
  let addTeacherColor= document.getElementById("add-teacher-color");
  let addTeacherNotes = document.getElementById("add-teacher-notes");
  let numberValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  let emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  let Validated = true;

  let sexValue;

  for(let i = 0; i < addTeacherSex.length; i++)
    if(addTeacherSex[i].checked){
    sexValue = addTeacherSex[i].value;
    break;
    }

  let newObject = [{"full_name": addTeacherName.value, "course": addTeacherSpecialty.value, "country": addTeacherCountry.value,"city": addTeacherCity.value,
  "email": addTeacherEmail.value,"phone": addTeacherPhone.value, "b_date": addTeacherDate.value, "gender": sexValue, "bg_color": addTeacherColor.value, "note": addTeacherNotes.value}];


  if(newObject[0].full_name != "")
  Validated = newObject.every(obj => typeof obj.full_name === 'string' && obj.full_name[0] === obj.full_name[0].toUpperCase());
  else
  Validated = false;
  if(newObject[0].city != "")
  Validated = newObject.every(obj => typeof obj.city === 'string' && obj.city[0] === obj.city[0].toUpperCase());
  else
  Validated = false;
  Validated = newObject.every(obj => numberValidation.test(obj.phone));
  Validated = newObject.every(obj => emailValidation.test(obj.email));
  if(newObject[0].gender == "" || newObject[0].gender == undefined)
  Validated = false;
  if(newObject[0].b_date == "")
  Validated = false;

  let randomPicture = "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random()) * 200 + ".jpg";

  if(getAge(addTeacherDate.value) < 4)
  Validated = false;

  let finalObject =   {
    "gender": sexValue,
    "title": "",
    "full_name": newObject[0].full_name,
    "city": newObject[0].city,
    "country": newObject[0].country,
    "postcode": "",
    "coordinates": { "latitude": "", "longitude": "" },
    "timezone": { "offset": "", "description": "" },
    "b_day": newObject[0].b_date,
    "age": getAge(addTeacherDate.value),
    "id": makeid(10),
    "picture_large": randomPicture,
    "favorite": "",
    "course": newObject[0].course,
    "bg_color": newObject[0].bg_color,
    "note": newObject[0].note,
    }
  if(Validated){
    randomUserApiMock.push(finalObject);
    if(sortName)
    sortByName(true);
    if(sortSpecialty)
    sortBySpecialty(true);
    if(sortAge)
    sortByAge(true);
    if(sortGender)
    sortByGender(true);
    if(sortNationality)
    sortByNationality(true);
    searchOnChange();
    onFilterChange();

    const axios = require('axios');

    axios.post('http://localhost:3000/users', {
      "gender": sexValue,
      "title": "",
      "full_name": newObject[0].full_name,
      "city": newObject[0].city,
      "country": newObject[0].country,
      "postcode": "",
      "coordinates": { "latitude": "", "longitude": "" },
      "timezone": { "offset": "", "description": "" },
      "b_day": newObject[0].b_date,
      "age": getAge(addTeacherDate.value),
      "id": makeid(10),
      "picture_large": randomPicture,
      "favorite": "",
      "course": newObject[0].course,
      "bg_color": newObject[0].bg_color,
      "note": newObject[0].note,
    }).then(resp => {
        console.log(resp.data);
    }).catch(error => {
        console.log(error);
    });
  }
  else
  alert("Incorrect info!");
}

function validateObjects(){
  let Validated = true;
  let numberValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  let emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  Validated = randomUserApiMock.every(obj => typeof obj.full_name === 'string' && obj.full_name[0] === obj.full_name[0].toUpperCase());
  Validated = randomUserApiMock.every(obj => typeof obj.gender === 'string' && obj.gender[0] === obj.gender[0].toUpperCase());
  Validated = randomUserApiMock.every(obj => typeof obj.note === 'string' && obj.note[0] === obj.note[0].toUpperCase());
  Validated = randomUserApiMock.every(obj => typeof obj.state === 'string' && obj.state[0] === obj.state[0].toUpperCase());
  Validated = randomUserApiMock.every(obj => typeof obj.city === 'string' && obj.city[0] === obj.city[0].toUpperCase());
  Validated = randomUserApiMock.every(obj => typeof obj.country === 'string' && obj.country[0] === obj.country[0].toUpperCase());
  Validated = randomUserApiMock.every(obj => typeof obj.age === 'number');
  Validated = randomUserApiMock.every(obj => numberValidation.test(obj.phone));
  Validated = randomUserApiMock.every(obj => emailValidation.test(obj.email));
  
  return Validated;
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function makeCourse() {
  let randomNumber = Math.random() * 3;
  if(randomNumber >= 0 && randomNumber < 1)
    return "Math";
  else if(randomNumber >= 1 && randomNumber < 2)
    return "Chemistry";
  else if(randomNumber >= 2 && randomNumber < 3)
    return "Art";
  else if(randomNumber == 3)
    return "English";

}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

async function getUsers() {
  let returnArray = [];
  await fetch("https://randomuser.me/api/?results=50")
    .then((results) => {
      return results.json();
    })
    .then((data) => {
      for(let i = 0; i < data.results.length; i++){
              let newObject = {
        "gender": "",
        "title": "",
        "full_name": "",
        "city": "",
        "state": "",
        "country": "",
        "postcode": 1,
        "coordinates": { "latitude": "", "longitude": "" },
        "timezone": { "offset": "",  "description": "", },
        "email": "",
        "b_date": "",
        "age": 46,
        "phone": "",
        "picture_large": "",
        "picture_thumbnail": "",
        "id": "",
        "favorite": "",
        "course": "",
        "bg_color": "",
        "note": "",
      };
        newObject.gender = data.results[i].gender;
        newObject.title = data.results[i].name.title;
        newObject.full_name = data.results[i].name.first + " " + data.results[i].name.last;
        newObject.city = data.results[i].location.city;
        newObject.state = data.results[i].location.state;
        newObject.country = data.results[i].location.country;
        newObject.postcode = data.results[i].location.postcode;
        newObject.coordinates = data.results[i].location.coordinates;
        newObject.timezone = data.results[i].location.timezone;
        newObject.email = data.results[i].email;
        newObject.b_date = data.results[i].dob.date;
        newObject.age = data.results[i].dob.age;
        newObject.phone = data.results[i].phone;
        newObject.picture_large = data.results[i].picture.large;
        newObject.picture_thumbnail = data.results[i].picture.thumbnail;
        newObject.id = data.results[i].id.name + data.results[i].id.value + makeid(10);
        newObject.favorite = makeid(10);
        newObject.course = makeCourse().toString();
        newObject.bg_color = Math.floor(Math.random()*16777215).toString(16);
        newObject.note = "hello";
        returnArray.push(newObject);
      }
    });
    return returnArray;
}

