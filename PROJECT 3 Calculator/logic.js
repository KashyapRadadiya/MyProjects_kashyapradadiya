
let dis = document.getElementById("display");

let parant = document.querySelector("#btns");

parant.addEventListener("click",docal);

function docal(val){
    let store = val.target.value;

    if(store == "AC"){
        dis.value = '';
    }
    else if(store == "="){
        dis.value = eval(dis.value);
    }
    else{
        dis.value += store;
    }
    
}