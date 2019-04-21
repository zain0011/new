function scrollToBottom(id){
    var element = document.getElementById(id);
    scroll_top_height = element.scrollTop;
    element.scrollTop = element.scrollHeight;
}

function removeRoomChatElement(){
  var room_chat_length = $(".room_wall").children().length;
  if (room_chat_length > 25) {
    $(".room_wall").children().first().remove();
  }
}

function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.value == current.value && other.display == current.display
    }).length == 0;
  }
}

function parseDate(s) {
 var a = s.split(/[^0-9]/);
 return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5] );
}

function checkRTL(s){
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};

// BIND KEYPRESS
var input = $('input').on('keypress', keypress)[0];

function keypress(e){
    // need to wait for the character
    setTimeout(function(){
        var isRTL = checkRTL( String.fromCharCode(e.charCode) ),
            dir = isRTL ? 'RTL' : 'LTR';

        input.style.direction = dir;
    },0);
}


//

$(document).ready(function(){
  // close all windows when click outside
  $(document).mouseup(function (e) {
    var onlineUsers = $("#onlineUsers");
    var conversations = $("#conversations");
    var rooms = $("#rooms");
    var singleUserPanel = $(".singleUserPanel");
    var settings = $("#settings");
    var private_chat = $(".private_chat");
    var public = $("#public");
    var emoWrapper = $("#emoWrapper");

    if (!onlineUsers.is(e.target) && onlineUsers.has(e.target).length === 0 && !conversations.is(e.target) && conversations.has(e.target).length === 0 && !rooms.is(e.target) && rooms.has(e.target).length === 0 && !singleUserPanel.is(e.target) && singleUserPanel.has(e.target).length === 0 && !settings.is(e.target) && settings.has(e.target).length === 0 && !private_chat.is(e.target) && private_chat.has(e.target).length === 0 && !public.is(e.target) && public.has(e.target).length === 0 && !emoWrapper.is(e.target) && emoWrapper.has(e.target).length === 0) {
      $("#onlineUsers").removeClass("slideshow");
      $("#conversations").removeClass("slideshow");
      $("#rooms").removeClass("slideshow");
      $('.singleUserPanel').removeClass("slideshow");
      $("#settings").removeClass("slideshow");
      $(".private_chat").removeClass("slideshow");
      $('#public').removeClass("slideshow");
      $("#emoWrapper").removeClass("show");
      $('#openUserCaht').val('990')
    }
  });



});
