
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

  _Deck1 : {
    ID :'',
    stream_url: '',
    title: '',
    waveform_url: '',
    artwork_url:'',
    genre:'',
  },

  _Deck2 : {
    ID :'',
    title: '',
    waveform_url: '',
    artwork_url:'',
    genre:'',
  },

  init : function(){

  // mixVal._checkAuth();
  mixVal._resizeVideo();
  },

  _listener : function(){
    var playBtn = document.querySelectorAll('.play.one')[0];
   playBtn.addEventListener("click" , mixVal.playDeck1);

   var playBtn = document.querySelectorAll('.play.two')[0];
  playBtn.addEventListener("click" , mixVal.playDeck2);


  },

  setDeck1 : function(sound){
    soundID = sound.attr('data-track');
    SC.get('/tracks/'+soundID).then(function(track) {
      mixVal._Deck1.ID = track.id;
      mixVal._Deck1.title = track.title;
      mixVal._Deck1.waveform_url = track.waveform_url;
      mixVal._Deck1.artwork_url = track.artwork_url;
      mixVal._Deck1.genre = track.genre;
      mixVal._Deck1.stream_url = track.stream_url;

      mixVal.makeDeck1();
    });
  },

  makeDeck1 : function(){
    var wave = document.querySelector('#player1 .wave');
    var title = document.querySelector('#player1 .title');
    var wheel = document.querySelector('#player1 .wheel');
    wave.innerHTML = "<img src='"+mixVal._Deck1.waveform_url+"'/>";
    title.innerHTML = mixVal._Deck1.title;
    wheel.innerHTML = "<img src='"+mixVal._Deck1.artwork_url+"'/>";

  },


    setDeck2 : function(sound){
      soundID = sound.attr('data-track');
      SC.get('/tracks/'+soundID).then(function(track) {
        mixVal._Deck2.ID = track.id;
        mixVal._Deck2.title = track.title;
        mixVal._Deck2.waveform_url = track.waveform_url;
        mixVal._Deck2.artwork_url = track.artwork_url;
        mixVal._Deck2.genre = track.genre;
        mixVal._Deck2.stream_url = track.stream_url;
        mixVal.makeDeck2();
      });
    },

    makeDeck2 : function(){
      var wave = document.querySelector('#player2 .wave');
      var title = document.querySelector('#player2 .title');
      var wheel = document.querySelector('#player2 .wheel');
      wave.innerHTML = "<img src='"+mixVal._Deck2.waveform_url+"'/>";
      title.innerHTML = mixVal._Deck2.title;
      wheel.innerHTML = "<img src='"+mixVal._Deck2.artwork_url+"'/>";

    },


  playDeck1 : function(){

    console.log("asd");
    var context = new AudioContext(),
        gainNode = context.createGain(),
        filter = context.createBiquadFilter(),
        reverb = context.createConvolver(),
        audio = new Audio(),
        source,
        url = 'https://api.soundcloud.com/tracks/'+mixVal._Deck1.ID+'/stream' +
              '?client_id='+mixVal._data.CLIENTID;

    audio.crossOrigin = "anonymous";
    audio.src = url;
    source = context.createMediaElementSource(audio);
    source.mediaElement.play();
    source.connect(context.destination);
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
      mute: false,
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
console.log(me);
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
      mixVal._listener();

      var my = JSON.stringify(me);
      window.localStorage.setItem("scAuth", my);

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
      TrackitemWrapper.innerHTML += '<div class="track-item"><p class="name">'+tracks[song].title+'</p><img class="cover" src="" /><div class="infos"><p class="artist"></p></div><p class="bpm">'+tracks[song].bpm+'</p><p data-track="'+tracks[song].id
+'"class="one deck" onclick="mixVal.setDeck1($(this));">Deck1</p><p onclick="mixVal.setDeck2($(this));"data-track="'+tracks[song].id+'" class="two deck">Deck2</p></div>';
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
