const colorPickerBtn = document.querySelector('#color-picker');
const listBox = document.querySelector('.picked-colors');
const colorList = document.querySelector('.all-colors');
const clearAll = document.querySelector('.clear-all');
const pickedColors = JSON.parse(localStorage.getItem('picked-colors') || "[]");

const copyColor = elem => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "Copied";
  setTimeout(() => elem.innerText = elem.dataset.color, 1000);
}

const showColors = () => {
  colorList.innerHTML = pickedColors.map( color => `
      <li class="color">
        <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
        <span class="value" data-color="${color}">${color}</span>
      </li>
  `).join("");
  listBox.classList.remove('hide');

  colorList.querySelectorAll('.color').forEach( li => {
    li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild));
  })
}

const activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      const eyeDropper = new EyeDropper();
      const {sRGBHex} = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);
  
      if(pickedColors.includes(sRGBHex)) return;
        
      pickedColors.push(sRGBHex);
      localStorage.setItem('picked-colors', JSON.stringify(pickedColors));
      showColors();
      
    } catch(error) {
      console.log(error);
    }
    document.body.style.display = "block";
  }, 10);
}

const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem('picked-colors', JSON.stringify(pickedColors));
  listBox.classList.add('hide');
}

if(pickedColors.length > 0) {
  showColors();
}

colorPickerBtn.addEventListener('click', activateEyeDropper);
clearAll.addEventListener('click', clearAllColors);