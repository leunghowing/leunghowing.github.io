var datetimenow = "";

function addupRoutes(resp, data, number){
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
                                    response = addupRoutes(response, data, i);
                                    j++;
                                }
                        }
                        else{
                            response = addupRoutes(response, data, i);
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

function getSingleRouteStop(stopid,route){
    var response = "";
    $.ajax({
        type: 'GET',
        url:'https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/'+ stopid,
        dataType: 'json',
        async : false,
        success: function(data){
            let j = 1;
            for(var i = 0; i < data['data'].length; i++ ){ 
                if(data['data'][i]['route'] == route){
                    if(response!=""){
                        response += "<br>";
                    }
                    response = response + data['data'][i]['eta'].substring(11,16);
                    console.log(response);
                    var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                    diff /= 60;
                    if( diff < 1 ){
                        response = response + " (0 Min)";
                    }
                    else{
                        response = response +" (" + Math.round(diff) + " Min)";
                    }
                }
            }
        }
    });
    console.log("hhfuhfuhfuhfueh");

    if(response == ""){
        response = "-";
    }
    return response;
}

function getSingleRouteStops(route, bound, seq){
    var response = [];
    $.ajax({
        type: 'GET',
        url:'https://data.etabus.gov.hk/v1/transport/kmb/route-eta/'+ route + "/1",
        dataType: 'json',
        async : false,
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
                    response[j] = response[j] + data['data'][i]['eta'].substring(11,16);
                    var diff =(new Date(Date.parse(data['data'][i]['eta'].substring(0,19))).getTime() - new Date(Date.parse(datetimenow)).getTime()) / 1000;
                    diff /= 60;
                    if( diff < 1 ){
                        response[j] = response[j] + " (0 Min)";
                    }
                    else{
                        response[j] = response[j] +" (" + Math.round(diff) + " Min)";
                    }
                    //console.log(response[j]);
                    if(data['data'][i+1]['seq']!=null && data['data'][i+1]['seq']!=data['data'][i]['seq']){
                        j++;
                    }
                }
            }
            //console.log(response);
        }
    });
    return response;
}