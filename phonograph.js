/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
(function() {
'use strict';

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function exists(obj) {
  return typeof obj !== 'undefined' && obj !== null;
}

function eel(how, what, when, to, huh) {
  what[how](when, to, huh || false);
}

var ael = eel.bind(this, 'addEventListener');
var rel = eel.bind(this, 'removeEventListner');

var Phonograph = {

  init: function() {
    this.audio = document.createElement('audio');
  },
  
  play: function(url) {
    this.playAt(0.0, url);
  },

  playAt: function(position, url) {
    if(!exists(url)) {
      this.audio.currentTime = position;
      return;
    }

    var audio = this.audio;
    var listener = function(e) {
      rel(audio, 'canplay', listener, false);

      audio.currentTime = position;
      audio.play();
    };

    ael(audio, 'canplay', listener, false);
    audio.src = url;
  },

  pause: function() {
    this.audio.pause();
    return true;
  },

  isPaused: function() {
    return this.audio.paused;
  }

};

var Record = Object.create(Phonograph);
  
Record.init = function() {
  this.lastSavedPosition = 0;
  this.tracks = [];
  this.current = 0;
  this.super = Phonograph;

  this.super.init.call(this);

  var self = this;
  ael(self.audio, 'ended', function(e) {
    
    var t = self.tracks;

    if(t.length > 0 && t.length - 1 !== self.current) {
      self.current++;
      self.play();
      self.onTrackChanged();
    }

  }, false);
};

Record.playAt = function(position) {
  var spa = this.super.playAt.call;

  if(!exists(position)) {
    spa(this, this.lastSavedPosition, 
      this.tracks[this.current]);

    return;
  }

  if(this.tracks.length > 0) {
    spa(this, position, this.tracks[this.current]);
  }
};

Record.play = function(tracks) {
  if(exists(tracks)) {
    this.clear();
    this.add(tracks);
    this.current = 0;
  }

  if(tracks.length > 0) {
    this.super.play.call(this, this.tracks[this.current]);
  }
};

Record.add = function(urls) {
  if(!isArray(urls)) {
    this.tracks.push(urls);

    return;
  }

  var add = this.add;
  urls.forEach(function(url) {
    add(url);
  });
};

Record.clear = function() {
  this.tracks = [];
};

Record.savePosition = function() {
    this.lastSavedPosition = this.audio.currentTime;
};

Record.trackChanged = function(callback) {
  this.onTrackChanged = callback;
};

Phonograph.create = Record.create = function() {
  var o = Object.create(this);
  o.init();
  return o;
};

this.Phonograph = Phonograph;
this.Record = Record;

}).call(this);
