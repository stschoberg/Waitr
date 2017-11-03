
var place = ''

function db_CHECK(place_id){
  show_sidebar();
  var in_db = "";
  place = place_id;

  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/samadams/collections/bostonlager?q={\"_id\":\''+place_id+'\'}&c=true&apiKey=Zbl6T1au9m5CD8tySjErpcR1Bb_Qa_IW',
    method: "GET",
  }).done(function(text)
         {
             in_db = text;
             console.log(text);
             console.log(in_db);
             logic_check(in_db,place_id);
         });
}

function logic_check(in_db,place_id){
    console.log(in_db);
    console.log(place_id);
    if (in_db === 0){

          var data = {
          "_id" : place_id,
          "wait_time_2": 0,
          "wait_time_4": 0,
          "wait_time_4plus": 0,
          "Last_sync": 0

          };

          $.ajax({
            url: "https://api.mlab.com/api/1/databases/samadams/collections/bostonlager?apiKey=Zbl6T1au9m5CD8tySjErpcR1Bb_Qa_IW",
            method: "POST",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data)
          }).done(function(response) {
            console.log("Successfully posted message");
            $('#wait_time').html('There is no wait time data yet');
          });

      } else if (in_db === 1){

        $.ajax({
          url:'https://api.mlab.com/api/1/databases/samadams/collections/bostonlager/'+ place +'?apiKey=Zbl6T1au9m5CD8tySjErpcR1Bb_Qa_IW',
          method: "GET",
        }).done(function(response) {
            var wait_in_2 = response["wait_time_2"];
            var wait_in_4 = response["wait_time_4"];
            var wait_in_4plus = response["wait_time_4plus"];
            var time_in = response["Last_sync"];
            $('#wait_time_2').html("The wait time for 2 people is: "+wait_in_2+" minutes");
            $('#wait_time_4').html("The wait time for 4 people is: "+wait_in_4+" minutes");
            $('#wait_time_4plus').html("The wait time for more than 4 people is: "+wait_in_4plus+" minutes");
            $("#Last_sync").html("Last update: " + time_in);
        });


    } else {
      console.log("What the fuck")
    }
}

function db_POST(){
  show_Data();
  var party_size = $('#size_menu option:selected').text();
  var wait_time = $('#time_menu option:selected').text();
  console.log(wait_time);
  var pt_in = '';
  var wt_in_2 = 0;
  var wt_in_4 = 0;
  var wt_in_4plus = 0;

  $.ajax({
    url:'https://api.mlab.com/api/1/databases/samadams/collections/bostonlager/'+ place +'?apiKey=Zbl6T1au9m5CD8tySjErpcR1Bb_Qa_IW',
    method: "GET",
  }).done(function(response) {
      var wait_in_2 = response["wait_time_2"];
      var wait_in_4 = response["wait_time_4"];
      var wait_in_4plus = response["wait_time_4plus"];
      wt_in_2= wait_in_2;
      wt_in_4 = wait_in_4;
      wt_in_4plus = wait_in_4plus;
      place = response["_id"];
      if (party_size === "2"){

        db_POSTpt2(0);
      } else if (party_size === "4"){

        db_POSTpt2(1);
      } else if (party_size === "4+"){

        db_POSTpt2(2);
      } else{
        console.log("What the fuck");
      }

  });
  function db_POSTpt2(x){
    var wait_time_int = Number(wait_time);
    var wt_in_int = 0;
    var mean_wait_2 = 0;
    var mean_wait_4 = 0;
    var mean_wait_4plus = 0;
    if ( x === 0){
      wt_in_int = Number(wt_in_2);
      mean_wait_2 = Math.trunc((wt_in_int + wait_time_int)/2);
      mean_wait_4 = wt_in_4;
      mean_wait_4plus = wt_in_4plus;
    } else if (x === 1){
      wt_in_int = Number(wt_in_4);
      mean_wait_4 = Math.trunc((wt_in_int + wait_time_int)/2);
      mean_wait_2 = wt_in_2;
      mean_wait_4plus = wt_in_4plus;
    } else if (x === 2){
      wt_in_int = Number(wt_in_4plus);
      mean_wait_4plus = Math.trunc((wt_in_int + wait_time_int)/2);
      mean_wait_2 = wt_in_2;
      mean_wait_4 = wt_in_4;
      console.log("4plus")
    };
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " at "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes();
    var data = {
      "_id":place,
      "wait_time_2":mean_wait_2,
      "wait_time_4":mean_wait_4,
      "wait_time_4plus":mean_wait_4plus,
      "Last_sync":datetime
    }

    $.ajax({
      url:'https://api.mlab.com/api/1/databases/samadams/collections/bostonlager?apiKey=Zbl6T1au9m5CD8tySjErpcR1Bb_Qa_IW',
      method: "POST",
      contentType:"application/json; charset=UTF-8",
      data: JSON.stringify(data)
    }).done(function(response){
      console.log("Successfully Updated Wait Time");
      get_update();
    });

    function get_update(){
    $.ajax({
      url:'https://api.mlab.com/api/1/databases/samadams/collections/bostonlager/'+ place +'?apiKey=Zbl6T1au9m5CD8tySjErpcR1Bb_Qa_IW',
      method: "GET",
    }).done(function(response) {
      var wait_in_2 = response["wait_time_2"];
      var wait_in_4 = response["wait_time_4"];
      var wait_in_4plus = response["wait_time_4plus"];
       var time_in= response["Last_sync"];
       $('#wait_time_2').html("The wait time for 2 people is: "+wait_in_2);
       $('#wait_time_4').html("The wait time for 4 people is: "+wait_in_4);
       $('#wait_time_4plus').html("The wait time for more than 4 people is: "+wait_in_4plus);
       $("#Last_sync").html("Last update: " + time_in);
     });
   }
  }


}
function show_sidebar(){
  $('#right-panel').show();
  show_Data();

}
function show_Data(){
  $('#input_form').hide();
  $('#data_form').show();
  $('#wait_time_form').hide();
}

function show_Time(){
  $('#data_form').hide();
  $('#input_form').show();
  $('#wait_time_form').hide();
}

function show_wait_times(){
  $('#data_form').hide();
  $('#input_form').hide();
  $('#wait_time_form').show();
}
