var context = new AudioContext(),
		gainNode = context.createGain(),
		filter = context.createBiquadFilter(),
		reverb = context.createConvolver(),
    audio = new Audio(),
    source,
    url = 'https://api.soundcloud.com/tracks/267975150/stream' +
          '?client_id=df0870cdaf901a641c6a00c36a0855f9';

audio.crossOrigin = "anonymous";
audio.src = url;
source = context.createMediaElementSource(audio);


// Fader
source.connect(gainNode);
gainNode.gain.value = 1;
gainNode.connect(filter);

// Filter
filter.type = 'lowpass'; 
filter.frequency.value = 4440;
filter.connect(context.destination);

// Reverb
// source.connect(reverb);
var impulse, reverbBuffer;

ajaxRequest = new XMLHttpRequest();
ajaxRequest.open('GET', 'impulse/longhall.wav', true);
ajaxRequest.responseType = 'arraybuffer';

ajaxRequest.onload = function() {
  var audioData = ajaxRequest.response;
  context.decodeAudioData(audioData, function(buffer) {
      reverbBuffer = buffer;
      impulse = context.createBufferSource();
      impulse.buffer = reverbBuffer;
    }, function(e){"Error with decoding audio data" + e.err});
}
ajaxRequest.send();
reverb.buffer = reverbBuffer;

// reverb.connect(context.destination);



// Fader Control
// document.querySelector('.fader').value = '1';
window.onload = function () {
  document.querySelector('.fader').addEventListener('change', function() {
		gainNode.gain.value = this.value;
  });
};






