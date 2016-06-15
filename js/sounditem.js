var SoundItem = (function(trackID){

  var _self = this;
  var tabwert = 1;
  var trackID = trackID;
  var context, gainNode, filter, reverb, audio, source, url;

  function init(){

    _self.createNewSound();
    audio.crossOrigin = "anonymous";
    audio.src = url;
    source = context.createMediaElementSource(audio);
    _self.setOutput();
  }

  this.createNewSound = function(){
    context = new AudioContext();
    gainNode = context.createGain();
    filterLPF = context.createBiquadFilter();
    filterHPF = context.createBiquadFilter();
    reverb = context.createConvolver();
    audio = new Audio();
    source;
    url ='https://api.soundcloud.com/tracks/'+trackID+'/stream?client_id=df0870cdaf901a641c6a00c36a0855f9';

  }

  this.setOutput = function(){
      source.connect(gainNode);
      gainNode.gain.value = 1;
      _self.setFilterLow();
      _self.setFilterHigh();
      gainNode.connect(filterLPF);
      filterLPF.connect(filterHPF);
      filterHPF.connect(context.destination);

    }
  this.setVolume = function(aktValue){
      gainNode.gain.value = aktValue / 127;
    }

  this.play = function(){
    source.mediaElement.play();
  }

  this.pause = function(){
    source.mediaElement.pause();
  }
  this.stop = function(){
    source.mediaElement.disconnect();
  }

  this.setFilterLow = function(val){
    if(val){
      var freq = val * 100 / 2;
    } else{
      freq = 10000;
    }
    console.log(freq);
    filterLPF.type = 'lowpass';
    filterLPF.frequency.value = freq;

  }

  this.setFilterHigh = function(val){
    if(val){
      var freq = val * 100 / 5;
    } else{
      freq = 0.1 * 100;
    }
        console.log(freq);
    filterHPF.type = 'highpass';
    filterHPF.frequency.value = freq;
  }

  this.pitchSong = function(val){
    if(val == 64){
      speed = 1;
    }
    else{
      speed = ((val - 64) * 0.01) + 1;
    }
    source.mediaElement.playbackRate = speed;
  }

  this.pitchSongNew = function(val){
    var oldSpeed = source.mediaElement.playbackRate;
    if(tabwert == 1){
      tabwert = 0;
      source.mediaElement.playbackRate -= val;
       _self.rePitch(oldSpeed, 0);
       }
  }

  this.rePitch = function(val){
        setTimeout(function(){
          source.mediaElement.playbackRate = val;
          tabwert = 1;
        },100);
  }
  this.pitchSongNewFast = function(val){
    var oldSpeed = source.mediaElement.playbackRate;
    if(tabwert == 1){
      tabwert = 0;
      source.mediaElement.playbackRate += val;
       _self.rePitch(oldSpeed, 0);
       }
  }



  this.destroy = function(){
    context.close();
  }
  init();

  return this;

});

var midi, data;
var PitchDeck1 = 64;

function checkMidiAccess(){
  if(navigator.requestMIDIAccess){
    navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
  }
  else {
    alert("No MIDI support in your browser.");
  }
}
function onMIDISuccess(midiAccess) {

  midi = midiAccess;
  var inputs = midi.inputs.values();
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = onMIDIMessage;
  }
}
function onMIDIMessage(event) {
  data = event.data,
  // cmd = data[0] >> 4,
  // channel = data[0] & 0xf,
  // type = data[0] & 0xf0,
  note = data[1],
  velocity = data[2];

  switch (note) {

      // Deck1 Fader
      case 1:
        mixVal._song1.setVolume(velocity);
      break;

      // Play
      case 2:
        if (velocity === 127) {
          $("#player1 .wheel").addClass('spin');
           mixVal._song1.play();
        }
      break;

      // PAUSE
      case 3:
        if (velocity === 127) {
          $("#player1 .wheel").removeClass('spin');
          mixVal._song1.pause();
        }
      break;

      // Filter
      case 4:
      console.log('4');
          mixVal._song1.setFilterLow(velocity);
      break;

      // Deck2 Fader
      case 5:
        mixVal._song2.setVolume(velocity);
      break;

      // Play
      case 6:
        if (velocity === 127) {
          $("#player2 .wheel").addClass('spin');
           mixVal._song2.play();
        }
      break;

      // PAUSE
      case 7:
        if (velocity === 127) {
          $("#player2 .wheel").removeClass('spin');
           mixVal._song2.pause();
        }
      break;

      // Filter
      case 8:
      console.log('8');
        mixVal._song2.setFilterLow(velocity);
      break;

      case 10:
            console.log('10');
        mixVal._song2.setFilterHigh(velocity);
      break;

      case 9:
            console.log('9');
        mixVal._song1.setFilterHigh(velocity);
      break;

      case 11:
        mixVal._song1.pitchSong(velocity);
        PitchDeck1 = velocity;


      break;

      case 12:
        mixVal._song2.pitchSong(velocity);
      break;

      case 13:
      var rech = ((PitchDeck1 - 64) * 0.01) + 1;

      if(velocity = 127){
        mixVal._song1.pitchSongNew(rech - 0.05);
      }else{
        mixval._song1.pitchSongNew(rech);
      }

      break;

      case 14:

      var rech = ((PitchDeck1 - 64) * 0.01) + 1;

      if(velocity = 127){
        mixVal._song1.pitchSongNewFast(rech - 0.05);
      }else{
        mixval._song1.pitchSongNewFast(rech);
      }

      break;

      case 15:

      var rech = ((PitchDeck1 - 64) * 0.01) + 1;

      if(velocity = 127){
        mixVal._song2.pitchSongNew(rech - 0.05);
      }else{
        mixval._song2.pitchSongNew(rech);
      }

      break;

      case 16:

      var rech = ((PitchDeck1 - 64) * 0.01) + 1;

      if(velocity = 127){
        mixVal._song2.pitchSongNewFast(rech - 0.05);
      }else{
        mixval._song2.pitchSongNewFast(rech);
      }

      break;
  }
}
