var datetimenow = "";
var getAgain;
var dispLang ="";
var isAllOpLoaded = false;
var checkInterval;
var cookieStops = [];
var allRouteData = [];
var BravoDay = new Date(1688137200000);
var Today = new Date();
var isBravoDay = Today>BravoDay? true: false;
var messages = {
    "Busse-de": "Busse",
    "Busse-en": "Buses",
    "Busse-ch": "巴士",
    "Busse-ja": "バス",
    "Haltestellen-de": "Haltestellen",
    "Haltestellen-en": "Stops",
    "Haltestellen-ch": "巴士站",
    "Haltestellen-ja": "バス停",
    "Haltestellenliste-de": "Haltestellenliste",
    "Haltestellenliste-en": "Stops List",
    "Haltestellenliste-ch": "巴士站表",
    "Haltestellenliste-ja": "バス停リスト",
    "Linien-de": "Linien",
    "Linien-en" : "Routes",
    "Linien-ch" : "路線",
    "Linien-ja" : "路線",
    "Suche-en" : "Search",
    "Suche-ch" : "搜尋",
    "Suche-ja" : "番号検索",
    "loading-de": "Lädt...",
    "loading-en": "Loading...",
    "loading-ch": "載入中...",
    "loading-ja": "読み込み中...",
    
    "Min-de": "Min.",
    "Min-en": "min",
    "Min-ch": "分鐘",
    "Min-ja": "分",
    "Min-A-de": "Min.",
    "Min-A-en": "min",
    "Min-A-ch": "分鐘",
    "Min-A-ja": "分で",
    "Min-B-de": "Min",
    "Min-B-en": "min",
    "Min-B-ch": "分鐘",
    "Min-B-ja": "分",
    "Std-de": "Std.",
    "Std-en": "hour",
    "Std-ch": "小時",
    "Std-ja": "時間",

    "Arr-de": "Angek.",
    "Arr-en": "Arr.",
    "Arr-ch": "到達",
    "Arr-ja": "到着します",

    "Nodata-de": "Keine Daten",
    "Nodata-en": "No data",
    "Nodata-ch": "無資料",
    "Nodata-ja": "データなし",

    "weg-de": "Weg",
    "weg-en": "Left",
    "weg-ch": "已離開",
    "weg-ja": "発車した",

    "Zeit-de": "Zeit",
    "Zeit-en": "Time",
    "Zeit-ch": "時間",
    "Zeit-ja": "時刻",

    "Ziel-de": "Ziel",
    "Ziel-en": "Destination",
    "Ziel-ch": "目的地",
    "Ziel-ja": "目的地",

    "Linie-de": "Linie",
    "Linie-en": "Route",
    "Linie-ch": "路線",
    "Linie-ja": "系統",
    "Abfahrt-de": "Abfahrt in",
    "Abfahrt-en": "Depart in",
    "Abfahrt-ch": "等候時間",
    "Abfahrt-ja": "発車",

    "confirmDelGroup-de": "Möchten Sie diese Haltestelle wirklich löschen?",
    "confirmDelGroup-en": "Do you really want to delete this stop?",
    "confirmDelGroup-ch": "確認刪除此站？",
    "confirmDelGroup-ja": "このバス停を削除しますか?",
    "renameGroup-de": "Haltestelle umbenennen:",
    "renameGroup-en": "Rename Stop:",
    "renameGroup-ch": "重新命名此站:",
    "renameGroup-ja": "バス停名変更:",
    "Ja-de": "Ja",
    "Ja-en": "Yes",
    "Ja-ch": "是",
    "Ja-ja": "はい",
    "Nein-de": "Nein",
    "Nein-en": "No",
    "Nein-ch": "否",
    "Nein-ja": "いいえ",
    "Confirm-de": "Bestätigen",
    "Confirm-en": "Confirm",
    "Confirm-ch": "確認",
    "Confirm-ja": "確認する",
    "Cancel-de": "Abbrechen",
    "Cancel-en": "Cancel",
    "Cancel-ch": "取消",
    "Cancel-ja": "キャンセル",

    "Route-de": "Route",
    "Route-en": "Route",
    "Route-ch": "路線",
    "Route-ja": "ルート",

    "Gruppehzfg-de": "Als neu zur Haltestelleliste hinzufügen",
    "Gruppehzfg-en": "Add to stop list as new",
    "Gruppehzfg-ch": "加入巴士站表",
    "Gruppehzfg-ja": "バス停リストに追加",
    "Gruppehzfg2-de": "Zu einer bestehenden Haltestelle der Liste hinzufügen",
    "Gruppehzfg2-en": "Add to an existing stop into stop list",
    "Gruppehzfg2-ch": "加入巴士站表內車站",
    "Gruppehzfg2-ja": "リスト既存のバス停に追加",
    "GruppehEntf-de": "Aus der Haltestelleliste entfernen",
    "GruppehEntf-en": "Remove from stop list",
    "GruppehEntf-ch": "從巴士站表移除",
    "GruppehEntf-ja": "バス停リストから削除",
    "kmbhzfg-de": "Alle KMB-Linien dieser Haltestelle zur Liste hinzufügen",
    "kmbhzfg-en": "Add all KMB-routes of this stop into stop list",
    "kmbhzfg-ch": "新增此站所有九巴路線至巴士站表",
    "kmbhzfg-ja": "すべてのKMBバス路線リストに追加",
    "kmbhzfg2-de": "Alle KMB-Linien dieser Haltestelle zu bestehender Haltestelle hinzufügen",
    "kmbhzfg2-en": "Add all KMB-routes of this existing stop into list",
    "kmbhzfg2-ch": "新增此站所有九巴路線至巴士站表",
    "kmbhzfg2-ja": "リスト既存のバス停に、すべてのKMBバス路線追加",
    "kmbentf-de": "Alle KMB-Linien dieser Haltestelle aus der Liste entfernen",
    "kmbentf-en": "Remove all KMB-routes from stop list",
    "kmbentf-ch": "從巴士站表移除此站所有九巴路線",
    "kmbentf-ja": "リストからすべてのKMBバス路線を削除",

    "hzfgFertig-de": "Erfolgreich hinzugefügt",
    "hzfgFertig-en": "Successfully added",
    "hzfgFertig-ch": "新增成功",
    "hzfgFertig-ja": "追加成功",
    "entfFertig-de": "Erfolgreich entfernt",
    "entfFertig-en": "Successfully removed",
    "entfFertig-ch": "移除成功",
    "entfFertig-ja": "削除成功",
    
    "NoStops-de" : "Keine Halltestelle existiert auf der Liste",
    "NoStops-en" : "No bus stop exists on the list",
    "NoStops-ch" : "巴士站表並無任何車站",
    "NoStops-ja" : "リストにバス停はありません",


}

function addRoute(resp, data, number){
    resp = resp + "<tr><td>" + data['data'][number]['route'] + "</td><td>"+ data['data'][number]['eta'].substring(11,16) + "</td><td><span class='ziel'>" +  data['data'][number]['dest_tc'] + "</span></td>";
    var diff =(new Date(Date.parse(data['data'][number]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
    diff /= 60;
    if( diff < 1 ){
        resp = resp + "<td></td>";
    }
    else if(Math.round(diff) < 60){
        resp = resp + "<td>" + Math.round(diff) + "<span style='font-size: 10px;'> "+ getMessage("Min-A") +"</span></td>";
    }
    else{
        resp = resp + "<td>" + Math.round(diff/60) + "<span style='font-size: 10px;'> "+ getMessage("Std") +"</span></td>";
    }
    //console.log(diff);
    resp = resp + "</tr>"; 
    return resp;
}

function addUpRoutes(data){
    var resp = "";
    for(let i=0; i < data.length; i++){
        if(data[i]['co']== 'KMB'){
            resp = resp + "<tr><td>" + data[i]['route'] + "</td>";
        }
        else if(data[i]['co']== 'CTB'){
            resp = resp + "<tr><td style='border-left-color:yellow;'>" + data[i]['route'] + "</td>";
        }
        else {
            resp = resp + "<tr><td style='border-left-color:white;'>" + data[i]['route'] + "</td>";
        }
        resp = resp + "<td>"+ data[i]['eta'].substring(11,16) + "</td><td><span class='ziel'>" +  data[i]['dest_tc'] + "</span></td>";
        var diff =(new Date(Date.parse(data[i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
        diff /= 60;
        if( diff < 1 ){
            resp = resp + "<td></td>";
        }
        else if(Math.round(diff) < 60){
            resp = resp + "<td>" + Math.round(diff) + "<span style='font-size: 10px;'> "+ getMessage("Min-A") +"</span></td>";
        }
        else{
            resp = resp + "<td>" + Math.round(diff/60) + "<span style='font-size: 10px;'>  "+ getMessage("Std") +".</span></td>";
        }
        //console.log(diff);
        resp = resp + "</tr>";
    }
    return resp;
}

function getStop(stopids,routes){
    var response = "";
    for(var k=0; k < stopids.length; k++){
        $.ajax({
            type: 'GET',
            url:'https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/'+ stopids[k],
            dataType: 'json',
            async : false,
            success: function(data){
                let j = 1;
                for(var i = 0; i < data['data'].length; i++ ){ 
                    if(data['data'][i]['eta']!=null){
                        if(routes){
                                if(routes.includes(data['data'][i]['route'])){
                                    response = addRoute(response, data, i);
                                    j++;
                                }
                        }
                        else{
                            response = addRoute(response, data, i);
                            j++;
                        }
                    }
                }
            }
        });
    }
  
    if(response == ""){
        response = "</table><table><td>"+ getMessage("Nodata") +"</td>";
    }
    return response;
}

/* function getStopAsync(element, stopids, routes){
    var response = "";
    for(var k=0; k < stopids.length; k++){
        $.ajax({
            type: 'GET',
            url:'https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/'+ stopids[k],
            dataType: 'json',
            success: function(data){
                let j = 1;
                for(var i = 0; i < data['data'].length; i++ ){ 
                    if(data['data'][i]['eta']!=null){
                        if(routes){
                                if(routes.includes(data['data'][i]['route'])){
                                    response = addRoute(response, data, i);
                                    j++;
                                }
                        }
                        else{
                            response = addRoute(response, data, i);
                            j++;
                        }
                    }
                }
                if(response == ""){
                    document.getElementById(element).innerHTML = "Keine Daten";
                }
                else{
                    document.getElementById(element).innerHTML = tablehead + response + "</table>";
                }
                
            }
        });
    }

}
*/
function getStopAsync(element, stopids, routes){
    var unsorted = [];
    var response = "";
    var j = 1;
    for(var k=0; k < stopids.length; k++){
        $.ajax({
            type: 'GET',
            url:'https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/'+ stopids[k],
            dataType: 'json',
            success: function(data){
                for(var i = 0; i < data['data'].length; i++ ){ 
                    if(data['data'][i]['eta']!=null){
                        //if(routes.length>0)
                        if(routes){
                                if(routes.includes(data['data'][i]['route'])){
                                    let repeated = 0;
                                    for(let l=0; l < unsorted.length; l ++){
                                        if(unsorted[l]['route'] == data['data'][i]['route'] && unsorted[l]['eta'] == data['data'][i]['eta'] && unsorted[l]['eta_seq'] == data['data'][i]['eta_seq']){
                                            repeated = 1;
                                        }
                                    }
                                    if(!repeated){
                                        unsorted[j-1] = data['data'][i]; 
                                        j++;
                                    }
                                    
                                }
                        }
                        else{
                            let repeated = 0;
                            for(let l=0; l < unsorted.length; l ++){
                                if(unsorted[l]['route'] == data['data'][i]['route'] && unsorted[l]['eta'] == data['data'][i]['eta'] && unsorted[l]['eta_seq'] == data['data'][i]['eta_seq']){
                                    repeated = 1;
                                }
                            }
                            if(!repeated){
                                unsorted[j-1] = data['data'][i]; 
                                j++;
                            }
                        }
                    }
                }
                unsorted.sort(function (a, b) {
                    return a.eta.localeCompare(b.eta);
                });
                response = addUpRoutes(unsorted);
                if(response == ""){
                    document.getElementById(element).innerHTML = getMessage("Nodata");
                }
                else{
                    document.getElementById(element).innerHTML = tablehead + response + "</table>";
                }
                
            }
        });
    }

}


function getStopAsyncAllOperators(element, kmbstopids, kmbroutes, ctbstopids, ctbroutes, nwftstopids, nwfbroutes){
    var unsorted = [];
    var response = "";
    var j = 1;
    if(kmbstopids.length > 0){
        for(var k=0; k < kmbstopids.length; k++){
            $.ajax({
                type: 'GET',
                url:'https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/'+ kmbstopids[k],
                dataType: 'json',
                success: function(data){
                    for(var i = 0; i < data['data'].length; i++ ){ 
                        if(data['data'][i]['eta']!=null){
                            //if(kmbroutes.length>0)
                            if(kmbroutes){
                                    if(kmbroutes.includes(data['data'][i]['route'])){
                                        let repeated = 0;
                                        for(let l=0; l < unsorted.length; l ++){
                                            if(unsorted[l]['route'] == data['data'][i]['route'] && unsorted[l]['eta'] == data['data'][i]['eta'] && unsorted[l]['eta_seq'] == data['data'][i]['eta_seq']){
                                                repeated = 1;
                                            }
                                        }
                                        if(!repeated){
                                            unsorted[j-1] = data['data'][i]; 
                                            j++;
                                        }
                                        
                                    }
                            }
                            else{
                                let repeated = 0;
                                for(let l=0; l < unsorted.length; l ++){
                                    if(unsorted[l]['route'] == data['data'][i]['route'] && unsorted[l]['eta'] == data['data'][i]['eta'] && unsorted[l]['eta_seq'] == data['data'][i]['eta_seq']){
                                        repeated = 1;
                                    }
                                }
                                if(!repeated){
                                    unsorted[j-1] = data['data'][i]; 
                                    j++;
                                }
                            }
                        }
                    }
                    if(ctbstopids.length > 0  || nwftstopids.length > 0){
                        if(ctbstopids.length > 0){ //ctbstopids is an array and ctbroutes is a 2D array
                            addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
                
                        }
                        if(nwftstopids.length > 0){
                            addBravoToStop(unsorted,"NWFB", nwftstopids, nwfbroutes, element);
                        }
                    }
                    else{
                        unsorted.sort(function (a, b) {
                            return a.eta.localeCompare(b.eta);
                        });
                        response = addUpRoutes(unsorted);
                        if(response == ""){
                            document.getElementById(element).innerHTML = getMessage("Nodata");
                        }
                        else{
                            document.getElementById(element).innerHTML = tablehead + response + "</table>";
                        }
                    }
                    //addBravo();
                   
                    
                }
            });
        }
    }
    else{
        if(ctbstopids.length > 0){
            addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
        }
        if(nwftstopids.length > 0){
            addBravoToStop(unsorted,"NWFB", nwftstopids, nwfbroutes, element);
        }
    }


}

//TODO
function addBravoToStop(unsorted, company, stopids, routes, element){
    //001986
    if(unsorted==null){
        unsorted = [];
    }
    for(let i=0; i < stopids.length; i++){
        for(let j=0; j < routes.length; j++){
            $.ajax({
                type: 'GET',
                url:'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/' + company + '/' + stopids[i] + '/' + routes[j],
                dataType: 'json',
                success: function(data){
                    //console.log(data['data'].length);
                    //console.log('https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/' + company + '/' + stopids[i] + '/' + routes[j]);
                    for(let k = 0; k < data['data'].length; k++ ){
                        //console.log( data['data'][i]['eta']);
                        if(data['data'][k]['eta']!=""){
                            if(routes.includes(data['data'][k]['route'])){
                                let repeated = 0;
                                for(let l=0; l < unsorted.length; l ++){
                                    if(unsorted[l]['route'] == data['data'][k]['route'] && unsorted[l]['eta'] == data['data'][k]['eta'] && unsorted[l]['eta_seq'] == data['data'][k]['eta_seq']){
                                        repeated = 1;
                                    }
                                }
                                if(!repeated){
                                    unsorted[unsorted.length] = data['data'][k]; 
                                }
                            }
                        }
                    }
                    //console.log("refresh");
                    unsorted.sort(function (a, b) {
                        return a.eta.localeCompare(b.eta);
                    });
                    response = addUpRoutes(unsorted);
                    console.log("response:"+ response);
                    if(response == ""){
                        document.getElementById(element).innerHTML = getMessage("Nodata");
                    }
                    else{
                        document.getElementById(element).innerHTML = tablehead + response + "</table>";
                    }
                }

            });
        }
    }
}


function getSingleRouteStopsAsync(route, bound, seq, stopnames){
    var response = [];
    var splitRoute = route.split("-");
    var SvcType = splitRoute[1]==null? "1" : splitRoute[1];
    $.ajax({
        type: 'GET',
        url:`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${splitRoute[0]}/${SvcType}`,
        dataType: 'json',
        success: function(data){
            let j = 0;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['dir'] == bound && data['data'][i]['seq']==seq[j] && data['data'][i]['eta']!=null){
                    if(response[j]==null){
                        response[j] = ""; 
                    }
                    if(response[j]!=""){
                        response[j] += "<br>";
                    }
                    var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                    diff /= 60;
                    if(diff < -0.5){
                        response[j] = response[j] + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("weg") +")</span>";
                    }
                    else if( diff < 0.5 ){
                        response[j] = response[j] + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("Arr") +")</span>";
                    }
                    else if( diff < 1 ){
                        response[j] = response[j] + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min-B") +")";
                    }
                    else{
                        response[j] = response[j] +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min-B") +")";
                    }
                    //console.log(response[j]);
                    if(data['data'][i+1]['seq']!=null && data['data'][i+1]['seq']!=data['data'][i]['seq']){
                        j++;
                    }
                }
            }
            for(let d = 0; d < response.length; d++){
                document.getElementById(stopnames[d]).innerHTML = response[d];
            }
            
            //console.log(response);
        }
    });
}


function getSingleRouteStopsBravo(company, stopids, route, stopnames){
    for(let i = 0; i < stopids.length; i ++){
        getSingleRouteSingleStopBravo(company, stopids[i], route, stopnames[i]);
    }
}

function getSingleRouteSingleStopBravo(company, stopid, route, stopname){
    var response = "";
    $.ajax({
        type: 'GET',
        url:'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/' + company + '/' + stopid + '/' + route,
        dataType: 'json',
        success: function(data){
            let j = 0;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(response==null){
                    response = ""; 
                }
                if(response!=""){
                    response += "<br>";
                }
                var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                diff /= 60;
                if( diff < -0.5){
                    response[j] = response[j] + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("weg") +")</span>";

                }
                else if( diff < 0.5 ){
                    response = response + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("Arr") +")</span>";
                }
                else if( diff < 1 ){
                    response = response + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min-B") +")";
                }
                else{
                    response = response + data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min-B") +")";
                }
                
            }
            document.getElementById(stopname).innerHTML = response;
            //console.log(response);
        }
    });
}

//TODO
function addBravoUnsorted(company, stopid, route, unsorted){
    var response = "";
    $.ajax({
        type: 'GET',
        url:'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/' + company + '/' + stopid + '/' + route,
        dataType: 'json',
        success: function(data){
            let j = 0;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(response==null){
                    response = ""; 
                }
                if(response!=""){
                    response += "<br>";
                }
                var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                diff /= 60;
                if( diff < 0){
                }
                else if( diff < 1 ){
                    response = response + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min") +")";
                }
                else{
                    response = response + data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min") +")";
                }
                
            }
            document.getElementById(stopname).innerHTML = response;
            //console.log(response);
        }
    });
}

function jQueryRoutes(searchterm){
    $.ajax({
        type: 'GET',
        url: 'https://data.etabus.gov.hk/v1/transport/kmb/route/',
        dataType: 'json',
        success: function(data){
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['route'].includes(searchterm)){
                    let appending = "";
                    appending = "data-route='" + data['data'][i]['route'] + "' data-bound='" + data['data'][i]['bound'] + "' data-service-type='" + data['data'][i]['service_type'] + "'";
                    $('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + (data['data'][i]['service_type'] == 1? "":"<span style='font-size:9px'> Sonderfarht "+ (data['data'][i]['service_type'] - 1) +"</span>") + "</td><tr>" );
                }
            }
        }
    });

}

function PrejQueryRoutesAllOp(){
    var loadedOp = 0;
    var requiredLoad = isBravoDay? 2: 3;
    let j = 0;
    $.ajax({
        type: 'GET',
        url: 'https://data.etabus.gov.hk/v1/transport/kmb/route/',
        dataType: 'json',
        success: function(data){
            for(var i = 0; i < data['data'].length; i++ ){ 
                allRouteData[j] = [data['data'][i]['route'], data['data'][i]['dest_tc'], "kmb", data['data'][i]['bound'], data['data'][i]['service_type'], data['data'][i]['dest_en'].replace(
                    /(\w)(\w*)/g,
                    (_, firstChar, rest) => firstChar + rest.toLowerCase()
                  )]; 
                j++;
            }
            loadedOp++;
            if(loadedOp==requiredLoad){
                isAllOpLoaded = true;
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: 'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route/ctb',
        dataType: 'json',
        success: function(data){
            for(var i = 0; i < data['data'].length; i++ ){ 
                allRouteData[j] = [data['data'][i]['route'], data['data'][i]['dest_tc'], "ctb", "outbound", "", data['data'][i]['dest_en']];
                j++;
                allRouteData[j] = [data['data'][i]['route'], data['data'][i]['orig_tc'], "ctb", "inbound", "", data['data'][i]['orig_en']];
                j++;
            }
            loadedOp++;
            if(loadedOp==requiredLoad){
                isAllOpLoaded = true;
            }
        }
    });
    if(!isBravoDay){
        $.ajax({
            type: 'GET',
            url: 'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route/nwfb',
            dataType: 'json',
            success: function(data){
                for(var i = 0; i < data['data'].length; i++ ){ 
                    allRouteData[j] = [data['data'][i]['route'], data['data'][i]['dest_tc'], "nwfb", "outbound", "", data['data'][i]['dest_en']];
                    j++;
                    allRouteData[j] = [data['data'][i]['route'], data['data'][i]['orig_tc'], "nwfb", "inbound", "", data['data'][i]['orig_en']];
                    j++;
                }
                loadedOp++;
                if(loadedOp==requiredLoad){
                    isAllOpLoaded = true;
                }
            }
        });
    }
}

function newjQueryRoutesAllOpStage1(searchterm){
    clearInterval(checkInterval);
    var loading = document.getElementById("LoadingAh");
    loading.classList.remove("hidden-load");
    checkInterval = setInterval(checkjQueryReady,10,searchterm);
}
function checkjQueryReady(searchterm){
    if(isAllOpLoaded){
        newjQueryRoutesAllOpStage2(searchterm);
        clearInterval(checkInterval);
    }
}
function newjQueryRoutesAllOpStage2(searchterm){
    var listOfMatches = []; //[route, dest, oper, bound, service-type (kmb), dest_en ]
    var jj = 0;
    for(let i = 0; i < allRouteData.length; i ++){
        if(allRouteData[i][0].substring(0,searchterm.length)==searchterm){
            listOfMatches[jj] = allRouteData[i];
            jj++;
        }
    }
    listOfMatches.sort(function(a, b) {
        var aNumber = parseInt(a[0]);
        var bNumber = parseInt(b[0]);
        var aSuffix = a[0].substring(aNumber.toString().length);
        var bSuffix = b[0].substring(bNumber.toString().length);
        if (aNumber === bNumber) {
        return aSuffix.localeCompare(bSuffix);
        } else {
        return aNumber - bNumber;
        }
    });
    generateResults(listOfMatches);
}
function jQueryRoutesAllOp(searchterm){
    var listOfMatches = []; //[route, dest, oper, bound, service-type (kmb) ]
    let jj=0;
    var loaded = 0; 
    var loading = document.getElementById("LoadingAh");
    loading.classList.toggle("hidden-load");
    $.ajax({
        type: 'GET',
        url: 'https://data.etabus.gov.hk/v1/transport/kmb/route/',
        dataType: 'json',
        success: function(data){
            loaded++;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['route'].substring(0,searchterm.length)==searchterm){
                    listOfMatches[jj] = [data['data'][i]['route'],  data['data'][i]['dest_tc'], "kmb", data['data'][i]['bound'], data['data'][i]['service_type']]; 
                    jj++;
                    //console.log(listOfMatches);
                    
                    //let appending = "";
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='" + data['data'][i]['bound'] + "' data-op='kmb'" + "' data-service-type='" + data['data'][i]['service_type'] + "'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid red;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + (data['data'][i]['service_type'] == 1? "":"<span style='font-size:9px'> Sonderfarht "+ (data['data'][i]['service_type'] - 1) +"</span>") + "</td><tr>" );
                }
            }
            if(loaded == 3){
                listOfMatches.sort(function(a, b) {
                    var aNumber = parseInt(a[0]);
                    var bNumber = parseInt(b[0]);
                    var aSuffix = a[0].substring(aNumber.toString().length);
                    var bSuffix = b[0].substring(bNumber.toString().length);
                    if (aNumber === bNumber) {
                    return aSuffix.localeCompare(bSuffix);
                    } else {
                    return aNumber - bNumber;
                    }
                });
                generateResults(listOfMatches);
            } 
        }
    });
    $.ajax({
        type: 'GET',
        url: 'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route/nwfb',
        dataType: 'json',
        success: function(data){
            loaded++;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['route'].substring(0,searchterm.length)==searchterm){
                    listOfMatches[jj] = [data['data'][i]['route'], data['data'][i]['dest_tc'], "nwfb", "outbound", ""];
                    jj++;
                    listOfMatches[jj] = [data['data'][i]['route'], data['data'][i]['orig_tc'], "nwfb", "inbound", ""];
                    jj++;
                    //if(loaded == 3){

                    //}
                    //console.log(listOfMatches);
                    
                    //let appending = "";
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='outbound' data-op='nwfb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + "</td><tr>" );
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='inbound' data-op='nwfb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['orig_tc'] + "</td><tr>" );
               
                }
            }
            if(loaded == 3){
                listOfMatches.sort(function(a, b) {
                    var aNumber = parseInt(a[0]);
                    var bNumber = parseInt(b[0]);
                    var aSuffix = a[0].substring(aNumber.toString().length);
                    var bSuffix = b[0].substring(bNumber.toString().length);
                    if (aNumber === bNumber) {
                    return aSuffix.localeCompare(bSuffix);
                    } else {
                    return aNumber - bNumber;
                    }
                });
                generateResults(listOfMatches);
            } 
        }
    });
    $.ajax({
        type: 'GET',
        url: 'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route/ctb',
        dataType: 'json',
        success: function(data){
            loaded++;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['route'].substring(0,searchterm.length)==searchterm){
                    listOfMatches[jj] = [data['data'][i]['route'], data['data'][i]['dest_tc'], "ctb", "outbound", ""];
                    jj++;
                    listOfMatches[jj] = [data['data'][i]['route'], data['data'][i]['orig_tc'], "ctb", "inbound", ""];
                    jj++;
                    //console.log(listOfMatches);
                    
                    //let appending = "";
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='outbound' data-op='ctb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + "</td><tr>" );
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='inbound' data-op='ctb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['orig_tc'] + "</td><tr>" );
                }
            }
            if(loaded == 3){
                listOfMatches.sort(function(a, b) {
                    var aNumber = parseInt(a[0]);
                    var bNumber = parseInt(b[0]);
                    var aSuffix = a[0].substring(aNumber.toString().length);
                    var bSuffix = b[0].substring(bNumber.toString().length);
                    if (aNumber === bNumber) {
                    return aSuffix.localeCompare(bSuffix);
                    } else {
                    return aNumber - bNumber;
                    }
                });
                generateResults(listOfMatches);
            } 
        }
    });

}

function generateResults(data){
    //[route, dest, oper, bound, service-type (kmb)]
    let loading = document.getElementById("LoadingAh");
    loading.classList.add("hidden-load");
    let appending = "";
    $('#srchResults').html("");
    if(data.length> 0){
        for(let i=0;i<data.length;i++){
            if(data[i][2]=="kmb"){
                appending = "data-route='" + data[i][0] + `' data-dest='${data[i][1]}'`+ "' data-bound='" + data[i][3] + "' data-op='kmb'" + "' data-service-type='" + data[i][4] + "'";
                $('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid red;'>" + data[i][0] + "</td><td>" +  data[i][1] + (data[i][4] == 1? "":"<span style='font-size:9px'> "+getMessage("Route")+ data[i][4] +"</span>") + "</td><tr>" );
            }
            else if(data[i][2]=="ctb" || data[i][2]=="nwfb"){
                appending = "data-route='" + data[i][0] + `' data-dest='${data[i][1]}'`+ "' data-bound='"+ data[i][3]+"' data-op='"+ data[i][2] +"'";
                $('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid "+(data[i][2]=="ctb"?"yellow":"white")+";'>" + data[i][0] + "</td><td>" +  data[i][1] + "</td><tr>" );
            }
        }
    }
}

function checkThisRoute(theRoute){
    let hiRoute = theRoute.getAttribute("data-route");
    let hiBound = theRoute.getAttribute("data-bound");
    let hiDest = theRoute.getAttribute("data-dest");
    let hiOp = theRoute.getAttribute("data-op");
    let hiServiceType = "";
    $('#destDisp').html(`${hiRoute}&emsp;${hiDest}`);
    if(hiOp=='kmb'){
        hiServiceType = theRoute.getAttribute("data-service-type");   
    }
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    var hihihi = document.getElementById("Hihihi");
    hihihi.classList.toggle("hidden");
    //console.log("Hiroute: " + hiRoute);
    if(hiOp=='kmb'){
        getSearchRouteStops(hiRoute, hiBound, hiServiceType);
    }
    else{
        getSearchRouteStopsBravo(hiRoute, hiBound, hiOp);
    }
}

function removePopup(){
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    var hihihi = document.getElementById("Hihihi");
    hihihi.classList.toggle("hidden");
    $('#popupETA').html(getMessage("loading"));
    clearInterval(getAgain);
}

function getSearchRouteStops(route, bound, service_type){
    var response = "";
    var routeString = (service_type == 1 ? route : route + '-' + service_type);
    $.ajax({
        type: 'GET',
        url:'https://data.etabus.gov.hk/v1/transport/kmb/route-stop/'+ route + "/" + (bound=='I'? "inbound" : "outbound") + "/" + service_type,
        dataType: 'json',
        success: function(data){
            response = "<table id='Hahatable'>";
            for(var i = 0; i < data['data'].length; i++ ){
                response = response + `<tr><td style='background-color:red; border-bottom: 5px solid red'><span class='circle'/></td><td>"+getMessage("loading")+"</td><td 
                data-oper='kmb' data-route='${routeString}' data-stopid='${data['data'][i]['stop']}' data-bound='${bound}'
                onclick='showAddOptions(this,"kmb")'><button type="button" class="addbtn">⋮</button></td></tr><tr style='height:30px; font-size:12px'><td style='background-color:red;border-bottom: 3px solid black'/><td>- - : - -</td><td/></tr>`;
            }
            response = response + "</table>";
            $('#popupETA').html(response);
            for(var i = 0; i < data['data'].length; i++ ){
                getStopName(data['data'][i]['stop'],i, "kmb");
            }
            getETAdata(route,bound,service_type);
            getAgain = setInterval(function() { getETAdata(route,bound,service_type);},10000);
            
        }

    });
}
function showAddOptions(element, kmbopt){
    var oper = element.getAttribute("data-oper");
    var route = element.getAttribute("data-route");
    var stopid = element.getAttribute("data-stopid");
    createOverlay();
    if(kmbopt){
        $('#Suche').append(`<div id="AddStopGroup" class="top">
        <table style='width:100%'><td><td style='width:20px' onclick="removeAdd();">✖</td></tr></table>
        <div style="text-align:left; border: 1px solid #333; border-width:0 0 1px; padding:10px 20px 30px">${getMessage("Haltestellenliste")}</div>
        <button type="button" class="addStopbtn" data-oper="kmb" data-route='${route}' data-stopid='${stopid}' onclick="removeAddFertigMsg();gruppehzfg(this)">${getMessage("Gruppehzfg")}</button><br>
        <button type="button" class="addStopbtn" data-oper="kmb" data-route='${route}' data-stopid='${stopid}' onclick="gruppehzfg2(this)">${getMessage("Gruppehzfg2")}</button><br>
        <button type="button" class="addStopbtn" data-oper="kmb" data-route='${route}' data-stopid='${stopid}' onclick="gruppeentf(this)">${getMessage("GruppehEntf")}</button><br>
        <button type="button" class="addStopbtn" onclick="removeAdd();">${getMessage("kmbhzfg")}</button><br>
        <button type="button" class="addStopbtn" onclick="removeAdd();">${getMessage("kmbhzfg2")}</button><br>
        <button type="button" class="addStopbtn" onclick="removeAdd();">${getMessage("kmbentf")}</button><br><br><br>
        </div>`);
    }
    else{
        $('#Suche').append(`<div id="AddStopGroup" class="top">
        <table style='width:100%'><td><td style='width:20px' onclick="removeAdd();">✖</td></tr></table>
        <div style="text-align:left; border: 1px solid #333; border-width:0 0 1px; padding:10px 20px 30px">${getMessage("Haltestellenliste")}</div>
        <button type="button" class="addStopbtn" data-oper="${oper}" data-route='${route}' data-stopid='${stopid}' onclick="removeAddFertigMsg();gruppehzfg(this)">${getMessage("Gruppehzfg")}</button><br>
        <button type="button" class="addStopbtn" data-oper="${oper}" data-route='${route}' data-stopid='${stopid}' onclick="gruppehzfg2(this)">${getMessage("Gruppehzfg2")}</button><br>
        <button type="button" class="addStopbtn" data-oper="${oper}" data-route='${route}' data-stopid='${stopid}' onclick="gruppeentf(this)"">${getMessage("GruppehEntf")}</button><br><br><br>
        </div>`);
    }
    
    //stopName, operator, stopID, route
    //kmb route : "route-service_type" if service type not 1
    //console.log(oper, route, stopID, bound);
}
function gruppehzfg(element){
    var oper = element.getAttribute("data-oper");
    var route = element.getAttribute("data-route");
    var stopid = element.getAttribute("data-stopid");
    console.log(oper, route, stopid);
    var link;
    var en_name, ch_name;
    if(oper == "kmb"){
        link = 'https://data.etabus.gov.hk/v1/transport/kmb/stop/';
    }
    else if(oper == "ctb" || oper == "nwfb"){
        link = 'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/stop/'
    }
    $.ajax({
        type: 'GET',
        url: link + stopid,
        dataType: 'json',
        success: function(data){
            en_name = data['data']['name_en'];
            ch_name = data['data']['name_tc'];
            addStopGroup(ch_name, oper, stopid, route);

        }
    });
}
function gruppehzfg2(element){
    var oper = element.getAttribute("data-oper");
    var route = element.getAttribute("data-route");
    var stopid = element.getAttribute("data-stopid");

    var buttonsString = `<div style='height=60px;padding: 70px 20px'>${getMessage("NoStops")}</div>`;
    if(cookieStops.length>0){
        buttonsString = "";
        for(let i = 0 ; i < cookieStops.length; i ++){
            buttonsString += `<button type="button" class="addStopbtn" data-oper="${oper}" data-route='${route}' data-stopid='${stopid}' data-index='${i}'
             onclick="gruppehzfg3(this)">${cookieStops[i][0]}</button><br>`;
        }
    }

    $("#AddStopGroup").remove();
    $('#Suche').append(`<div id="AddStopGroup" class="top">
    <table style='width:100%'><td><td style='width:20px' onclick="removeAdd();">✖</td></tr></table>
    <div style="text-align:left; border: 1px solid #333; border-width:0 0 1px; padding:10px 20px 30px">${getMessage("Gruppehzfg2")}</div>
    ${buttonsString}
    <br>
    </div>`);

}
function gruppehzfg3(element){
    var oper = element.getAttribute("data-oper");
    var route = element.getAttribute("data-route");
    var stopid = element.getAttribute("data-stopid");
    var index = element.getAttribute("data-index");
    addRouteToStopGroup(index, oper, stopid, route);
    removeAddFertigMsg();
}
function gruppeentf(element){
    var oper = element.getAttribute("data-oper");
    var route = element.getAttribute("data-route");
    var stopid = element.getAttribute("data-stopid");

    var buttonsString = `<div style='height=60px;padding: 70px 20px'>${getMessage("NoStops")}</div>`;
    if(cookieStops.length>0){
        buttonsString = "";
        for(let i = 0 ; i < cookieStops.length; i ++){
            buttonsString += `<button type="button" class="addStopbtn" data-oper="${oper}" data-route='${route}' data-stopid='${stopid}' data-index='${i}'
             onclick="gruppeentf2(this)">${cookieStops[i][0]}</button><br>`;
        }
    }

    $("#AddStopGroup").remove();
    $('#Suche').append(`<div id="AddStopGroup" class="top">
    <table style='width:100%'><td><td style='width:20px' onclick="removeAdd();">✖</td></tr></table>
    <div style="text-align:left; border: 1px solid #333; border-width:0 0 1px; padding:10px 20px 30px">${getMessage("GruppehEntf")}</div>
    ${buttonsString}
    <br>
    </div>`);
}
function gruppeentf2(element){
    var oper = element.getAttribute("data-oper");
    var route = element.getAttribute("data-route");
    var stopid = element.getAttribute("data-stopid");
    var index = element.getAttribute("data-index");
    removeRouteFromStopGroup(index, oper, stopid, route);
    removeRemoveFertigMsg();
}

function removeAdd(){
    removeOverlay();
    $("#AddStopGroup").remove();
}
function removeAddFertigMsg(){
    $("#AddStopGroup").remove();
    $('#Suche').append(`<div id="AddStopGroupFertig" class="top">
    <div style="font-size:50px">✓</div><br>
    <div>${getMessage("hzfgFertig")}</div>
    </div>`);
    setTimeout(() => {
        $("#AddStopGroupFertig").remove();
        removeOverlay();
    }, 1000);
}
function removeRemoveFertigMsg(){
    $("#AddStopGroup").remove();
    $('#Suche').append(`<div id="AddStopGroupFertig" class="top">
    <div style="font-size:50px">✓</div><br>
    <div>${getMessage("entfFertig")}</div>
    </div>`);
    setTimeout(() => {
        $("#AddStopGroupFertig").remove();
        removeOverlay();
    }, 1000);
}

function chooseAdd(element){

}

function getSearchRouteStopsBravo(route, bound, oper){
    var oneCharBound = "";
    oneCharBound = (bound=="inbound"? "I":"O");
    $.ajax({
        type: 'GET',
        url:`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${oper}/${route}/${bound}`,
        dataType: 'json',
        success: function(data){
            var data2 =[];
            var color = (oper=="ctb"?"yellow": "white");
            //console.log(data);
            response = "<table id='Hahatable'>";
            for(var i = 0; i < data['data'].length; i++ ){
                response = response + `<tr><td style='background-color:${color}; border-bottom: 5px solid ${color}'><span class='circle'/></td><td>${getMessage("loading")}</td><td
                data-oper='${oper}' data-route='${route}' data-stopid='${data['data'][i]['stop']}' data-bound='${bound}'
                onclick='showAddOptions(this)'><button type="button" class="addbtn">⋮</button></td></tr><tr style='height:30px; font-size:12px'><td style='background-color:${color};border-bottom: 3px solid black'/><td>--:--</td><td/></tr>`;
            }
            response = response + "</table>";
            $('#popupETA').html(response);
            for(var i = 0; i < data['data'].length; i++ ){
                getStopName(data['data'][i]['stop'],i, oper);
                getStopETABravo(data['data'][i]['stop'],i,route,oneCharBound,oper);
                data2[i]= data['data'][i]['stop'];
            }
            getAgain = setInterval(function() { getStopETAAgain(data2, route, oneCharBound, oper);},10000);
        }
    });
}
function getStopETABravo(stopid, stopseq, route, bound, oper){
    var response = "";
    $.ajax({
        type: 'GET',
        url: `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${oper}/${stopid}/${route}`,
        dataType: 'json',
        success: function(data){
            //console.log(data);
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(response==null){
                    response = ""; 
                }
                if(response!=""){
                    response += "&emsp;";
                }
                if(data['data'][i]['eta']!= null && data['data'][i]['eta']!= "" && data['data'][i]['dir']==(bound)){
                    var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                    diff /= 60;
                    if(diff < -0.5){
                        response = response + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("weg") +")</span>";
                    }
                    else if( diff < 0.5 ){
                        response = response + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("Arr") +")</span>";
                    }
                    else if( diff < 1 ){
                        response = response + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min-B") +")";
                    }
                    else{
                        response = response +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min-B") +")";
                    }
                }
            }
            //console.log(`response of ${stopid},${stopseq}: ${response}`)
            var tt = document.getElementById("Hahatable");
            if(response!= null && response!= ''){
                var tt = document.getElementById("Hahatable");
                var ttt = tt.getElementsByTagName("td")[stopseq*6+4];
                ttt.innerHTML = response;
            }
        }
    });
}
function getStopETAAgain(data, route,bound,oper){
    console.log("HiHi, data:" + data);
    for(var i = 0; i < data.length; i++ ){
        getStopETABravo(data[i],i,route,bound,oper);
    }
}

function getStopName(stopid,stopseq, oper){
    var response = "";
    var link = "";
    if(oper == "kmb"){
        link = 'https://data.etabus.gov.hk/v1/transport/kmb/stop/';
    }
    else if(oper == "ctb" || oper == "nwfb"){
        link = 'https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/stop/'
    }
    $.ajax({
        type: 'GET',
        url: link + stopid,
        dataType: 'json',
        success: function(data){
            var tt = document.getElementById("Hahatable");
            var ttt = tt.getElementsByTagName("td")[1+ stopseq*6];
            ttt.innerHTML = data['data']['name_tc'];
        }
    });
}

function getETAdata(route, bound, service_type){
    var response = [];
    $.ajax({
        type: 'GET',
        url:'https://data.etabus.gov.hk/v1/transport/kmb/route-eta/'+ route + "/" + service_type,
        dataType: 'json',
        async:false,
        success: function(data){
            //console.log("Hihi");
            j=0;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['dir'] == bound ){
                    if(response[j]==null){
                        response[j] = ""; 
                    }
                    if(response[j]!=""){
                        response[j] += "&emsp;";
                    }
                    if(data['data'][i]['eta']!= null){
                        var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                        diff /= 60;
                        if(diff < -0.5){
                            response[j] = response[j] + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("weg") +")</span>";
                        }
                        else if( diff < 0.5 ){
                            response[j] = response[j] + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " ("+ getMessage("Arr") +")</span>";
                        }
                        else if( diff < 1 ){
                            response[j] = response[j] + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min-B") +")";
                        }
                        else{
                            response[j] = response[j] +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min-B") +")";
                        }
                    }
                    if(i < (data['data'].length -1) && data['data'][i+1]['seq']!=data['data'][i]['seq']){
                        j++;
                    }
                }
            }
            var tt = document.getElementById("Hahatable");
            var j = 0;
            for(var i = 1; i < tt.rows.length; i +=2){
                if(response[j]!= null && response[j]!= ''){
                    var ttt = tt.getElementsByTagName("td")[i*3+1];
                    ttt.innerHTML= response[j];
                }
                j++;
            }
        }
    });

}
function getLastOpenTab(){
    let tabName = getCookie("lasttab");
    if (tabName == "" || tabName == null){
        setCookie('lasttab','Haltestellen',10);
        tabName = "Haltestellen";
    }
    var tabcontent, tab;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].className = tabcontent[i].className.replace(" current","");
    }
    tab = document.getElementsByClassName("tab");
    for (i = 0; i < tab.length; i++) {
        tab[i].className = tab[i].className.replace(" active", "");
        if(tab[i].getAttribute('data-content') == tabName){
            tab[i].classList.toggle("active");
        }
    }
    document.getElementById(tabName).style.display = "block";
    setTimeout(function(){
        document.getElementById(tabName).className += " current";
    },1 );
}
function checkCookie() {
    let lang = getCookie("lang");
    if (lang == "" || lang == null){
        createOverlay();
        const langPopup = document.createElement('div');
        langPopup.setAttribute("id", "setLang");
        langPopup.classList.add("top");
        document.body.appendChild(langPopup);
        $('#setLang').append( `<br>
        <button type="button" class="langbtn" onclick="setLang180('en');">English</button>
        <br>
        <button type="button" class="langbtn" onclick="setLang180('de');">Deutsch</button>
        <br>
        <button type="button" class="langbtn" onclick="setLang180('ch')";>中文</button>
        <br>
        <button type="button" class="langbtn" onclick="setLang180('ja')";>日本語</button>
        <br><br>`
        );
        setTimeout(langTimeout,10000);
    }   
    else if(lang != 'de'){
        console.log("changing language");
        changeLang(lang);
    }
}
function createOverlay(){
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
}
function removeOverlay(){
    const overlay = document.querySelector('.overlay');
    document.body.removeChild(overlay);
}
function setLang180(lang){
    var loading = document.getElementById("setLang");
    loading.classList.toggle("hidden-lang");  
    setCookie('lang',lang,180);
    location.reload();
}

function langTimeout(){
    $('#setLang').remove();
    removeOverlay();
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function changeLang(lang) {
    console.log("Hi, changelang to " + lang);
    const divs = document.querySelectorAll('[data-content]');
    divs.forEach(div => {
        const content = div.getAttribute('data-content');
        const message = messages[content+"-"+lang];
        if (message) {
            div.textContent = message;
        }
        });
    
  }

  function getMessage(content){
    if(dispLang == "" || dispLang == null){   
        dispLang = getCookie('lang');
        if(dispLang == "" || dispLang == null){
            return messages[content+"-de"];
        }
        return messages[content+"-"+dispLang];

    }
    else{
        return messages[content+"-"+dispLang];
    }
  }
  //
  function getCookieStops(){
    var cookieString = getCookie('stops');
    if(cookieString == null || cookieString == ""){
        setCookie('stops','[["Lo Tsz Tin", ["9AB9D810103D8382","6EAC23CB146AE03C"],[],[],[],[],[]],["Tate\'s Cairn Tunnel Südwarts",["FFBEBD7068E01EA4"], ["307","680","681","673"], ["001986"] , ["307","681"], ["001986"], ["682", "682B"]],\
        ["EHC Südwarts",["9535298A652873DB"],["606","613"], ["001463"], ["608","606"], ["001463"], ["682","682B"]],\
        ["Sunway Gardens",["633C082A94176ED0"],["307P","678"],[],[],[],[]],\
        ["Opp Sunway Gardens",["75CE4282D2043790"],["606"],[],[],[],[]],\
        ["EHC Nördwarts",["991E47DBD416B908","D678B3364437D16B"],["307","680","681","307P","673","678","373"],[],[],[],[]],\
        ["Tate\'s Cairn Tunnel Nördwarts",["9274EF6791CA3ED8"],["74B","74D","274X","74X","75X","307","307P"],[],[],[],[]]]',365);
        cookieStops = [["Lo Tsz Tin", ["9AB9D810103D8382","6EAC23CB146AE03C"],[],[],[],[],[]],["Tate\'s Cairn Tunnel Südwarts",["FFBEBD7068E01EA4"], ["307","680","681","673"], ["001986"] , ["307","681"], ["001986"], ["682", "682B"]],
        ["EHC Südwarts",["9535298A652873DB"],["606","613"], ["001463"], ["608","606"], ["001463"], ["682","682B"]],
        ["Sunway Gardens",["633C082A94176ED0"],["307P","678"],[],[],[],[]],["Opp Sunway Gardens",["75CE4282D2043790"],["606"],[],[],[],[]],
        ["EHC Nördwarts",["991E47DBD416B908","D678B3364437D16B"],["307","680","681","307P","673","678","373"],[],[],[],[]],
        ["Tate\'s Cairn Tunnel Nördwarts",["9274EF6791CA3ED8"],["74B","74D","274X","74X","75X","307","307P"],[],[],[],[]]];
    }
    else{
        cookieStops = JSON.parse(cookieString);
    }
  }
  function setCookieStops(){
    setCookie('stops', JSON.stringify(cookieStops));
  }
  function addStopGroup(name, operator, stopID, route){
    //KMB can add only stop id, bravo requires both stopid and route
    var StopGroupArray = [];
    if(operator=="kmb"){
        if(route==null || route == ""){
            StopGroupArray = [name, [stopID],[],[],[],[],[]];
        }
        else{
            StopGroupArray = [name, [stopID],[route],[],[],[],[]];
        }
    }
    else if(operator == "ctb"){
        StopGroupArray = [name,[],[],[stopID],[route],[],[]];
    }
    else if(operator == "nwfb"){
        StopGroupArray = [name,[],[],[],[],[stopID],[route]];
    }
    cookieStops[cookieStops.length] = StopGroupArray;
    setCookieStops();
    renderStops();
    refreshHaltestellen();
  }
  function removeStopGroup(index){
    cookieStops.splice(index,1);
    setCookieStops();
  }
  //cookieStops = [StopGroupArray, StopGroupArray, ...]
  //StopGroupArray[0] = "Display Name"
  //StopGroupArray[1] = [kmbstopID1, kmbstopID2, ...]
  //StopGroupArray[2] = ["kmbroute1", "kmbroute2"] (Optional)
  //StopGroupArray[3] = [ctbstopID1, ctbstopID2, ...]
  //StopGroupArray[4] = ["ctbroute1", "ctbroute2"]
  //StopGroupArray[5] = [nwfbstopID1, nwfbstopID2, ...]
  //StopGroupArray[6] = ["nwfbroute1", "nwfbroute2"]

  function addRouteToStopGroup(groupIndex, operator, stopID, route){
    if(operator=="kmb"){
        if(!cookieStops[groupIndex][1].includes(stopID)){
            if(route==null || route == ""){//equals to add all routes
                cookieStops[groupIndex][1].push(stopID);
                cookieStops[groupIndex][2] =[];
            }
            else{
                cookieStops[groupIndex][1].push(stopID);
                cookieStops[groupIndex][2].push(route);
            }
        }
        else{//already has the stopid
            if(route==null || route == ""){
                cookieStops[groupIndex][2] =[];
            }
            else if(!cookieStops[groupIndex][2].includes(route)){
                cookieStops[groupIndex][2].push(route);
            }
        }
    }
    else if(operator == "ctb"){
        if(!cookieStops[groupIndex][3].includes(stopID)){
            cookieStops[groupIndex][3].push(stopID);
            cookieStops[groupIndex][4].push(route);
        }
        else{//already has the stopid
            if(!cookieStops[groupIndex][4].includes(route)){
                cookieStops[groupIndex][4].push(route);
            }
        }    
    }
    else if(operator == "nwfb"){
        if(!cookieStops[groupIndex][5].includes(stopID)){
            cookieStops[groupIndex][5].push(stopID);
            cookieStops[groupIndex][6].push(route);
        }
        else{//already has the stopid
            if(!cookieStops[groupIndex][6].includes(route)){
                cookieStops[groupIndex][6].push(route);
            }
        }     
    }
    setCookieStops();
    renderStops();
    refreshHaltestellen();
  }
  function removeRouteFromStopGroup(groupIndex, operator, stopID, route){
    if(operator=="kmb"){
        if(cookieStops[groupIndex][1].includes(stopID)){
            if(route==null || route == ""){//equals to remove all routes
                cookieStops[groupIndex][1].splice(cookieStops[groupIndex][1].indexOf(stopID),1);
                cookieStops[groupIndex][2] =[];
            }
            else{
                cookieStops[groupIndex][1].splice(cookieStops[groupIndex][1].indexOf(stopID),1);
                cookieStops[groupIndex][2].splice(cookieStops[groupIndex][2].indexOf(route),1);
            }
        }
    }
    else if(operator == "ctb"){
        if(cookieStops[groupIndex][3].includes(stopID)){
            cookieStops[groupIndex][3].splice(cookieStops[groupIndex][3].indexOf(stopID),1);
            cookieStops[groupIndex][4].splice(cookieStops[groupIndex][4].indexOf(route),1);
        }
    }
    else if(operator == "nwfb"){
        if(cookieStops[groupIndex][5].includes(stopID)){
            cookieStops[groupIndex][5].splice(cookieStops[groupIndex][5].indexOf(stopID),1);
            cookieStops[groupIndex][6].splice(cookieStops[groupIndex][6].indexOf(route),1);
        }
  
    }
    if(cookieStops[groupIndex][1].length == 0 && cookieStops[groupIndex][3].length == 0 && cookieStops[groupIndex][5].length == 0 ){
        removeStopGroup(groupIndex);
    }
    else{
        setCookieStops();
    }
    renderStops();
    refreshHaltestellen();
  }
  function renameStopGroup(groupIndex){
    var newName = document.getElementById('myInput2').value;
    cookieStops[groupIndex][0] = newName;
    removeConfirm();
    setCookieStops();
    renderStops();
    refreshHaltestellen();
  }
  function confirmDeleteStopGroup(groupIndex){
    createOverlay();
    $('#Haltestellen').append(`<div id="ConfirmDelGroup" class="top">
        <br>${getMessage("confirmDelGroup")}<br><br>
        <button type="button" class="confirmbtn" onclick="removeConfirm();deleteStopGroup(${groupIndex})">${getMessage("Ja")}</button>&ensp;
        <button type="button" class="confirmbtn" onclick="removeConfirm()">${getMessage("Nein")}</button><br><br>
    </div>`);
  }
  function gruppeUmbenennen(groupIndex){
    createOverlay();
    $('#Haltestellen').append(`<div id="ConfirmDelGroup" class="top">
        <br>${getMessage("renameGroup")}<br><br>
        <input id="myInput2" type="text" pattern="[A-Za-z0-9]" value="${cookieStops[groupIndex][0]}"/>
        <br><br><br>
        <button type="button" class="confirmbtn" onclick="renameStopGroup(${groupIndex})">${getMessage("Confirm")}</button>&ensp;
        <button type="button" class="confirmbtn" onclick="removeConfirm()">${getMessage("Cancel")}</button><br><br>
    </div>`);
    document.getElementById('myInput2').select();
  }
  function removeConfirm(){
    removeOverlay();
    $("#ConfirmDelGroup").remove();
  }
  function deleteStopGroup(groupIndex){
    cookieStops.splice(groupIndex,1);
    setCookieStops();
    renderStops();
    refreshHaltestellen();
  }
  function moveUpStopGroup(groupIndex){
    if(groupIndex!=0){
        tempArray = cookieStops[groupIndex-1];
        cookieStops[groupIndex-1] = cookieStops[groupIndex];
        cookieStops[groupIndex] = tempArray;
        setCookieStops();
        renderStops();
        refreshHaltestellen();
    }
  }
  function moveDownStopGroup(groupIndex){
    if(groupIndex!=cookieStops.length -1){
        tempArray = cookieStops[groupIndex + 1];
        cookieStops[groupIndex+1] = cookieStops[groupIndex];
        cookieStops[groupIndex] = tempArray;
        setCookieStops();
        renderStops();
        refreshHaltestellen();
    }
  }


  
  
  
  
  
  