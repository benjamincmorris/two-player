var visible;

var getURLParams = function() {
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = location.search.substring(1);

  var urlParams = {};
  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
};

var ondisconnect = function(data) {
  // Redirect to exit survey
  console.log("server booted");
  // $(body).style.display="none";
  $(".slide").each(function() {
    console.log(this)
    document.getElementById(this.id).style.display= "none"
    // $('"#' +this.id + '"').hide()
  })
  $('#header').hide()
  $('#message_panel').hide();
  $('#submitbutton').hide();
  $('#roleLabel').hide();
  $('#score').hide();
  $('#exit_survey').show();
};

var onconnect = function(data) {
  //The server responded that we are now in a game. Remember who we are
  this.my_id = data.id;
  this.players[0].id = this.my_id;
  this.urlParams = getURLParams();
  console.log(this.urlParams);
  // drawScreen(this, this.get_player(this.my_id));
};

var letMeClick = function(game) {
  clockStarted=false
  // Tell server when client types something in the chatbox
  $(window).on('keydown', function(event){

      if (globalGame.get_player(globalGame.my_id).message == '') {
        if (clockStarted != true) {
          startTimer("countdown"); 
          time1 = new Date().getTime();
        }
        clockStarted = true
        if(event.keyCode == 13) {
          time2 = new Date().getTime()
          stopTimer('countdown')
          var origMsg = $('#chatbox').val();
          var msg = 'chatMessage.' + origMsg.replace(/\./g, '~~~')+ '&speaker_target=' + globalGame.target.split(".")[0];
          if(role.includes("speaker")){
            $('.circleArray').each(function() {
              if(this.style.border!=  '') {
                console.log('flagme')
                console.log(this)
                speaker_clicked= this.id
                msg = msg.concat("&speaker_clicked=" + speaker_clicked.split(".")[0])
                console.log(msg)
              }
            })
          }
      // var msg = 'chatMessage.' + origMsg
      if($('#chatbox').val() != '' | msg.includes("&speaker_clicked")) {
        game.socket.send(msg);
        globalGame.sentTyping = false;
        $('#chatbox').val('');
      }
      return false;   
    }
  }
  });
}

// Associates callback functions corresponding to different socket messages
var sharedSetup = function(game) {
  counter=0
  //Store a local reference to our connection to the server
  game.socket = io.connect();

  // Tell other player if someone is typing...
  $('#chatbox').on('input', function() {
    console.log("inputting...");
    if($('#chatbox').val() != "" && !globalGame.sentTyping) {
      game.socket.send('playerTyping.true');
      globalGame.sentTyping = true;
    } else if($("#chatbox").val() == "") {
      game.socket.send('playerTyping.false');
      globalGame.sentTyping = false;
    }
  });

  letMeClick(game)
  
  // Tell server when client types something in the chatbox
  $('form').submit(function(){
    var origMsg = $('#chatbox').val();
    var msg = 'chatMessage.' + origMsg.replace(/\./g, '~~~')+ '&speaker_target=' + globalGame.target.split(".")[0];
    if(role.includes("speaker")){
      $('.toSelect').each(function() {
        if(this.style.border!=  '') {
          console.log(this.alt)
          speaker_clicked= this.alt
          msg = msg.concat("&speaker_clicked=" + speaker_clicked.split(".")[0])
          console.log(msg)
        }
      })
    }
    // var msg = 'chatMessage.' + origMsg
    if($('#chatbox').val() != '' | msg.includes("&speaker_clicked")) {
      game.socket.send(msg);
      globalGame.sentTyping = false;
      $('#chatbox').val('');
    }
    return false;   
  });


  game.socket.on('playerTyping', function(data){
    if(data.typing == "true") {
      $('#messages')
      .append('<span class="typing-msg">Other player is typing...</span>')
      .stop(true,true)
      .animate({
        scrollTop: $("#messages").prop("scrollHeight")
      }, 800);
    } else {
      $('.typing-msg').remove();
    }
  });


  $(".toSelect2").bind("click",  function() {
    console.log('clicking toSelect2...')
    game.socket.send('testing.toSelect2 sent')
  })


  game.socket.on('testing', function(data){
    alert('test is working?')
    console.log('helloooo ' + data)
  });



  $("#sendMessage2").bind("click",  function() {
    //and make these changes to the receiver's screen
    if (globalGame.my_role === game.playerRoleNames.role2) {
        // $("#waiting").fadeIn(500);
        // $("#spinningWaiting").fadeIn(500)
        // $("#topHalfReceiver").fadeTo("slow", .5)
        $(".toSelect").off("click")
        document.getElementById("sendMessage2").disabled = true;
        document.getElementById("sendMessage2").innerHTML = 'Selection Sent!';
        $("#messageFromPartner2").show()

        $(".toSelect").each(function(){
          if(this.style.border=="5px solid black") {
            selection = 'chatMessage.' + this.alt
            console.log(selection)
          }
        })
          game.socket.send(selection);
          globalGame.sentTyping = false;
        return false; 
    }
  })
  
  // Update messages log when other players send chat
  game.socket.on('chatMessage', function(data){
    $(window).off('keyup')
    $(window).off('keydown')
    console.log(data.msg)
    // console.log(document.getElementById('myScore').innerHTML.split(':')[1])
    // scoreCurrent= document.getElementById('myScore').innerHTML.split(':')[1]
    globalGame.messageSe
    nt = true;
    var otherRole = (globalGame.my_role === game.playerRoleNames.role1 ?
         game.playerRoleNames.role2 : game.playerRoleNames.role1);
    console.log(otherRole)
    var source = data.user === globalGame.my_id ? "You" : otherRole;
    console.log(data.user)

    // if the receiver has made a selection, advance the count and move on
    if(!data.msg.includes('&speaker_target')) {
        // show the speaker the selection
        if(role.includes('speaker')) {
          // this enabling wants to live elsewhere?
          letMeClick(globalGame)
          $(".toSelect").each(function(){
            console.log(this)
            if(this.alt.includes(data.msg)) {
              this.style.outline="3px red dashed"
              this.style.zIndex=2
              return falsey
            }
          }) 
          $(".circleArray").each(function(){   
            if(this.id.includes(data.msg)) {
              this.style.outline="3px red dashed"
              this.style.zIndex=2
              return false
            }
          })
        } 
      console.log(speakerTarget)
      counter=counter+1
      experiment.gameWaiting(counter,37+counter, data.msg, speakerTarget, speakerMessage, messageType)
    }

    // if the speaker has sent a message...
    if(data.msg.includes("&speaker_target=")) {
        msgArray = data.msg.split("&")
        console.log(msgArray)
        speakerTarget = msgArray[1]
        speakerMessage = msgArray[0]
        var col = source === "You" ? "#8c8c8c" : "#dddddd";
        $('.typing-msg').remove();
        console.log(msgArray[0])
        if(msgArray[0]=="") {
          $('#messages').text(source + ": " + "*pointed*")
          messageType = 'click'
        } else {
          $('#messages').text(source + ": " + msgArray[0])
          messageType = "label"
        }
    }
    // if the speaker sent a message, make these changes to the listener screen
    if (data.msg.includes('speaker') && role.includes('listener')) {
        $("#topHalfReceiver").fadeTo("slow", 1)
        message=0
        $('.toSelect').on('click', function() {
          console.log('hellllooooo')
          //if neither pointing nor typing has occured, select the target element and note that.
          if (message==0) {
            this.style.border="5px solid black";
            document.getElementById("sendMessage2").disabled = false;
            // possible points determined by the type of trial, receiving a click message or label message  
            document.getElementById("sendMessage2").innerHTML="Select Object for <strong> <em> " +trueLabelPoints+" Possible Points </em> </strong>";
            selection = this.alt;
            message = 1; // change message value to 1 if clicked. 
            isCorrect = 1; // flag as correct. will be overwritten if incorrect. 
            return;
          }
          //if the target has already been clicked on, assume they are 'unclicking' and revert..
          if (message==1) {
            // if you have selected an object, and are trying to click another object, do nothing.
            if (this.style.border!="5px solid black") {return
            // otherwise, revert the selection, check if this is a clicked message situation and make appropriate change 
            } else {this.style.border=""}
            // if there is a label typed out, keep the sendMessage button enabled and change it to 10 possible points
            document.getElementById("sendMessage2").disabled = true;
            document.getElementById("sendMessage2").innerHTML="Make a Selection";
            message=0;
            return;
          }
        });
        //if the sender clicked, register this on listener screen too
        if(data.msg.includes("&speaker_clicked=")){
          $(".toSelect").each(function() {
            if(msgArray[2].includes(this.alt.split('.')[0])){
              this.style.outline= "2px black dashed"
              this.style.zIndex=2
            }
          })
          if (messageType=='label') {
            messageType = 'label_click'
          }
        }
  
    }

    
    // Just in case we want to bar responses until after some message received
    if (source === 'You') {
      console.log('disable everything and move new rounds!!!')
      $(".toSelect").off("click")
      // $(".toSelect").each(function(){
        // console.log('remove hover function   ' + this.id + this.class)
          // $(this).removeClass('toSelect')
          // console.log(this)
      // })
      // $('#messages').empty();    
      console.log($('#messages').last())
      $("#chatbox").attr("disabled", "disabled")
      // $("#main").fadeTo("slow", 0.5)
      if (globalGame.my_role === 'listener') {
        $("#topHalfReceiver").fadeTo("slow", .5)
      } else {
        $("#topHalfSender").fadeTo("slow", .5)
      }
      if(data.msg.includes('speaker_target')) { 
        console.log('fading in because  ' + data.msg)
        $("#waitingMessage").fadeIn(500);
        // $("#spinningWaiting").fadeIn(500)
      }
    } else {
        $("#waitingMessage").hide();
        // $("#spinningWaiting").hide()
      if (globalGame.my_role === 'listener') {
        // $("#referenceGameReceiver").fadeTo("slow", 1)
      } else {
        // $("#referenceGame").fadeTo("slow", 1)
      }
    }
    // if (globalGame.my_role === game.playerRoleNames.role2) {
    //   // $(".toSelect").off("click")
    //   // $(".toSelect").each(function(){
    //   //   console.log('remove hover function   ' + this.id + this.class)
    //   //     $(this).removeClass('toSelect')
    //   //     console.log(this)
    //   // })
    //   $("#waiting").hide();
    //   $("#spinningWaiting").hide()
    //   $("#referenceGameReceiver").fadeTo("slow", 1)
    // }


  });

  //so that we can measure the duration of the game
  game.startTime = Date.now();
  
  //When we connect, we are not 'connected' until we have an id
  //and are placed in a game by the server. The server sends us a message for that.
  game.socket.on('connect', function(){}.bind(game));
  //Sent when we are disconnected (network, server down, etc)
  game.socket.on('disconnect', ondisconnect.bind(game));
  //Sent each tick of the server simulation. This is our authoritive update
  game.socket.on('onserverupdate', client_onserverupdate_received.bind(game));
  //Handle when we connect to the server, showing state and storing id's.
  game.socket.on('onconnected', onconnect.bind(game));
  //On message from the server, we parse the commands and send it to the handlers
  game.socket.on('message', client_onMessage.bind(game));
  // game.socket.on('message', client_onMessage.bind(game));
};

// When loading the page, we store references to our
// drawing canvases, and initiate a game instance.
window.onload = function(){

  console.log('stuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuffstuff')

  // //Create our game client instance.
  // globalGame = new game_core({server: false});
  
  // //Connect to the socket.io server!
  // sharedSetup(globalGame);
  // customSetup(globalGame);
  // globalGame.submitted = false;
    
  // //Fetch the viewport
  // globalGame.viewport = document.getElementById('viewport');

  //Adjust its size
  // globalGame.viewport.width = globalGame.world.width;
  // globalGame.viewport.height = globalGame.world.height;

  //Fetch the rendering contexts
  // globalGame.ctx = globalGame.viewport.getContext('2d');

  //Set the draw style for the font
  // globalGame.ctx.font = '11px "Helvetica"';


};

// This gets called when someone selects something in the menu during the exit survey...
// collects data from drop-down menus and submits using mmturkey
function dropdownTip(data){
  console.log(globalGame);
  var commands = data.split('::');
  switch(commands[0]) {
  case 'human' :
    $('#humanResult').show();
    globalGame.data.subject_information = _.extend(globalGame.data.subject_information, 
               {'thinksHuman' : commands[1]}); break;
  case 'language' :
    globalGame.data.subject_information = _.extend(globalGame.data.subject_information, 
               {'nativeEnglish' : commands[1]}); break;
  case 'partner' :
    globalGame.data.subject_information = _.extend(globalGame.data.subject_information,
               {'ratePartner' : commands[1]}); break;
  case 'confused' :
    globalGame.data.subject_information = _.extend(globalGame.data.subject_information,
               {'confused' : commands[1]}); break;
  case 'submit' :
    globalGame.data.subject_information = _.extend(globalGame.data.subject_information, 
           {'comments' : $('#comments').val(), 
            'role' : globalGame.my_role,
            'totalLength' : Date.now() - globalGame.startTime});
    globalGame.submitted = true;
    console.log("data is...");
    console.log(globalGame.data);
          turk.submit(globalGame.data, true);

    if(_.size(globalGame.urlParams) == 4) {
      window.opener.turk.submit(globalGame.data, true);
      window.close(); 
    } else {
      console.log("would have submitted the following :")
      console.log(globalGame.data);
//      var URL = 'http://web.stanford.edu/~rxdh/psych254/replication_project/forms/end.html?id=' + my_id;
//      window.location.replace(URL);
    }
    break;
  }
}

window.onbeforeunload = function(e) {
  e = e || window.event;
  var msg = ("If you leave before completing the task, "
       + "you will not be able to submit the HIT.");
  // e.returnValue=msg
  if (!globalGame.submitted) {
    // For IE & Firefox
    if (e) {
      e.returnValue = msg;
    }
    // For Safari
    return msg;
  }
};

// // Automatically registers whether user has switched tabs...
(function() {
  document.hidden = hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ('onfocusin' in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide = window.onfocus 
    = window.onblur = onchange;
})();

// function onchange (evt) {
//   var v = 'visible', h = 'hidden',
//       evtMap = { 
//         focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
//       };
//   evt = evt || window.event;
//   if (evt.type in evtMap) {
//     document.body.className = evtMap[evt.type];
//   } else {
//     document.body.className = evt.target.hidden ? "hidden" : "visible";
//   }
//   visible = document.body.className;
//   globalGame.socket.send("h." + document.body.className);
// };

(function () {

  var original = document.title;
  var timeout;

  window.flashTitle = function (newMsg, howManyTimes) {
    function step() {
      document.title = (document.title == original) ? newMsg : original;
      if (visible === "hidden") {
        timeout = setTimeout(step, 500);
      } else {
        document.title = original;
      }
    };
    cancelFlashTitle(timeout);
    step();
  };

  window.cancelFlashTitle = function (timeout) {
    clearTimeout(timeout);
    document.title = original;
  };

}());