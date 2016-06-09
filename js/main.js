var mixVal = {


  _data : {
    AUTH : false,
    CLIENTID : 'df0870cdaf901a641c6a00c36a0855f9',
    CALLBACKURL : 'http://localhost/mixval2/callback.html',
    USERNAME : '',

  },

  _userData : {
    ID: ''
  },

  _videoData : {
    1 : "f58Hg5jtjAM",
    2 : "QtXby3twMmI",
    3 : "GaUtvA8wtf0",
    4 : "WE5JV6t9i2g",
    5 : "kdemFfbS5H0",
    6 : ""
  },

  init : function(){

  // mixVal._checkAuth();
  mixVal._resizeVideo();
  },

  _listener : function(){
 var playBtn = document.querySelectorAll('.play.one')[0];
 console.log(playBtn);
   playBtn.addEventListener("click" , mixVal.playDeck1);
  },

  playDeck1 : function(e){
    console.log(e);
    console.log("asdasd");
  },

  _checkAuth : function(){
    if(window.localStorage.getItem("scAuth")){
        var token = window.localStorage.getItem("scAuth");
        mixVal._scAuth();
    }
  },





  _aktivateBtn : function(val){
    var logger = document.getElementById('logger');
    if (val === true){
      logger.classList.add("active");
      logger.addEventListener("click" , mixVal._scAuth);
    } else{
      logger.removeEventListener("click" , mixVal._scAuth);;
      logger.classList.remove("active");
    }
  },




  _checkUsername : function(){
   var UserInput = document.getElementsByClassName('username')[0];
   if(UserInput.value.length > 4){
     mixVal._aktivateBtn(true);
   } else{
     mixVal._aktivateBtn(false);
   }
  },


  _resizeVideo : function(){
    var number = Math.floor((Math.random() * 5) + 1);
    $('#vid').tubular({
      videoId: 'QtXby3twMmI',
      mute: true,
      repeat: true,
      wrapperZIndex: 0,
      start: 15
    });
    $("#vid").css({"width": window.innerWidth + "px"});
    $("#vid").css({"height": window.innerHeight + "px"});
    $("#firstpage").css({"height": window.innerHeight + "px"});
    $("#vid-overlay").css({"width": window.innerWidth + "px"});
    $("#vid-overlay").css({"height": window.innerHeight + "px"});
    $("#mixer").css({"height": window.innerHeight + "px"});
    $("#mixer").css({"width": window.innerWidth + "px"});
  },




  _toggleOverlay : function(){
    var Overlay = document.getElementById("overlay");
    Overlay.classList.toggle("active");
  },




  _scAuth : function(){

    SC.initialize({
      client_id: mixVal._data.CLIENTID,
      redirect_uri : mixVal._data.CALLBACKURL,
    });

  SC.connect().then(function() {
      return SC.get('/me');
    }).then(function(me) {
      mixVal._listener();
      mixVal._userData.ID = me.id;
      mixVal._data.AUTH = true;
      $("#firstpage").toggleClass("active");
      $("#mixer").toggleClass("active");
      mixVal._toggleOverlay();
      mixVal._getFavorites();
      $("#vid").remove();
      $("#tubular-container").remove();
      $("#vid-overlay").remove();
      mixVal._setUserdata(me);
      mixVal._toggleOverlay();

      var my = JSON.stringify(me);
      window.localStorage.setItem("scAuth", my);
      console.log(me);
    });
  },


  _getFavorites: function(){
    var page_size = 100;
    SC.get('/users/'+mixVal._userData.ID+'/favorites').then(function(tracks) {
      mixVal.renderTracks(tracks, 'FAVORITEN');
    });
  },


  renderTracks : function(tracks, headline){

    var TrackitemWrapper = document.getElementsByClassName('tracklist')[0];
    for (var song in tracks){
      console.log(tracks[song]);
      TrackitemWrapper.innerHTML += '<div class="track-item"><p class="name">'+tracks[song].title+'</p><img class="cover" src="" /><div class="infos"><p class="artist"></p></div><p class="bpm">'+tracks[song].bpm+'</p><p data-track="'+tracks[song].stream_url
+'"class="one deck">Deck1</p><p class="two deck">Deck2</p></div>';
    }
    TrackitemWrapper.innerHTML = myTracks;

  },


  _getReposts: function(){
    var page_size = 100;
    SC.get('/users/'+mixVal._userData.ID+'/favorites').then(function(tracks) {

    });
  },

  _setUserdata : function(me){
    // console.log(me);
    // var usericon = document.querySelectorAll(".user-icon")[0];
    // var username = document.querySelectorAll("p.username")[0];
    //   usericon.setAttribute('src',me.avatar_url);
    //   username.innerHTML = me.username;
  }

};

$(function(){
  mixVal.init();
});
