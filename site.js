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
        resp = resp + "<tr><td>" + data[i]['route'] + "</td><td>"+ data[i]['eta'].substring(11,16) + "</td><td><span class='ziel'>" +  data[i]['dest_tc'] + "</span></td>";
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

function getStopAsync(element, stopids, routes){
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

function getStopAsyncSorted(element, stopids, routes){
    var unsorted = [];
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
                    if( diff < 0){
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