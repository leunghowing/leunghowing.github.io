var datetimenow = "";
var getAgain;
var dispLang ="";
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
    "Std-de": "Std.",
    "Std-en": "hour",
    "Std-ch": "小時",
    "Std-ja": "時間"


}

function addRoute(resp, data, number){
    resp = resp + "<tr><td>" + data['data'][number]['route'] + "</td><td>"+ data['data'][number]['eta'].substring(11,16) + "</td><td><span class='ziel'>" +  data['data'][number]['dest_tc'] + "</span></td>";
    var diff =(new Date(Date.parse(data['data'][number]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
    diff /= 60;
    if( diff < 1 ){
        resp = resp + "<td></td>";
    }
    else if(Math.round(diff) < 60){
        resp = resp + "<td>" + Math.round(diff) + "<span style='font-size: 10px;'> "+ getMessage("Min") +"</span></td>";
    }
    else{
        resp = resp + "<td>" + Math.round(diff/60) + "<span style='font-size: 10px;'> "+ getMessage(Std) +"</span></td>";
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
            resp = resp + "<td>" + Math.round(diff) + "<span style='font-size: 10px;'> "+ getMessage("Min") +"</span></td>";
        }
        else{
            resp = resp + "<td>" + Math.round(diff/60) + "<span style='font-size: 10px;'>  "+ getMessage(Std) +".</span></td>";
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
        response = "</table><table><td>Keine Daten</td>";
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
                    document.getElementById(element).innerHTML = "Keine Daten";
                }
                else{
                    document.getElementById(element).innerHTML = tablehead + response + "</table>";
                }
                
            }
        });
    }

}

//TODO
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
                            document.getElementById(element).innerHTML = "Keine Daten";
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
                        response[j] = response[j] + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " (Weg)</span>";
                    }
                    else if( diff < 1 ){
                        response[j] = response[j] + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min") +")</span>";
                    }
                    else{
                        response[j] = response[j] +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min") +")";
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
                    response[j] = response[j] + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " (Weg)</span>";

                }
                else if( diff < 1 ){
                    response = response + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min") +")</span>";
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
                response = response + "<tr><td>Lädt...</td></tr><tr style='height:30px; font-size:12px'><td>--:--</td></tr>";
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
    //console.log(bound);
    oneCharBound = (bound=="inbound"? "I":"O");
    $.ajax({
        type: 'GET',
        url:`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${oper}/${route}/${bound}`,
        dataType: 'json',
        success: function(data){
            var data2 =[];
            //console.log(data);
            response = "<table id='Hahatable'>";
            for(var i = 0; i < data['data'].length; i++ ){
                response = response + "<tr><td>Lädt...</td></tr><tr style='height:30px; font-size:12px'><td>--:--</td></tr>";
            }
            response = response + "</table>";
            $('#popupETA').html(response);
            for(var i = 0; i < data['data'].length; i++ ){
                getStopName(data['data'][i]['stop'],i, oper);
                getStopETABravo(data['data'][i]['stop'],i,route,oneCharBound);
                data2[i]= data['data'][i]['stop'];
            }
            getAgain = setInterval(function() { getStopETAAgain(data2, route, oneCharBound);},10000);
        }
    });
}
function getStopETABravo(stopid, stopseq, route, bound){
    var response = "";
    $.ajax({
        type: 'GET',
        url: `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/CTB/${stopid}/${route}`,
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
                        response = response + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " (Weg)</span>";
                    }
                    else if( diff < 1 ){
                        response = response + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min") +")</span>";
                    }
                    else{
                        response = response +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min") +")";
                    }
                }
            }
            //console.log(`response of ${stopid},${stopseq}: ${response}`)
            var tt = document.getElementById("Hahatable");
            if(response!= null && response!= ''){
                var tt = document.getElementById("Hahatable");
                var ttt = tt.getElementsByTagName("td")[stopseq*2+1];
                ttt.innerHTML = response;
            }
        }
    });
}
function getStopETAAgain(data, route,bound){
    console.log("HiHi, data:" + data);
    for(var i = 0; i < data.length; i++ ){
        getStopETABravo(data[i],i,route,bound);
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
            var ttt = tt.getElementsByTagName("td")[stopseq*2];
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
                            response[j] = response[j] + "<span style='color:gray;'>" + data['data'][i]['eta'].substring(11,16) + " (Weg)</span>";
                        }
                        else if( diff < 1 ){
                            response[j] = response[j] + "<span class='blinking'>" + data['data'][i]['eta'].substring(11,16) + " (0 "+ getMessage("Min") +")</span>";
                        }
                        else{
                            response[j] = response[j] +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " "+ getMessage("Min") +")";
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
                    var ttt = tt.getElementsByTagName("td")[i];
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
    if(dispLang == "" || dispLang == null){
        const divs = document.querySelectorAll('[data-content]');
        divs.forEach(div => {
            const content = div.getAttribute('data-content');
            const message = messages[content+"-"+lang];
            if (message) {
              div.textContent = message;
            }
          });
    }
    
  }

  function getMessage(content){
    if(dispLang == "" || dispLang == null){
        dispLang = document.getCookie('lang');
    }
    return messages[content+"-"+dispLang];
  }