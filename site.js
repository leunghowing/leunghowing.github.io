var datetimenow = "";
var getAgain;
var dispLang ="";
var cookieStops = [];
var messages = {
    "Busse-de": "Busse",
    "Busse-en": "Buses",
    "Busse-ch": "巴士",
    "Busse-ja": "バス",
    "Haltestellen-de": "Haltestellen",
    "Haltestellen-en": "Stops",
    "Haltestellen-ch": "巴士站",
    "Haltestellen-ja": "バス停",
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
    if(kmbstopids){
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
                    if(ctbstopids || nwftstopids){
                        if(ctbstopids){ //ctbstopids is an array and ctbroutes is a 2D array
                            addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
                
                        }
                        if(nwftstopids){
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
        if(ctbstopids){
            addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
        }
        if(nwftstopids){
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
}


function getSingleRouteStopsAsync(route, bound, seq, stopnames){
    var response = [];
    $.ajax({
        type: 'GET',
        url:'https://data.etabus.gov.hk/v1/transport/kmb/route-eta/'+ route + "/1",
        dataType: 'json',
        success: function(data){
            let j = 0;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['dir'] == bound && data['data'][i]['seq']==seq[j]){
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
                    }
                    //console.log(listOfMatches);
                    
                    //let appending = "";
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='" + data['data'][i]['bound'] + "' data-op='kmb'" + "' data-service-type='" + data['data'][i]['service_type'] + "'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid red;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + (data['data'][i]['service_type'] == 1? "":"<span style='font-size:9px'> Sonderfarht "+ (data['data'][i]['service_type'] - 1) +"</span>") + "</td><tr>" );
                }
            }
            if(loaded == 3){
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
                    }
                    //console.log(listOfMatches);
                    
                    //let appending = "";
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='outbound' data-op='nwfb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + "</td><tr>" );
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='inbound' data-op='nwfb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['orig_tc'] + "</td><tr>" );
               
                }
            }
            if(loaded == 3){
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
                    }
                    //console.log(listOfMatches);
                    
                    //let appending = "";
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='outbound' data-op='ctb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['dest_tc'] + "</td><tr>" );
                    //appending = "data-route='" + data['data'][i]['route'] + "' data-bound='inbound' data-op='ctb'";
                    //$('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid white;'>" + data['data'][i]['route'] + "</td><td>" +  data['data'][i]['orig_tc'] + "</td><tr>" );
                }
            }
            if(loaded == 3){
                generateResults(listOfMatches);
            } 
        }
    });

}

function generateResults(data){
    //[route, dest, oper, bound, service-type (kmb)]
    let loading = document.getElementById("LoadingAh");
    loading.classList.toggle("hidden-load");
    let appending = "";
    $('#srchResults').html("");
    for(let i=0;i<data.length;i++){
        if(data[i][2]=="kmb"){
            appending = "data-route='" + data[i][0] + "' data-bound='" + data[i][3] + "' data-op='kmb'" + "' data-service-type='" + data[i][4] + "'";
            $('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid red;'>" + data[i][0] + "</td><td>" +  data[i][1] + (data[i][4] == 1? "":"<span style='font-size:9px'> Sonderfarht "+ (data[i][4] - 1) +"</span>") + "</td><tr>" );
        }
        else if(data[i][2]=="ctb" || data[i][2]=="nwfb"){
            appending = "data-route='" + data[i][0] + "' data-bound='"+ data[i][3]+"' data-op='"+ data[i][2] +"'";
            $('#srchResults').append("<tr onclick='checkThisRoute(this)' " + appending +"><td style='border-left: 5px solid "+(data[i][2]=="ctb"?"yellow":"white")+";'>" + data[i][0] + "</td><td>" +  data[i][1] + "</td><tr>" );
        }
    }
}

function checkThisRoute(theRoute){
    let hiRoute = theRoute.getAttribute("data-route");
    let hiBound = theRoute.getAttribute("data-bound");
    let hiOp = theRoute.getAttribute("data-op");
    let hiServiceType = "";
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
    $('#popupETA').html("Lädt...");
    clearInterval(getAgain);
}

function getSearchRouteStops(route, bound, service_type){
    var response = "";
    $.ajax({
        type: 'GET',
        url:'https://data.etabus.gov.hk/v1/transport/kmb/route-stop/'+ route + "/" + (bound=='I'? "inbound" : "outbound") + "/" + service_type,
        dataType: 'json',
        success: function(data){
            response = "<table id='Hahatable'>";
            for(var i = 0; i < data['data'].length; i++ ){
                response = response + "<tr><td style='background-color:red; border-bottom: 5px solid red'/><td>Lädt...</td><td>+</td></tr><tr style='height:30px; font-size:12px'><td style='background-color:red;'/><td>--:--</td><td/></tr>";
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
                response = response + `<tr><td style='background-color:${color}; border-bottom: 5px solid ${color}'/><td>Lädt...</td><td>+</td></tr><tr style='height:30px; font-size:12px'><td style='background-color:${color};'/><td>--:--</td><td/></tr>`;
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
                    response += "\t";
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
                        response[j] += "\t";
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
                    if(i < (data['data'].length -1) && data['data'][i+1]['eta_seq']==1){
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


function checkCookie() {
    let lang = getCookie("lang");
    if (lang == "" || lang == null){
        var loading = document.getElementById("setLang");
        loading.classList.toggle("hidden-lang");  
    }   
    else if(lang != 'de'){
        console.log("changing language");
        changeLang(lang);
    }
}

function setLang180(lang){
    var loading = document.getElementById("setLang");
    loading.classList.toggle("hidden-lang");  
    setCookie('lang',lang,180);
    location.reload();
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
        setCookie('stops','[["Lo Tsz Tin", ["9AB9D810103D8382","6EAC23CB146AE03C"],[],[],[],[],[]],["Tate\'s Cairn Tunnel",["FFBEBD7068E01EA4"], ["307","680","681","673"], ["001986"] , ["307","681"], ["001986"], ["682", "682B"]]]',365);
        cookieStops = [["Lo Tsz Tin", ["9AB9D810103D8382","6EAC23CB146AE03C"],[],[],[],[],[]],["Tate\'s Cairn Tunnel",["FFBEBD7068E01EA4"], ["307","680","681","673"], ["001986"] , ["307","681"], ["001986"], ["682", "682B"]]];
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
  }
  function renameStopGroup(groupIndex, newName){
    cookieStops[groupIndex][0] = newName;
    setCookieStops();
  }
  function deleteStopGroup(groupIndex){
    cookieStops.splice(groupIndex,1);
    setCookieStops();
  }
  function moveUpStopGroup(groupIndex){
    if(groupIndex!=0){
        tempArray = cookieStops[groupIndex-1];
        cookieStops[groupIndex-1] = cookieStops[groupIndex];
        cookieStops[groupIndex] = tempArray;
    }
    setCookieStops();
  }
  function moveDownStopGroup(){
    if(groupIndex!=cookieStops.length -1){
        tempArray = cookieStops[groupIndex + 1];
        cookieStops[groupIndex+1] = cookieStops[groupIndex];
        cookieStops[groupIndex] = tempArray;
    }
    setCookieStops();
  }


  
  
  
  
  
  