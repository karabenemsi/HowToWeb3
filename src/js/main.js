Reveal.initialize({
	controls: true,
	progress: true,
	controlsTutorial: false,
	history: true,
	center: true,
	controlsBackArrows: 'faded',
	// Display the page number of the current slide
	slideNumber: true,
	// Enable keyboard shortcuts for navigation
	keyboard: true,

	// Enable the slide overview mode
	overview: true,

	// Vertical centering of slides
	center: true,

	// Enables touch navigation on devices with touch input
	touch: true,

	// Loop the presentation
	loop: false,

	// Turns fragments on and off globally
	fragments: true,

	// Flags whether to include the current fragment in the URL,
	// so that reloading brings you to the same fragment position
	fragmentInURL: false,

	// Flags if the presentation is running in an embedded mode,
	// i.e. contained within a limited portion of the screen
	embedded: false,

	// Flags if we should show a help overlay when the questionmark
	// key is pressed
	help: true,

	// Flags if speaker notes should be visible to all viewers
	showNotes: false,
	// Specify the average time in seconds that you think you will spend
	// presenting each slide. This is used to show a pacing timer in the
	// speaker view
	defaultTiming: 120,
	// Hides the address bar on mobile devices
	hideAddressBar: true,


	transition: 'slide', // none/fade/slide/convex/concave/zoom
	// Number of slides away from the current that are visible
	viewDistance: 3,

	// Parallax background image
	// parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',

	// Parallax background size
	// parallaxBackgroundSize: 'cover', // CSS syntax, e.g. "2100px 900px"

	// Number of pixels to move the parallax background per slide
	// - Calculated automatically unless specified
	// - Set to 0 to disable movement along an axis
	parallaxBackgroundHorizontal: null,
	parallaxBackgroundVertical: null,

	// The display mode that will be used to show slides
	display: 'block',
	// The "normal" size of the presentation, aspect ratio will be preserved
	// when the presentation is scaled to fit different resolutions. Can be
	// specified using percentage units.
	width: "100%",
	height: "100%",

	// Factor of the display size that should remain empty around the content
	margin: 0,

	// Bounds for smallest/largest possible scale to apply to content
	minScale: 1,
	maxScale: 1,

	// Optional reveal.js plugins
	dependencies: [
		{ src: '/js/vendor/classList.js', condition: function() { return !document.body.classList; } },
		{ src: 'js/vendor/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
		{ src: 'js/vendor/notes/notes.js', async: true }
	]
});
