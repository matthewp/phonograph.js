isArray = (obj) ->
	Object.prototype.toString.call obj is '[object Array]'

class Phonograph
	constructor: (element) ->
		if not element.audioElement?
			throw "This element is not an audio tag"
		@audio = element.audioElement

	play: (url) ->
		if not url?
			@audio.play()
		else
			listener = (e) =>
				@audio.removeEventListener "canplay", listener, false
				@audio.currentTime = 0.0
				@audio.play()

			@audio.addEventListener "canplay", listener, false
			@audio.src = url

	playAt: (position, url) ->
		if not url?
			@audio.currentTime = position
		else
			listener = (e) =>
				@audio.removeEventListener "canplay", listener, false
				@audio.currentTime = position
				@audio.play()

			@audio.addEventListener "canplay", listener, false
			@audio.src = url

	pause: ->
		@audio.pause()
		true

	isPaused: ->
		@audio.paused

class Record extends Phonograph
	constructor: (element) ->
		@lastSavedPosition = 0
		@tracks = []
		@current = 0

		@audio.addEventListener "ended", () =>
			if @tracks.length > 0 and @tracks.length - 1 != @current
				@current++
				@play()
				@onTrackChanged

		super element

	play: (tracks) ->
		if tracks?
			@clear()
			@add tracks
			@current = 0
		
		super @tracks[@current] if @tracks.length > 0

	playAt: (position) ->
		if not position?
			super @lastSavedPosition, @tracks[@current]

		if @tracks.length > 0
			super position, @tracks[@current]

	add: (urls) ->
		if isArray urls
			@add url for url in urls
		else
			@tracks.push urls

	clear: -> @tracks = []

	savePosition: -> @lastSavedPosition = @audio.currentTime

	trackChanged: (callback) ->
		@onTrackChanged = callback
