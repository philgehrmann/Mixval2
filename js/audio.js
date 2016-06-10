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
// source.mediaElement.play();


// Fader
source.connect(gainNode);
gainNode.gain.value = 1;
gainNode.connect(filter);

// Filter
filter.type = 'allpass';
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

  document.querySelector('.fader input').addEventListener('change', function() {
		gainNode.gain.value = this.value;
  });


  var midi, data;

  if(navigator.requestMIDIAccess){
  	navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
  }
  else {
  	alert("No MIDI support in your browser.");
  }

 
  function onMIDISuccess(midiAccess) {
    midi = midiAccess; 
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }
  }

  function onMIDIFailure(error) {
      console.log("Midi haste nicht... MÖÖÖÖP" + error);
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
        	console.log('Fader auf ' + velocity);
        break;

        // Play     
        case 2: 
        	if (velocity === 127) {
	          console.log('Hier kommt die Play funktion');
	        }
	      break;

	      // PAUSE
        case 3: 
        	if (velocity === 127) {
	          console.log('Hier kommt die Pause funktion');
	        }
	      break;

    		// Filter
        case 4: 
        	console.log('Filter auf ' + velocity);
        break;

    		// Deck2 Fader
        case 5: 
        	console.log('Fader auf ' + velocity);
        break;

        // Play     
        case 6: 
        	if (velocity === 127) {
	          console.log('Hier kommt die Play funktion');
	        }
	      break;

	      // PAUSE
        case 7: 
        	if (velocity === 127) {
	          console.log('Hier kommt die Pause funktion');
	        }
	      break;

    		// Filter
        case 8: 
        	console.log('Filter auf ' + velocity);
        break;
    }

    // console.log('MIDI data', data);
	}

}









