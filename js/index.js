//          firebase前処理

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove,onChildRemoved } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
const firebaseConfig = {
        
};        // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app); //RealtimeDBに接続
var dbRef = ref(db,"location"); //RealtimeDB内の"chat"を使う

    
//          変数
var watchID
var lat=[]
var lon=[]
var lkey=[];
var ylon
var ylat
var map;
var darr=[]
let i=0;
let j=0;


 
//          関数
//開いた時の位置情報取得
function opensite(position){
    ylat = position.coords.latitude;
    ylon = position.coords.longitude;
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
    let pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), { color: 'red' });
    pushpin.geometry.x=ylon
    pushpin.geometry.y=ylat
    map.entities.push(pushpin);
}
//位置情報の取得に成功した時の処理
function mapsInit(position) {
    //lat=緯度、lon=経度 を取得
    ylat = position.coords.latitude;
    ylon = position.coords.longitude;
    $("#map").html("緯度"+ylat+", "+"経度"+ylon);
    console.log(ylat,ylon)
    for(let i in lat){
        if(ylat==lat[i]&&ylon==lon[i]){
            if(dayrel(lkey[i])){
                localStorage.setItem(lkey[i-1],arr_script(darr))
                console.log("check")
                localStorage.setItem("coin",Number(localStorage.getItem("coin"))+100)
            }
            console.log("クリア")
            break
        }
    }

//     const msg = {
//         lat:lat,
//         lon:lon,
//     }
//     const newPostRef = push(dbRef); //ユニークKEYを生成
//     const db1Ref =ref(db,"try/2")
//     set(newPostRef, msg);           //"chat"にユニークKEYをつけてオブジェクトデータを登録
//     console.log("send")
    
}
//位置情報の取得に失敗したときの処理
function mapsError(){
    alert("位置情報の取得に失敗")
}
//日時比較
function dayrel(ymdhms=2,diff=1,key){
    let script=localStorage.getItem(key)

    let date=new Date()   
    darr[0]=date.getFullYear();
    darr[1]=date.getMonth()
    darr[2]=date.getDate();
    darr[3]=date.getHours();
    darr[4]=date.getMinutes();
    darr[5]=date.getSeconds();
    let bool;
    if(script==null){
        bool=true
        localStorage.setItem(key,arr_script(darr))
    }else{
        let arr = script_arr(script)

        if(arr[0]!=undefined){
        for(let i in darr){
            arr[i]=darr[i]-arr[i]
            if(i<ymdhms){
            if(arr[i]>0){
                bool=true;
                break;
            }
            }else if(i==ymdhms){
            if(arr[i]<diff){
                bool=false;
                break;
            }else if(arr[i]>diff){
                bool=true;
                break;
            }
            }else{
            if(arr[i]<0){
                bool=false;
                break;
            }else if(arr[i]>0){
                bool=true;
                break;
            }
            }
        }
        console.log(arr)
        return bool;
        }
        alert("dayrelerror")
    }
}
//配列の文字列化
function arr_script(arr){
  let string = "";
  for(i in arr){
    string+=arr[i]+"/"
  }
  // console.log(string)
  return string;
}
//文字列の配列化
function script_arr(script){
  let arr=[]
  arr=script.split("/")
  // for(i in arr){
  //   console.log(arr[i])
  // }
  return arr;
}

//          開いた時の処理
//現在地の赤ピン
navigator.geolocation.getCurrentPosition(opensite, mapsError);
//目標地点の青ピン
i=0
j=0
onChildAdded(dbRef, function(data){  
    
    let loc  = data.val();    //オブジェクトデータを取得し、変数msgに代入
    lat[j]=loc.lat
    lon[j]=loc.lon
    lkey[j]=data.key
    let pushpin
    if(dayrel(lkey[j])){
        pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), {icon:"img/coin1.PNG"});
    }else{
        pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), { color: 'blue' });
    }
    pushpin.geometry.x=lon[j]
    pushpin.geometry.y=lat[j]
    map.entities.push(pushpin);
    console.log(lkey[j])
    console.log(j)

    i++

})
//ローカルストレージ初期化
if(localStorage.getItem("coin")==null){
    localStorage.setItem("coin",0)
    console.log("reset")
}
console.log(localStorage.getItem(lkey[1]))






//          反応
watchID= navigator.geolocation.watchPosition(mapsInit, mapsError)
$("#myMap").on("click",function(){
})
