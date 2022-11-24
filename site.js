var datetimenow = "";

function addRoute(resp, data, number){
    resp = resp + "<tr><td>" + data['data'][number]['route'] + "</td><td>"+ data['data'][number]['eta'].substring(11,16) + "</td><td><span class='ziel'>" +  data['data'][number]['dest_tc'] + "</span></td>";
    var diff =(new Date(Date.parse(data['data'][number]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
    diff /= 60;
    if( diff < 1 ){
        resp = resp + "<td></td>";
    }
    else if(Math.round(diff) < 60){
        resp = resp + "<td>" + Math.round(diff) + "<span style='font-size: 10px;'> Min.</span></td>";
    }
    else{
        resp = resp + "<td>" + Math.round(diff/60) + "<span style='font-size: 10px;'>  Std.</span></td>";
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
            resp = resp + "<td>" + Math.round(diff) + "<span style='font-size: 10px;'> Min.</span></td>";
        }
        else{
            resp = resp + "<td>" + Math.round(diff/60) + "<span style='font-size: 10px;'>  Std.</span></td>";
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
                            if(nwfbroutes){
                                addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
                            }
                            else{
                                addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
                            }
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
            if(nwfbroutes){
                addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
            }
            else{
                addBravoToStop(unsorted,"CTB", ctbstopids, ctbroutes, element); 
            }
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
                    if(j == routes.length -1){
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
                        response[j] = response[j] + data['data'][i]['eta'].substring(11,16) + " (0 Min)";
                    }
                    else{
                        response[j] = response[j] +  data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " Min)";
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
                    response = response + data['data'][i]['eta'].substring(11,16) + " (0 Min)";
                }
                else{
                    response = response + data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " Min)";
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
                    response = response + data['data'][i]['eta'].substring(11,16) + " (0 Min)";
                }
                else{
                    response = response + data['data'][i]['eta'].substring(11,16) + " (" + Math.round(diff) + " Min)";
                }
                
            }
            document.getElementById(stopname).innerHTML = response;
            //console.log(response);
        }
    });
}
