const API_URL =
"https://6a066939c83ba8ad9b3d7102.mockapi.io/api/v1/workouts";

let workouts = [];

/* GET ELEMENT */

function getEl(id){

    return document.getElementById(id);

}

/* LOAD DATA */

async function loadWorkouts(){

    try{

        const response =
        await fetch(API_URL);

        workouts =
        await response.json();

        renderAll();

    }
    catch(error){

        console.log(error);

    }

}

/* ADD WORKOUT */

async function addWorkout(){

    const name =
    getEl("workoutName").value.trim();

    const calories =
    getEl("calories").value;

    const minutes =
    getEl("minutes").value;

    const date =
    getEl("date").value;

    const imageInput =
    getEl("imageUpload");

    if(
        !name ||
        !calories ||
        !minutes ||
        !date
    ){

        alert("Vui lòng nhập đầy đủ thông tin");

        return;

    }

    let imageUrl = "";

    /* IMAGE */

    if(imageInput.files[0]){

        const reader =
        new FileReader();

        reader.onload = async function(e){

            imageUrl =
            e.target.result;

            await saveWorkout(imageUrl);

        };

        reader.readAsDataURL(
            imageInput.files[0]
        );

    }else{

        await saveWorkout("");

    }

    async function saveWorkout(image){

        const workout = {

            name:name,

            calories:Number(calories),

            minutes:Number(minutes),

            date:date,

            image:image

        };

        try{

            await fetch(API_URL,{

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify(workout)

            });

            clearForm();

            loadWorkouts();

        }
        catch(error){

            console.log(error);

        }

    }

}

/* CLEAR FORM */

function clearForm(){

    if(getEl("workoutName"))
    getEl("workoutName").value="";

    if(getEl("calories"))
    getEl("calories").value="";

    if(getEl("minutes"))
    getEl("minutes").value="";

    if(getEl("date"))
    getEl("date").value="";

    if(getEl("imageUpload"))
    getEl("imageUpload").value="";

}

function sendContact(){
    const name = getEl("contactName").value.trim();
    const email = getEl("contactEmail").value.trim();
    const message = getEl("contactMessage").value.trim();

    if(!name || !email || !message){
        alert("Vui lòng nhập đầy đủ thông tin liên hệ");
        return;
    }

    alert("Bạn đã liên hệ thành công");

    getEl("contactName").value = "";
    getEl("contactEmail").value = "";
    getEl("contactMessage").value = "";
}

/* DELETE */

async function deleteWorkout(id){

    try{

        await fetch(`${API_URL}/${id}`,{

            method:"DELETE"

        });

        loadWorkouts();

    }
    catch(error){

        console.log(error);

    }

}

async function editWorkout(id){
    const workout = workouts.find(item => item.id === id);
    if(!workout) return;

    const name = prompt("Nhập tên mới:", workout.name);
    if(name === null) return;

    const calories = prompt("Nhập calories mới:", workout.calories);
    if(calories === null) return;

    const minutes = prompt("Nhập thời gian mới (phút):", workout.minutes);
    if(minutes === null) return;

    const date = prompt("Nhập ngày mới (YYYY-MM-DD):", workout.date);
    if(date === null) return;

    try{
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name: name.trim() || workout.name,
                calories: Number(calories) || workout.calories,
                minutes: Number(minutes) || workout.minutes,
                date: date.trim() || workout.date,
                image: workout.image || ""
            })
        });

        loadWorkouts();
    }
    catch(error){
        console.log(error);
    }
}

/* DASHBOARD */

function renderDashboard(){

    const list =
    getEl("list");

    if(!list) return;

    list.innerHTML="";

    const reverse =
    [...workouts].reverse();

    reverse.forEach(workout=>{

        list.innerHTML += `

        <div class="workoutItem">

            <div class="workoutInfo">

                <h3>${workout.name}</h3>

                <p>
                    Calories:
                    ${workout.calories}
                </p>

                <p>
                    Thời gian:
                    ${workout.minutes} phút
                </p>

                <p>
                    Ngày:
                    ${workout.date}
                </p>

                ${
                    workout.image
                    ?
                    `
                    <img src="${workout.image}">
                    `
                    :
                    ""
                }

            </div>

            <button
            class="deleteBtn"
            onclick="deleteWorkout('${workout.id}')">

                Xóa

            </button>

        </div>

        `;

    });

}

/* STATS */

function updateStats(){

    const totalWorkout =
    getEl("totalWorkout");

    const totalCalories =
    getEl("totalCalories");

    const totalMinutes =
    getEl("totalMinutes");

    const adminWorkout =
    getEl("adminTotalWorkout");

    const adminCalories =
    getEl("adminCalories");

    const calories =
    workouts.reduce(
        (sum,item)=>
        sum + Number(item.calories),
        0
    );

    const minutes =
    workouts.reduce(
        (sum,item)=>
        sum + Number(item.minutes),
        0
    );

    if(totalWorkout)
    totalWorkout.innerText =
    workouts.length;

    if(totalCalories)
    totalCalories.innerText =
    calories;

    if(totalMinutes)
    totalMinutes.innerText =
    minutes;

    if(adminWorkout)
    adminWorkout.innerText =
    workouts.length;

    if(adminCalories)
    adminCalories.innerText =
    calories;

}

/* HISTORY */

function renderHistory(){

    const container =
    getEl("historyContainer");

    if(!container) return;

    container.innerHTML="";

    const reverse =
    [...workouts].reverse();

    reverse.forEach(workout=>{

        container.innerHTML += `

        <div class="historyCard">

            <img
            src="${
                workout.image ||
                'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop'
            }">

            <h2>${workout.name}</h2>

            <p>
                Calories:
                ${workout.calories}
            </p>

            <p>
                Thời gian:
                ${workout.minutes} phút
            </p>

            <p>
                Ngày:
                ${workout.date}
            </p>

        </div>

        `;

    });

}

/* SEARCH */

function searchWorkout(){

    const value =
    getEl("searchInput")
    .value
    .toLowerCase();

    const cards =
    document.querySelectorAll(
        ".historyCard"
    );

    cards.forEach(card=>{

        const text =
        card.innerText.toLowerCase();

        if(text.includes(value)){

            card.style.display="block";

        }
        else{

            card.style.display="none";

        }

    });

}

/* ADMIN TABLE */

function renderAdminTable(){

    const body =
    getEl("adminBody");

    if(!body) return;

    body.innerHTML="";

    const reverse =
    [...workouts].reverse();

    reverse.forEach(workout=>{

        body.innerHTML += `

        <tr>

            <td>${workout.name}</td>

            <td>${workout.calories}</td>

            <td>${workout.minutes} phút</td>

            <td>${workout.date}</td>

            <td>

                <button
                class="editBtn"
                onclick="editWorkout('${workout.id}')">

                    Sửa

                </button>

            </td>

            <td>

                <button
                onclick="deleteWorkout('${workout.id}')">

                    Xóa

                </button>

            </td>

        </tr>

        `;

    });

}

/* CHART */

let chart;

function renderChart(){

    const canvas =
    getEl("workoutChart");

    if(!canvas) return;

    const ctx =
    canvas.getContext("2d");

    const labels =
    workouts.map(item=>item.name);

    const data =
    workouts.map(item=>item.calories);

    if(chart){

        chart.destroy();

    }

    chart =
    new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Calories",

                data:data,

                backgroundColor:"#ffb400",

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/* BMI */

function calculateBMI(){

    const height =
    Number(getEl("height").value);

    const weight =
    Number(getEl("weight").value);

    const result =
    getEl("bmiResult");

    if(!height || !weight){

        result.innerText =
        "Vui lòng nhập dữ liệu";

        return;

    }

    const bmi =
    weight /
    ((height/100)*(height/100));

    let status="";

    if(bmi < 18.5){

        status="Gầy";

    }
    else if(bmi < 25){

        status="Bình thường";

    }
    else if(bmi < 30){

        status="Thừa cân";

    }
    else{

        status="Béo phì";

    }

    result.innerText =
    `BMI: ${bmi.toFixed(1)} (${status})`;

}

/* RENDER ALL */

function renderAll(){

    renderDashboard();

    renderHistory();

    renderAdminTable();

    updateStats();

    renderChart();

}

/* LOAD */

window.addEventListener(
    "DOMContentLoaded",
    ()=>{

        loadWorkouts();

    }
);