
var mixVal = {

  _song1 : '',
  _song2 : '',


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
    time :''
  },

  _Deck2 : {
    ID :'',
    title: '',
    waveform_url: '',
    artwork_url:'',
    genre:'',
    time:''
  },

  init : function(){

  // mixVal._checkAuth();
  mixVal._resizeVideo();
  mixVal._aktivateBtn(true);
  },

  _listener : function(){
    var playBtn = document.querySelectorAll('.play.one')[0];
   playBtn.addEventListener("click" , mixVal.playDeck1);

   var playBtn = document.querySelectorAll('.play.two')[0];
  playBtn.addEventListener("click" , mixVal.playDeck2);

  var playBtn = document.querySelectorAll('.pause.one')[0];
 playBtn.addEventListener("click" , mixVal.pauseDeck1);

 var playBtn = document.querySelectorAll('.pause.two')[0];
playBtn.addEventListener("click" , mixVal.pauseDeck2);

var playBtn = document.querySelectorAll('.cue.one')[0];
playBtn.addEventListener("click" , mixVal.stopDeck1);

var playBtn = document.querySelectorAll('.cue.two')[0];
playBtn.addEventListener("click" , mixVal.stopDeck2);


  document.querySelector('.deck.one .fader input').addEventListener('change', function() {
    mixVal._song1.setVolume(this.value);
  });

  document.querySelector('.deck.two .fader input').addEventListener('change', function() {
    mixVal._song2.setVolume(this.value);

  });

  document.querySelector('#player2 .pitch input').addEventListener('change', function() {
    mixVal._song2.pitchSong(this.value / 1.5);

  });

  document.querySelector('#player1 .pitch input').addEventListener('change', function() {
    mixVal._song1.pitchSong(this.value / 1.5);

  });
},

  setDeck1 : function(sound){
    soundID = sound.attr('data-track');
    SC.get('/tracks/'+soundID).then(function(track) {
      console.log(track);
      mixVal._Deck1.ID = track.id;
      mixVal._Deck1.title = track.title;
      mixVal._Deck1.waveform_url = track.waveform_url;
      mixVal._Deck1.artwork_url = track.artwork_url;
      mixVal._Deck1.genre = track.genre;
      mixVal._Deck1.stream_url = track.stream_url;
      mixVal._Deck1.time = track.duration;
      $("#player1 .wheel").removeClass('spin');
      if(mixVal._song1 != ''){
        mixVal._song1.destroy();
        mixVal._song1 = new SoundItem(mixVal._Deck1.ID);
        // mixVal._song1.setFilterHigh(0);
        // mixVal._song1.setFilterHigLow(0);
      } else{
        // mixVal._song1.setFilterHigh(0);
        // mixVal._song1.setFilterHigLow(0);
          mixVal._song1 = new SoundItem(mixVal._Deck1.ID);
        }
      mixVal.makeDeck1();
    });
  },

  makeDeck1 : function(){
    var wave = document.querySelector('#player1 .wave');
    var title = document.querySelector('#player1 .title');
    var wheel = document.querySelector('#player1 .wheel');
    wave.innerHTML = "<div class='pointer'></div><img src='"+mixVal._Deck1.waveform_url+"'/>";
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
        $("#player2 .wheel").removeClass('spin');
        if(mixVal._song2 != ''){
          mixVal._song2.destroy();
          mixVal._song2 = new SoundItem(mixVal._Deck2.ID);
        } else{
            mixVal._song2 = new SoundItem(mixVal._Deck2.ID);
          }
        mixVal.makeDeck2();
      });
    },

    makeDeck2 : function(){
      var wave = document.querySelector('#player2 .wave');
      var title = document.querySelector('#player2 .title');
      var wheel = document.querySelector('#player2 .wheel');
      wave.innerHTML = "<div class='pointer'></div><img src='"+mixVal._Deck2.waveform_url+"'/>";
      title.innerHTML = mixVal._Deck2.title;
      wheel.innerHTML = "<img src='"+mixVal._Deck2.artwork_url+"'/>";

    },


  playDeck1 : function(){
    $("#player1 .wheel").addClass('spin');
    // $('#player1 .pointer').animate({
    //   width: "100%"
    // },mixVal._Deck1.time);
    mixVal._song1.play();
  },

  playDeck2 : function(){
    $("#player2 .wheel").addClass('spin');
    // $('#player2 .pointer').animate({
    //   width: "100%"
    // },mixVal._Deck2.time);
    $("#player2 .wheel").addClass('spin');
    mixVal._song2.play();
  },

  pauseDeck1 : function(){
    $('#player1 .pointer').stop();
    $("#player1 .wheel").removeClass('spin');
    mixVal._song1.pause();
  },

  pauseDeck2 : function(){
    $('#player1 .pointer').stop();
    $("#player2 .wheel").removeClass('spin');
    mixVal._song2.pause();
  },

  stopDeck1 : function(){
    $("#player1 .wheel").removeClass('spin');
    mixVal._song1.stop();
  },

  stopDeck2 : function(){
    $("#player2 .wheel").removeClass('spin');
    mixVal._song2.stop();
  },



  _checkAuth : function(){
    if(window.localStorage.getItem("scAuth")){
        var token = window.localStorage.getItem("scAuth");
        mixVal._scAuth();
    }
  },





  _aktivateBtn : function(val){
    var logger = document.getElementById('logger');
      logger.classList.add("active");
      logger.addEventListener("click" , mixVal._scAuth);

  },




  _resizeVideo : function(){
    var number = Math.floor((Math.random() * 5) + 1);
    $('#vid').tubular({
      videoId: 'QtXby3twMmI',
      mute: true,
      repeat: true,
      wrapperZIndex: 0,
      start: 20
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
    SC.get('/users/'+mixVal._userData.ID+'/favorites',{}).then(function(tracks) {
      mixVal.renderTracks(tracks, 'FAVORITEN');
    });
  },


  renderTracks : function(tracks, headline){

    var TrackitemWrapper = document.getElementsByClassName('tracklist')[0];
    for (var song in tracks){
      TrackitemWrapper.innerHTML += '<div class="track-item"><p class="name">'+tracks[song].title+'</p><img class="cover" src="'+tracks[song].artwork_url+'" /><div class="infos"></div><p data-track="'+tracks[song].id
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
  checkMidiAccess();
  song = new SoundItem('261496737');

  $("#putty-low-left").roundSlider({
      sliderType: "min-range",
      handleShape: "round",
      width: 10,
      radius: "35",
      value: 0,
      max: "127",
      startAngle: 271,
      change : function(){
        mixVal._song1.setFilterLow($("#putty-low-left").data("roundSlider").getValue());
      }
  });
  $("#putty-high-left").roundSlider({
      sliderType: "min-range",
      handleShape: "round",
      width: 10,
      radius: "35",
      value: 0,
      max: "127",
      startAngle: 271,
      change : function(){
        mixVal._song1.setFilterHigh($("#putty-high-left").data("roundSlider").getValue());
      }
  });
  $("#putty-low-right").roundSlider({
      sliderType: "min-range",
      handleShape: "round",
      width: 10,
      radius: "35",
      value: 0,
      max: "127",
      startAngle: 271,
      change : function(){
        mixVal._song2.setFilterLow($("#putty-low-right").data("roundSlider").getValue());
      }
  });
  $("#putty-high-right").roundSlider({
      sliderType: "min-range",
      handleShape: "round",
      width: 10,
      radius: "35",
      value: 0,
      max: "127",
      startAngle: 271,
      change : function(){
        mixVal._song2.setFilterHigh($("#putty-high-right").data("roundSlider").getValue());
      }
  });

});


function onMIDIFailure(error) {
    console.log("Midi haste nicht... MÖÖÖÖP" + error);
}
